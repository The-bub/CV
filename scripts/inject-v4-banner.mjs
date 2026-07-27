// Injects a small "back to the latest version" banner into the embedded V4
// build (public/v4/index.html). Re-runnable — it strips any previous banner and
// re-injects, so you can tweak it and run again after re-embedding the snapshot.
// The banner links to "/" (the current version at the domain root).
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../public/v4/index.html");

const BANNER = `    <!-- v4-latest-banner: injected by scripts/inject-v4-banner.mjs -->
    <style>
      #v4-latest-banner{position:fixed;left:50%;top:82px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:14px;padding:9px 10px 9px 18px;border-radius:999px;background:rgba(13,24,17,.9);color:#eef1ea;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1;box-shadow:0 10px 34px rgba(0,0,0,.4);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(238,241,234,.18)}
      #v4-latest-banner b{font-weight:600}
      #v4-latest-banner a{color:#0d1811;background:#b9c2b7;padding:8px 15px;border-radius:999px;text-decoration:none;font-weight:600;white-space:nowrap;transition:background .2s ease}
      #v4-latest-banner a:hover{background:#cfd8cd}
      @media(max-width:560px){#v4-latest-banner{font-size:12px;gap:9px;padding:7px 8px 7px 13px;max-width:94vw}}
    </style>
    <div id="v4-latest-banner" role="note" aria-label="Changer de version">
      <span>Vous consultez la <b>V4</b> (version antérieure)</span>
      <a href="/">Version actuelle &rarr;</a>
    </div>
`;

let html = await readFile(target, "utf8");

// Remove any previously injected banner (comment marker through its closing div).
html = html.replace(
  /[ \t]*<!-- v4-latest-banner[\s\S]*?<div id="v4-latest-banner"[\s\S]*?<\/div>\n/,
  "",
);

html = html.replace("  </body>", `${BANNER}  </body>`);
await writeFile(target, html);
console.log("Bannière « version actuelle » (ré)injectée dans public/v4/index.html");
