import type { Context } from "hono";
import { DEFAULT_HEADERS } from "../constants/headers";
import { sendRequest, getResponseHeaders, convertHeadersResponseHeaders } from "../utils/request";
import { modifyHtml } from "../utils/html";

/**
 * Handle upload proxy requests to MangaDex
 * Route: *
 */
export async function handleUploadProxy(c: Context) {
    const body = await c.req.arrayBuffer();
    const url = new URL(c.req.url);
    const pathReal = url.pathname.split(`/uploads`)[1];
    const res = await sendRequest(
        `https://uploads.mangadex.org${pathReal}${url.search}`,
        DEFAULT_HEADERS,
        c.req.method,
        body.byteLength ? body : undefined
    );
    
    const responseHeaders = getResponseHeaders(res);
    
    if (!res.body) {
        return c.status(res.status as any);
    }
    return new Response(res.body, { status: res.status, headers: convertHeadersResponseHeaders(responseHeaders) });
}
