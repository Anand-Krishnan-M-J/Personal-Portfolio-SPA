import { access, cp, mkdir } from "node:fs/promises";

const standaloneRoot = ".next/standalone";

await access(`${standaloneRoot}/server.js`);
await mkdir(`${standaloneRoot}/.next`, { recursive: true });
await Promise.all([
  cp("public", `${standaloneRoot}/public`, { recursive: true }),
  cp(".next/static", `${standaloneRoot}/.next/static`, { recursive: true }),
]);

console.log("Standalone assets packaged.");
