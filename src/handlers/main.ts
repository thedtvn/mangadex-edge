import type { Context } from "hono";
import { DEFAULT_HEADERS } from "../constants/headers";
import { sendRequest, getResponseHeaders } from "../utils/request";
import { modifyJS } from "../utils/jsendpoint";

/**
 * Handle main proxy requests to MangaDex
 * Route: *
 */
export async function handleMainProxy(c: Context) {
    
    const body = await c.req.arrayBuffer();
    const url = new URL(c.req.url);
    const res = await sendRequest(
        `https://mangadex.org${url.pathname}${url.search}`,
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
    
    if (responseHeaders["content-type"]?.every((type) => !type.includes("application/javascript"))) {
        const body = await res.arrayBuffer();
        return c.body(body, res.status as any, responseHeaders);
    }

    const modifiedJS = await modifyJS(await res.text(), url);

    return c.html(modifiedJS, 200, responseHeaders);
}
