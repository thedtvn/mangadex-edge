# Mangadex Edge

A Cloudflare Workers-based edge proxy for MangaDex that bypasses country blocks and provides enhanced accessibility.

## Features

- **Country Block Bypass**: Access MangaDex from regions where it's blocked
- **Third-Party Cookie Workaround**: Login functionality when browsers block 3rd party cookies
- **Edge Caching**: Improved performance through Cloudflare's edge network
- **Future-Proof**: All requests are proxied through this edge, allowing for quick fixes without waiting for MangaDex.org updates

> **Note**: 2FA authentication is not yet supported.

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/) - Web framework
- TypeScript

## Prerequisites

- Node.js (v18 or higher)
- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mangadex-edge
```

2. Install dependencies:
```bash
npm install
```

3. Configure Wrangler (if needed):
Edit [wrangler.jsonc](wrangler.jsonc) to customize your worker settings.

## Development

Run the development server locally:

```bash
npm run dev
```

This starts a local development server with hot reloading.

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

The worker will be deployed to your Cloudflare account and accessible via your Workers subdomain.

## Usage

Once deployed, replace MangaDex URLs with your worker's URL:
- Original: `https://mangadex.org/...`
- Proxied: `https://your-worker.workers.dev/...`

## Disclaimer

⚠️ **Important Legal and Security Notices**

- **Account Safety**: There is no guarantee that using this proxy will prevent your account from being banned. Use at your own risk.
- **Unofficial Service**: This is NOT an official MangaDex service.
- **No Liability**: The maintainers are not responsible for any consequences, including account bans or data loss.
- **Terms of Service**: By using this service, you acknowledge that you've read and accept these risks.

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


