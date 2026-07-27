
/**
 * Modify MangaDex JavaScript to inject custom configuration
 */
export function modifyJS(js_content: string, url: URL): string {
    const map_replace = {
        apiUrl: url.origin + "/api",
        baseUrl: url.origin,
        cdnEdge: url.origin,
        cdnOrigin: url.origin + "/uploads",
        kcUrl: url.origin + "/keycloak",
    };
    console.log("Modifying JS with the following replacements:", map_replace, "for URL:", url.href);
    for (const [key, value] of Object.entries(map_replace)) {
        // matching "cdnOrigin: `https://uploads.mangadex.org`"
        const regex = new RegExp(`${key}:\\s*\`.*?\``, "g");
        console.log(`Replacing ${key} with ${value}`);
        js_content = js_content.replace(regex, `${key}: \`${value}\``);
    }
    return js_content;
}
