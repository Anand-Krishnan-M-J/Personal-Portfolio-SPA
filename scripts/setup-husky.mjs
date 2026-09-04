import { existsSync } from "node:fs";

if (!existsSync(".git")) {
  console.log("Skipping Git hooks because this folder is not a Git checkout.");
  process.exit(0);
}

const { default: husky } = await import("husky");
const message = husky();

if (message) {
  throw new Error(`Husky setup failed: ${message}`);
}
