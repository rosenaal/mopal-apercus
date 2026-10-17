/**
 * Prérendu au build : un fichier HTML complet par route (head + contenu),
 * sous dist/<route>/index.html. Aperçus : `noindex`, pas de sitemap.
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(racine, "dist");
const base = (process.env.BASE_PATH || "/").replace(/\/+$/, "") + "/";
const noindex = process.env.NOINDEX !== "0";

const { ROUTES, headFor, render } = await import(join(racine, "dist-ssr/entry-server.js"));
const site = JSON.parse(await readFile(join(racine, "src/data/site.json"), "utf8"));
const gabarit = await readFile(join(dist, "index.html"), "utf8");

const assets = await readdir(join(dist, "assets"));
const polices = assets
  .filter((f) => /^geist(-mono)?-latin-wght-normal-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="${base}assets/${f}" crossorigin />`)
  .join("\n    ");

const echappe = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const siteUrl = (process.env.VITE_SITE_URL || "").replace(/\/+$/, "");
const og = site.photos[0] ? `${siteUrl}/${site.photos[0].src.replace(/^\/+/, "")}` : null;

const balisesHead = (h) =>
  [
    polices,
    `<title>${echappe(h.title)}</title>`,
    `<meta name="description" content="${echappe(h.description)}" />`,
    noindex
      ? `<meta name="robots" content="noindex,nofollow" />`
      : `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />`,
    `<link rel="canonical" href="${h.canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="fr_FR" />`,
    `<meta property="og:url" content="${h.canonical}" />`,
    `<meta property="og:site_name" content="${echappe(site.nom)}" />`,
    `<meta property="og:title" content="${echappe(h.ogTitle)}" />`,
    `<meta property="og:description" content="${echappe(h.ogDescription)}" />`,
    ...(og ? [`<meta property="og:image" content="${og}" />`, `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:image" content="${og}" />`] : []),
    `<meta name="twitter:title" content="${echappe(h.ogTitle)}" />`,
    `<meta name="twitter:description" content="${echappe(h.description)}" />`,
    `<script type="application/ld+json">${JSON.stringify(h.jsonLd).replace(/<\//g, "<\\/")}</script>`,
  ].join("\n    ");

const ecrites = [];
for (const route of ROUTES) {
  const head = headFor(route);
  const html = gabarit
    .replace("<!--app-author-->", `<meta name="author" content="${echappe(site.nom)}" />`)
    .replace("<!--app-head-->", balisesHead(head))
    .replace("<!--app-html-->", render(route));
  const cible = route.path === "/" ? join(dist, "index.html") : join(dist, route.path.replace(/^\/|\/$/g, ""), "index.html");
  await mkdir(dirname(cible), { recursive: true });
  await writeFile(cible, html, "utf8");
  ecrites.push({ path: route.path, ko: (Buffer.byteLength(html) / 1024).toFixed(0) });
}
console.log(`Prérendu : ${ecrites.map((p) => `${p.path} (${p.ko} Ko)`).join(", ")}`);
