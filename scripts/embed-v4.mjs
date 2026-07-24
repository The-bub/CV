// One-shot refresh of the embedded V4 snapshot served at /v4/.
// Builds the V4 branch with base=/v4/, copies it into public/v4, and injects
// the "back to the latest version" banner. Run from the cv-site directory with
// a clean working tree:  npm run embed:v4
import { execSync } from "node:child_process";
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SRC_BRANCH = "V4";
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const out = (cmd) => execSync(cmd).toString().trim();

if (out("git status --porcelain")) {
  console.error(
    "✗ Arbre de travail non propre — committe ou stash tes changements avant d'embarquer la V4.",
  );
  process.exit(1);
}

const current = out("git rev-parse --abbrev-ref HEAD");
const tmp = join(tmpdir(), `v4-embed-${Date.now()}`);

try {
  console.log(`→ build de la branche ${SRC_BRANCH} avec base=/v4/`);
  run(`git checkout ${SRC_BRANCH}`);
  run("npm run build -- --base=/v4/");
  mkdirSync(tmp, { recursive: true });
  cpSync("dist", tmp, { recursive: true });
} finally {
  run(`git checkout ${current}`);
}

console.log("→ copie dans public/v4");
rmSync("public/v4", { recursive: true, force: true });
mkdirSync("public/v4", { recursive: true });
cpSync(join(tmp, "index.html"), "public/v4/index.html");
if (existsSync(join(tmp, "favicon.svg")))
  cpSync(join(tmp, "favicon.svg"), "public/v4/favicon.svg");
cpSync(join(tmp, "assets"), "public/v4/assets", { recursive: true });
rmSync(tmp, { recursive: true, force: true });

console.log("→ injection de la bannière « version actuelle »");
run("node scripts/inject-v4-banner.mjs");
console.log(`✓ V4 ré-embarquée dans public/v4 (de retour sur ${current})`);
