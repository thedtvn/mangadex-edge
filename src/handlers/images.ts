import type { Context } from "hono";
import { DEFAULT_HEADERS } from "../constants/headers";
import { sendRequest, getResponseHeaders } from "../utils/request";

/**
 * Handle image proxy requests from MangaDex CDN
 * Route: /images/:id/*
 */
export async function handleImageProxy(c: Context) {
    const { id } = c.req.param();
    const rest = new URL(c.req.url).pathname.split(`/images/${id}/`)[1];
    const url = `https://${id}.mangadex.network/${rest}`;
    
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
    
    const resBody = await res.arrayBuffer();
    return c.body(resBody, res.status as any, responseHeaders);
}
