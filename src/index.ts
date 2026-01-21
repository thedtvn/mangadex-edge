import { Hono } from "hono";
import { handleImageProxy } from "./handlers/images";
import { handleApiProxy } from "./handlers/api";
import { handleMainProxy } from "./handlers/main";
import handleKcProxy from "./handlers/kcproxy";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/", handleKcProxy);

// Image CDN proxy route
app.all("/images/:id/*", handleImageProxy);

// MangaDex API proxy route
app.all("/api/*", handleApiProxy);

// Main MangaDex site proxy (catch-all)
app.all("*", handleMainProxy);

export default app;
