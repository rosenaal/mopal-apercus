#!/usr/bin/env python3
"""Assemble site.json (brief + contenu), construit le site avec le gabarit,
copie le résultat dans docs/<slug>/ et prend une capture pour l'index."""
import json, os, shutil, subprocess, sys
from datetime import datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from themes import theme_css

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE, TEMPLATE, WORK, DOCS = (os.path.join(BASE, d) for d in ("cache", "template", "work", "docs"))
REPO_PATH = os.environ.get("APERCUS_BASE", "/mopal-apercus/")            # préfixe GitHub Pages
PUBLIC = os.environ.get("APERCUS_URL", "https://rosenaal.github.io/mopal-apercus")
NODE_MODULES = os.path.realpath(os.path.join(TEMPLATE, "node_modules"))

def assembler(slug):
    d = os.path.join(CACHE, slug)
    b = json.load(open(os.path.join(d, "brief.json")))
    c = json.load(open(os.path.join(d, "contenu.json")))
    # photos : garder celles validées, héros en premier, alt du modèle
    alts = {p["index"]: p for p in c.get("photos", [])}
    photos = []
    for i, ph in enumerate(b["photos"]):
        a = alts.get(i)
        if a and not a["garder"]: continue
        photos.append({"src": ph["src"], "w": ph["w"], "h": ph["h"], "alt": (a["alt"] if a else f"Photo publiée par {c['nom']}")})
    hero = c.get("photo_hero", -1)
    if 0 <= hero < len(b["photos"]) and (hero in alts and alts[hero]["garder"]):
        src = b["photos"][hero]["src"]
        photos.sort(key=lambda p: p["src"] != src)
    avis = [b["google"]["avis"][i] for i in c.get("avis_retenus", []) if 0 <= i < len(b["google"]["avis"])]
    if len(avis) < 2: avis = []
    sec = c["prestations"]["secondaires"]
    autres = [{"titre": s["titre"], "desc": s["desc"], "icon": s["icon"]} for s in sec[3:]] + c["prestations"]["autres"]
    pr = dict(c["prestations"], secondaires=sec[:3], autres=autres[:4])
    reg = b.get("registre")
    site = {
        "slug": slug, "nom": c["nom"], "logo": c["logo"], "signature": c["signature"][:12].upper(), "metier": c["metier"],
        "zone": {"eyebrow": c["zone_eyebrow"], "cible": c["zone_cible"], "texte": c["zone_texte"], "code": b["adresse"]["dept"]},
        "hero": dict(c["hero"], badges=c["hero"]["badges"][:2]), "engagements": c["engagements"][:4], "prestations": pr,
        "apropos": dict(c["apropos"], points=c["apropos"]["points"][:4], zones=c["apropos"]["zones"][:3],
                        zones_note=(c["apropos"]["zones_note"] if len(c["apropos"]["zones_note"]) <= 28 else "Et communes voisines")),
        "methode": dict(c["methode"], etapes=c["methode"]["etapes"][:4]), "faq": c["faq"][:6], "contact": c["contact"], "footer": c["footer"],
        "seo": c["seo"], "theme": c["theme"],
        "tel": b["tel"], "email": b.get("email"), "site_actuel": b.get("site_actuel"),
        "adresse": {k: b["adresse"][k] for k in ("rue", "cp", "ville", "complete", "region")},
        "horaires": b["horaires"], "maps_url": b["maps_url"], "geo": b["geo"],
        "google": {"note": b["google"]["note"], "nb_avis": b["google"]["nb_avis"], "avis": avis},
        "photos": photos,
        "registre": ({k: reg[k] for k in ("nom_complet", "siren", "siret", "forme", "ape", "ape_libelle", "creation", "dirigeant", "siege")} if reg else None),
        "demo": {"hebergeur": "GitHub, Inc.", "hebergeur_adresse": "88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis",
                 "hebergeur_url": "https://pages.github.com", "date": datetime.now().strftime("%Y-%m-%d")},
    }
    return site

def serveur_local():
    """Sert docs/ sous le même préfixe que GitHub Pages, pour les captures."""
    import socket
    with socket.socket() as sk:
        if sk.connect_ex(("127.0.0.1", 8787)) == 0: return
    racine = "/tmp/apercus-serve"; os.makedirs(racine, exist_ok=True)
    lien = os.path.join(racine, REPO_PATH.strip("/"))
    if not os.path.islink(lien): os.symlink(DOCS, lien)
    subprocess.Popen([sys.executable, "-m", "http.server", "8787"], cwd=racine, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    import time; time.sleep(1)

def construire(slug, capture=True):
    site = assembler(slug)
    w = os.path.join(WORK, slug)
    if os.path.exists(w): shutil.rmtree(w)
    shutil.copytree(TEMPLATE, w, ignore=shutil.ignore_patterns("node_modules", "dist", "dist-ssr"), symlinks=True)
    os.symlink(NODE_MODULES, os.path.join(w, "node_modules"))
    json.dump(site, open(os.path.join(w, "src/data/site.json"), "w"), ensure_ascii=False, indent=1)
    open(os.path.join(w, "src/data/theme.css"), "w").write(theme_css(site["theme"]))
    img = os.path.join(w, "public/images"); os.makedirs(img, exist_ok=True)
    for p in site["photos"]:
        shutil.copy(os.path.join(CACHE, slug, "photos", os.path.basename(p["src"])), img)
    env = dict(os.environ, BASE_PATH=f"{REPO_PATH}{slug}/", VITE_SITE_URL=f"{PUBLIC}/{slug}")
    r = subprocess.run(["npm", "run", "build", "--silent"], cwd=w, env=env, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError((r.stdout + r.stderr)[-1500:])
    dest = os.path.join(DOCS, slug)
    if os.path.exists(dest): shutil.rmtree(dest)
    shutil.copytree(os.path.join(w, "dist"), dest)
    json.dump(site, open(os.path.join(CACHE, slug, "site.json"), "w"), ensure_ascii=False, indent=1)
    shutil.rmtree(w)
    if capture:
        os.makedirs(os.path.join(DOCS, "_captures"), exist_ok=True)
        serveur_local()
        subprocess.run(["node", os.path.join(BASE, "pipeline/shot.mjs"), f"http://localhost:8787{REPO_PATH}{slug}/", os.path.join(DOCS, "_captures", f"{slug}.png"), "1280", "vignette"],
                       capture_output=True, text=True)
    return site

if __name__ == "__main__":
    for s in [a for a in sys.argv[1:] if not a.startswith("--")]:
        try:
            site = construire(s, capture="--sans-capture" not in sys.argv)
            print(f"✓ {s:<44} {site['nom']:<28} photos {len(site['photos'])}  avis {len(site['google']['avis'])}  → docs/{s}/")
        except Exception as e:
            print(f"✗ {s}: {e}")
