import express from "express";
import { createServer } from "node:http";
import { createBareServer } from "@tomphttp/bare-server-node";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;

const bare = createBareServer("/bare/");
const app = express();

// Serve Scramjet client files from node_modules
const scramjetPath = dirname(
  fileURLToPath(import.meta.resolve("@mercuryworkshop/scramjet/package.json"))
);
app.use("/scram/", express.static(join(scramjetPath, "dist")));

// Serve bare-mux + transports
const bareMuxPath = dirname(
  fileURLToPath(import.meta.resolve("@mercuryworkshop/bare-as-module3/package.json"))
);
app.use("/baremux/", express.static(join(bareMuxPath, "dist")));

const epoxyPath = dirname(
  fileURLToPath(import.meta.resolve("@mercuryworkshop/epoxy-transport/package.json"))
);
app.use("/epoxy/", express.static(join(epoxyPath, "dist")));

const libcurlPath = dirname(
  fileURLToPath(import.meta.resolve("@mercuryworkshop/libcurl-transport/package.json"))
);
app.use("/libcurl/", express.static(join(libcurlPath, "dist")));

// Static UI
app.use(express.static(join(__dirname, "public")));

const server = createServer();
server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) bare.routeRequest(req, res);
  else app(req, res);
});
server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) bare.routeUpgrade(req, socket, head);
  else socket.end();
});

server.listen(PORT, () => {
  console.log(`Snoopy's Web proxy running on http://localhost:${PORT}`);
});
