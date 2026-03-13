import { getCustomConfig } from "../constants/config";

/**
 * Modify MangaDex HTML to inject custom configuration
 */
export function modifyHtml(html: string, url: URL): string {
    const originalConfigMatch = html.match(/window\.__NUXT__\.config=(.+?)</s);
    const configLiteral = originalConfigMatch?.[1];
    if (!configLiteral) {
        return html;
    }

    // Nuxt config is a JS object literal, so quote bare keys before JSON.parse.
    const jsonLikeConfig = configLiteral.replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
    const originalConfig = JSON.parse(jsonLikeConfig);
    const customConfig = getCustomConfig(url, originalConfig);
    return html.replace(
        /window\.__NUXT__\.config=.+?</s,
        `window.__NUXT__.config=${JSON.stringify(customConfig)}<`
    );
}
