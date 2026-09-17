import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

let gitCheckoutAvailable = existsSync(".git");

if (gitCheckoutAvailable) {
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" });
  } catch {
    gitCheckoutAvailable = false;
  }
}

if (!gitCheckoutAvailable) {
  console.log("Skipping Git hooks because this folder is not a Git checkout.");
  process.exit(0);
}

const { default: husky } = await import("husky");
const message = husky();

if (message) {
  throw new Error(`Husky setup failed: ${message}`);
}
