import { Hono } from "hono";
import { DEFAULT_HEADERS } from "../constants/headers";
import { sendRequest, getResponseHeaders } from "../utils/request";
import kcLoginHtml from "../resources/kcLogin.html";
import kcApplyLoginTokenHtml from "../resources/kcApplyLoginToken.html";

const app = new Hono();

const kcRoute = app.basePath("/keycloak/");

// Generate random code_verifier (43 characters for PKCE)
function generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Generate code_challenge from code_verifier using S256
async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

kcRoute.all("/realms/mangadex/.well-known/openid-configuration", async (c) => {
    const url = `https://auth.mangadex.org/realms/mangadex/.well-known/openid-configuration`;
    
    const body = await c.req.arrayBuffer();
    const res = await sendRequest(
        url,
        DEFAULT_HEADERS,
        c.req.method,
        body.byteLength ? body : undefined
    );
    const responseHeaders = getResponseHeaders(res);
    
    if (!res.ok && res.body) {
        return c.body(res.body, res.status as any, responseHeaders);
    } else if (!res.ok) {
        return c.status(res.status as any);
    }
    const resBody: any = await res.text();
    const modifed = resBody.replaceAll("https://auth.mangadex.org/", new URL(c.req.url).origin + "/keycloak/");
    return c.body(modifed, res.status as any, responseHeaders);
});

kcRoute.get("/realms/mangadex/protocol/openid-connect/auth", async (c) => {
    return c.html(kcLoginHtml);
});

kcRoute.post("/realms/mangadex/protocol/openid-connect/auth", async (c) => {
    const url = `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/auth`;
    const {
        client_id,
        redirect_uri,
        response_type,
        state,
        scope,
        code_challenge,
        code_challenge_method
    } = c.req.query();
    const body = await c.req.formData();
    const password = body.get("password");
    const username = body.get("username");
    const rememberMe = body.get("rememberMe") == "1";
    
    const backendVerifier = generateCodeVerifier();
    const backendChallenge = await generateCodeChallenge(backendVerifier);
    
    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("redirect_uri", "https://mangadex.org/auth/login?afterAuthentication=/&shouldRedirect=true&wasPopup=false");
    params.append("response_type", response_type);
    params.append("state", state);
    params.append("scope", scope);
    params.append("code_challenge", backendChallenge);
    params.append("code_challenge_method", "S256");
    const req = await sendRequest(
        url + "?" + params.toString(),
        DEFAULT_HEADERS,
        "GET"
    );
    const bodyText = await req.text();
    const postUrl = bodyText.match(/action="([^"]+)"/)?.[1].replaceAll("&amp;", "&");
    if (!postUrl) {
        const urlObj = new URL(c.req.url);
        urlObj.searchParams.set("error", "Error initiating login");
        return c.redirect(urlObj.toString());
    }
    const cookies = req.headers.getAll("set-cookie") || "";
    const postReq = await sendRequest(
        postUrl,
        {
            ...DEFAULT_HEADERS,
            "cookie": cookies.join("; "),
            "content-type": "application/x-www-form-urlencoded"
        },
        "POST",
        new URLSearchParams({
            username: username as string,
            password: password as string,
            credentialId: "",
            rememberMe: rememberMe ? "on" : "off"
        }).toString(),
        "manual"
    );
    const location = postReq.headers.get("location");
    if (!location?.startsWith("https://mangadex.org")) {
        const urlObj = new URL(c.req.url);
        urlObj.searchParams.set("error", "Password or username incorrect Or disable 2fa");
        return c.redirect(urlObj.toString());
    }
    const searchParams = new URL(location).searchParams;
    const code = searchParams.get("code");
    
    const form = new URLSearchParams();
    form.append("grant_type", "authorization_code");
    form.append("client_id", client_id as string);
    form.append("code", code as string);
    form.append("redirect_uri", "https://mangadex.org/auth/login?afterAuthentication=/&shouldRedirect=true&wasPopup=false");
    form.append("code_verifier", backendVerifier);
    const resp = await sendRequest(
        "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token",
        {
            ...DEFAULT_HEADERS, 
            "content-type": "application/x-www-form-urlencoded"
        },
        "POST",
        form.toString()
    );
    const jsonData: any = await resp.json();
    const userInfo = await sendRequest(
        "https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/userinfo",
        {
            ...DEFAULT_HEADERS,
            "authorization": `Bearer ${jsonData.access_token}`
        },
        "GET"
    );
    const userInfoData: any = await userInfo.json();
    jsonData.profile = userInfoData;
    const b64Content = btoa(JSON.stringify(jsonData));
    return c.redirect(`/keycloak/login?response=${b64Content}`);
});

kcRoute.post("/realms/mangadex/protocol/openid-connect/token", async (c) => {
    const url = `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`;
    
    const body = await c.req.arrayBuffer();
    const res = await sendRequest(
        url,
        { 
            ...DEFAULT_HEADERS, 
            "content-type": "application/x-www-form-urlencoded",
            "referer": "https://mangadex.org/",
            "origin": "https://mangadex.org"
        },
        c.req.method,
        body.byteLength ? body : undefined
    );
    const responseHeaders = getResponseHeaders(res);
    if (!res.ok && res.body) {
        return c.body(res.body, res.status as any, responseHeaders);
    } else if (!res.ok) {
        return c.status(res.status as any);
    }
    const resBody: any = await res.json();
    return c.json(resBody, res.status as any, responseHeaders);
});

kcRoute.get("login", async (c) => {
    // If no response param, redirect to homepage
    if (!c.req.query("response")) {
        return c.redirect("/");
    };
    return c.html(kcApplyLoginTokenHtml);
});

kcRoute.get("/realms/mangadex/protocol/openid-connect/logout", async (c) => {
    return c.html(`
    <script>
        for (const key of Object.keys(localStorage)) {
            if (!key.startsWith('oidc.user:')) continue;
            localStorage.removeItem(key);
        }
        window.location.href = '/';
    </script>`);
});

export default app;