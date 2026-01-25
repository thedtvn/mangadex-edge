import type { Context } from "hono";
import { DEFAULT_HEADERS } from "../constants/headers";
import { sendRequest, getResponseHeaders, convertHeadersResponseHeaders } from "../utils/request";

/**
 * Handle API proxy requests to MangaDex API
 * Route: /api/*
 */
export async function handleApiProxy(c: Context) {
    const urlObj = new URL(c.req.url);
    const rest = urlObj.pathname.split(`/api/`)[1];
    const url = `https://api.mangadex.org/${rest}${urlObj.search}`;
    
    const body = await c.req.arrayBuffer();
    const requestHeaders: Record<string, string> = { ...DEFAULT_HEADERS };
    const headers = c.req.header();
    for (const key in headers) {
        if (requestHeaders[key]) continue; // Skip default headers
        if (key == "referer") {
            requestHeaders[key] = "https://mangadex.org/";
            continue;
        };
        if (key == "origin") {
            requestHeaders[key] = "https://mangadex.org";
            continue;
        }
        const value = headers[key];
        if (value) {
            requestHeaders[key] = value;
        }
    }
    const res = await sendRequest(
        url,
        requestHeaders,
        c.req.method,
        body.byteLength ? body : undefined
    );
    
    const responseHeaders = getResponseHeaders(res);
    
    // Handle none body responses
    if (!res.body) {
        return c.status(res.status as any);
    }
    
    // Check if response is JSON before parsing
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        // Return non-JSON response as-is
        return new Response(res.body, { status: res.status, headers: convertHeadersResponseHeaders(responseHeaders) });
    }
    
    const resBody: any = await res.json();
    
    // Rewrite CDN URLs to proxy through this service
    if (resBody.baseUrl) {
        const cdnUrl = new URL(resBody.baseUrl);
        const domainId = cdnUrl.hostname.split(".")[0];
        resBody.baseUrl = `/images/${domainId}${cdnUrl.pathname.slice(1)}`;
    }
    
    return c.json(resBody, res.status as any, responseHeaders);
}
