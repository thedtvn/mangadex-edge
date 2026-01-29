import { Hono } from "hono";
import { handleImageProxy } from "./handlers/images";
import { handleApiProxy } from "./handlers/api";
import { handleMainProxy } from "./handlers/main";
import { handleUploadProxy } from "./handlers/upload";
import handleKcProxy from "./handlers/kcproxy";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", handleKcProxy);

// Image CDN proxy route
app.all("/images/:id/*", handleImageProxy);

// MangaDex API proxy route
app.all("/api/*", handleApiProxy);

app.all("/uploads/*", handleUploadProxy);

// Prevent web crawlers from indexing the proxy
app.all("/robots.txt", async (c) => {
    return c.text("User-agent: *\nDisallow: /", 200, { "Content-Type": "text/plain" });
}

// Main MangaDex site proxy (catch-all)
app.all("*", handleMainProxy);

export default app;
