import { chromium } from "playwright";
const [,, url, out, w, mode] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(w) || 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto(url, { waitUntil: "networkidle" });
if (mode === "vignette") {
  await p.waitForTimeout(400);
  await p.screenshot({ path: out, fullPage: false });
} else {
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
  await p.screenshot({ path: out, fullPage: true });
}
console.log("errors:", errors.length ? errors : "none");
await b.close();
