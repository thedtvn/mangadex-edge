import { getCustomConfig } from "../constants/config";

/**
 * Modify MangaDex HTML to inject custom configuration
 */
export function modifyHtml(html: string, url: URL): string {
    const customConfig = getCustomConfig(url);
    return html.replace(
        /window.__NUXT__.config=.*?</,
        `window.__NUXT__.config=${JSON.stringify(customConfig)}<`
    );
}
