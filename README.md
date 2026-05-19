# Snoopy's Web — Scramjet Proxy

A real web proxy powered by [Scramjet](https://github.com/MercuryWorkshop/scramjet).
Unlike CORS workarounds, this fully proxies pages (HTML, JS, WebSockets) so sites
like YouTube, Discord, and games actually load.

## Local run

```bash
npm install
npm start
# open http://localhost:8080
```

## Deploy to Render (recommended, free tier works)

1. Push this folder to a GitHub repo.
2. Go to https://render.com → **New → Web Service** → connect the repo.
3. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Deploy. You get a URL like `https://snoopys-web.onrender.com`.

## Deploy to Railway / Fly.io / a VPS

Same idea — any Node 18+ host that supports WebSockets works.
**Vercel/Netlify will NOT work** — they don't support persistent WebSocket
connections that the bare server needs.

## Embed in Google Sites

In Google Sites: **Insert → Embed → By URL** and paste your deployed URL.
If your school's network blocks the Render domain, you'll need a custom
domain pointed at the same service.

## How it works

- `@tomphttp/bare-server-node` — backend that fetches sites for the browser
- `@mercuryworkshop/scramjet` — client-side service worker that rewrites
  every request, cookie, JS import, and WebSocket to go through the bare server
- `bare-mux` + `epoxy-transport` — the WISP/WebSocket transport layer

## ⚠️ Notes

- Some sites (banks, Cloudflare-protected sites with strict bot checks) will still block.
- Service Workers require **HTTPS** in production — Render provides this automatically.
- This is for educational use. Respect your school's acceptable use policy.
