/**
 * Send HTTP request with optional body
 * Can be extended for logging, fake SNI, etc.
 */
export async function sendRequest(
    url: string,
    headers: Record<string, string>,
    method: string,
    body?: any
): Promise<Response> {
    return fetch(url, {
        body,
        headers,
        method
    });
}

/**
 * Convert response headers to object
 */
export function getResponseHeaders(res: Response): Record<string, string[]> {
    const headers: Record<string, string[]> = {};
    res.headers.forEach((value, key) => {
        if (headers[key]) {
            headers[key].push(value);
        } else {
            headers[key] = [value];
        }
    });
    return headers; 
}

export function convertHeadersResponseHeaders(res: Record<string, string[]>): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const key in res) {
        headers[key] = res[key].join(', ');
    }
    return headers;
}