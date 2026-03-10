import { getCustomConfig, type NuxtConfig } from "../constants/config";

/**
 * Extract the JSON object for window.__NUXT__.config from HTML by counting braces.
 */
function extractNuxtConfig(html: string): string | null {
    const prefix = "window.__NUXT__.config=";
    const start = html.indexOf(prefix);
    if (start === -1) return null;
    const jsonStart = html.indexOf("{", start + prefix.length);
    if (jsonStart === -1) return null;
    let depth = 0;
    for (let i = jsonStart; i < html.length; i++) {
        if (html[i] === "{") depth++;
        else if (html[i] === "}") {
            depth--;
            if (depth === 0) return html.slice(jsonStart, i + 1);
        }
    }
    return null;
}

/**
 * Modify MangaDex HTML to inject custom configuration
 */
export function modifyHtml(html: string, url: URL): string {
    const rawConfig = extractNuxtConfig(html);
    let originalConfig: NuxtConfig | null = null;
    if (rawConfig) {
        try {
            originalConfig = JSON.parse(rawConfig) as NuxtConfig;
        } catch {
            // ignore parse errors and fall back to defaults
        }
    }
    const customConfig = getCustomConfig(url, originalConfig);
    const serialized = JSON.stringify(customConfig);
    if (rawConfig) {
        return html.replace(
            `window.__NUXT__.config=${rawConfig}`,
            `window.__NUXT__.config=${serialized}`
        );
    }
    return html;
}
