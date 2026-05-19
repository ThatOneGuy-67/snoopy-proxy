import express from "express";
import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

// --- paths setup ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const PORT = process.env.PORT || 8080;

// --- bare server ---
const bare = createBareServer("/bare/");
const app = express();

/**
 * Helper: safely resolve package directories
 * (this avoids all import.meta.resolve + exports issues)
 */
function pkgDir(pkg) {
  return dirname(require.resolve(pkg));
}

// --- Scramjet client ---
const scramjetPath = pkgDir("@mercuryworkshop/scramjet");
app.use("/scram/", express.static(join(scramjetPath, "dist")));

// --- BareMux ---
const bareMuxPath = pkgDir("@mercuryworkshop/bare-as-module3");
app.use("/baremux/", express.static(join(bareMuxPath, "dist")));

// --- Epoxy transport ---
const epoxyPath = pkgDir("@mercuryworkshop/epoxy-transport");
app.use("/epoxy/", express.static(join(epoxyPath, "dist")));

// --- Libcurl transport ---
const libcurlPath = pkgDir("@mercuryworkshop/libcurl-transport");
app.use("/libcurl/", express.static(join(libcurlPath, "dist")));

// --- static frontend ---
app.use(express.static(join(__dirname, "public")));

// --- HTTP server ---
const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

// --- start ---
server.listen(PORT, () => {
  console.log(`Snoopy's Web proxy running on http://localhost:${PORT}`);
});
