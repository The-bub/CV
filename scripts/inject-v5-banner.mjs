// Injects a "back to the main site" banner into the embedded V5 build
// (public/v5/index.html). Re-runnable. The banner links to "/" (the main site,
// the V4 at the domain root). Styled to match V5's dark "Sapin" palette.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, "../public/v5/index.html");

const BANNER = `    <!-- v5-main-banner: injected by scripts/inject-v5-banner.mjs -->
    <style>
      #v5-main-banner{position:fixed;left:50%;top:82px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:14px;padding:9px 10px 9px 18px;border-radius:999px;background:rgba(13,20,17,.9);color:#e7eae6;font-family:system-ui,-apple-system,sans-serif;font-size:13px;line-height:1;box-shadow:0 10px 34px rgba(0,0,0,.45);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(231,234,230,.16)}
      #v5-main-banner b{font-weight:600}
      #v5-main-banner a{color:#0d1411;background:#4fa587;padding:8px 15px;border-radius:999px;text-decoration:none;font-weight:600;white-space:nowrap;transition:background .2s ease}
      #v5-main-banner a:hover{background:#77c4a6}
      @media(max-width:560px){#v5-main-banner{font-size:12px;gap:9px;padding:7px 8px 7px 13px;max-width:94vw}}
    </style>
    <div id="v5-main-banner" role="note" aria-label="Changer de version">
      <span>Vous consultez la <b>V5</b> (version créative)</span>
      <a href="/">Site principal &rarr;</a>
    </div>
`;

let html = await readFile(target, "utf8");

html = html.replace(
  /[ \t]*<!-- v5-main-banner[\s\S]*?<div id="v5-main-banner"[\s\S]*?<\/div>\n/,
  "",
);

html = html.replace("  </body>", `${BANNER}  </body>`);
await writeFile(target, html);
console.log("Bannière « site principal » (ré)injectée dans public/v5/index.html");
