#!/usr/bin/env python3
"""Page de relecture docs/index.html (noindex) + cache/envois.csv : une ligne
par maquette construite, avec téléphone, URL, SMS prêt, points à vérifier."""
import csv, glob, html, json, os
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE, DOCS = os.path.join(BASE, "cache"), os.path.join(BASE, "docs")
PUBLIC = os.environ.get("APERCUS_URL", "https://rosenaal.github.io/mopal-apercus")
leads = {l["slug"]: l for l in json.load(open(os.path.join(CACHE, "leads.json")))}

lignes = []
for sj in sorted(glob.glob(os.path.join(CACHE, "*", "site.json"))):
    slug = os.path.basename(os.path.dirname(sj))
    if not os.path.exists(os.path.join(DOCS, slug, "index.html")): continue
    site = json.load(open(sj)); c = json.load(open(os.path.join(CACHE, slug, "contenu.json"))); b = json.load(open(os.path.join(CACHE, slug, "brief.json")))
    l = leads.get(slug, {})
    url = f"{PUBLIC}/{slug}/"
    lignes.append({
        "slug": slug, "entreprise": site["nom"], "niche": b["niche"], "ville": site["adresse"]["ville"], "cp": site["adresse"]["cp"],
        "tel": site["tel"]["display"], "email": site.get("email") or "", "site_actuel": site.get("site_actuel") or "",
        "statut_prospection": l.get("statut", ""), "angle": l.get("angle", ""), "note": site["google"]["note"], "nb_avis": site["google"]["nb_avis"],
        "photos": len(site["photos"]), "registre": "oui" if site["registre"] else "non", "url": url,
        "sms": c["sms"].replace("{URL}", url), "a_verifier": " | ".join(c["a_verifier"]), "theme": site["theme"],
        "cout_usd": round(c.get("_usage", {}).get("in", 0) * 10 / 1e6 + c.get("_usage", {}).get("out", 0) * 50 / 1e6, 2),
    })

with open(os.path.join(CACHE, "envois.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(lignes[0].keys()) if lignes else ["slug"]); w.writeheader(); w.writerows(lignes)

def carte(r):
    cap = f"_captures/{r['slug']}.png"
    av = "".join(f"<li>{html.escape(x)}</li>" for x in r["a_verifier"].split(" | ") if x)
    return f"""<article class="c">
  <a href="{r['slug']}/" target="_blank"><img src="{cap}" alt="" loading="lazy"></a>
  <div class="b">
    <h2><a href="{r['slug']}/" target="_blank">{html.escape(r['entreprise'])}</a> <small>{html.escape(r['niche'])} · {html.escape(r['ville'])} ({r['cp']})</small></h2>
    <p class="m">{html.escape(r['tel'])} · {r['nb_avis']} avis {r['note'] or ''} · {r['photos']} photos · registre {r['registre']} · statut {html.escape(r['statut_prospection'])} · {html.escape(r['angle'] or '')}</p>
    <p class="sms"><b>SMS</b> {html.escape(r['sms'])}</p>
    <details><summary>À vérifier ({len(av.split('<li>')) - 1})</summary><ul>{av}</ul></details>
  </div>
</article>"""

page = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aperçus MOPALE — relecture</title>
<style>body{{font:15px/1.5 -apple-system,system-ui,sans-serif;margin:0;background:#f4f3f0;color:#111}}header{{padding:28px 32px 8px}}h1{{font-size:22px;margin:0}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:20px;padding:24px 32px}}
.c{{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.05)}}.c img{{display:block;width:100%;aspect-ratio:1280/900;object-fit:cover;border-bottom:1px solid #eee}}.b{{padding:16px 18px}}h2{{font-size:17px;margin:0}}h2 small{{display:block;font-weight:400;color:#666;font-size:13px}}
.m{{color:#555;font-size:13px;margin:8px 0}}.sms{{background:#f4f3f0;border-radius:10px;padding:10px 12px;font-size:13px;margin:10px 0}}details{{font-size:13px;color:#444}}summary{{cursor:pointer}}ul{{padding-left:18px;margin:6px 0}}a{{color:inherit}}</style></head>
<body><header><h1>Aperçus MOPALE — {len(lignes)} maquettes</h1><p>Relecture interne. Chaque fiche : lien vers la maquette, SMS prêt à envoyer, points non attestés par la fiche Google ou le registre. Export : <code>cache/envois.csv</code>.</p></header>
<div class="g">{''.join(carte(r) for r in lignes)}</div></body></html>"""
open(os.path.join(DOCS, "index.html"), "w").write(page)
print(f"{len(lignes)} maquettes → docs/index.html, cache/envois.csv")
