// One-shot refresh of the embedded V5 snapshot served at /v5/.
// Builds the V5 branch with base=/v5/, copies it into public/v5, and injects
// the "back to the main site" banner. Run from the cv-site directory with a
// clean working tree:  npm run embed:v5
import { execSync } from "node:child_process";
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SRC_BRANCH = "V5";
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const out = (cmd) => execSync(cmd).toString().trim();

if (out("git status --porcelain")) {
  console.error(
    "✗ Arbre de travail non propre — committe ou stash tes changements avant d'embarquer la V5.",
  );
  process.exit(1);
}

const current = out("git rev-parse --abbrev-ref HEAD");
const tmp = join(tmpdir(), `v5-embed-${Date.now()}`);

try {
  console.log(`→ build de la branche ${SRC_BRANCH} avec base=/v5/`);
  run(`git checkout ${SRC_BRANCH}`);
  run("npm run build -- --base=/v5/");
  mkdirSync(tmp, { recursive: true });
  cpSync("dist", tmp, { recursive: true });
} finally {
  run(`git checkout ${current}`);
}

console.log("→ copie dans public/v5");
rmSync("public/v5", { recursive: true, force: true });
mkdirSync("public/v5", { recursive: true });
cpSync(join(tmp, "index.html"), "public/v5/index.html");
if (existsSync(join(tmp, "favicon.svg")))
  cpSync(join(tmp, "favicon.svg"), "public/v5/favicon.svg");
cpSync(join(tmp, "assets"), "public/v5/assets", { recursive: true });
rmSync(tmp, { recursive: true, force: true });

console.log("→ injection de la bannière « site principal »");
run("node scripts/inject-v5-banner.mjs");
console.log(`✓ V5 ré-embarquée dans public/v5 (de retour sur ${current})`);
