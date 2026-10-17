#!/usr/bin/env python3
"""Chaîne complète sur tous les prospects ayant un brief : génération Fable en
parallèle, puis build, puis contrôle qualité, puis index. Reprend là où il en
était (fichiers déjà présents sautés)."""
import glob, json, os, re, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate import generer
from build import construire

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE, DOCS = os.path.join(BASE, "cache"), os.path.join(BASE, "docs")
INTERDITS = re.compile(r"passion|expertise|savoir-faire|n'hésitez|à votre écoute|\d+\s*ans d'exp|\d+\s*%|—|depuis plus de|leader|meilleur", re.I)

def controle(slug):
    """Mots interdits et chiffres non attestés dans les textes générés."""
    site = json.load(open(os.path.join(CACHE, slug, "site.json")))
    b = json.load(open(os.path.join(CACHE, slug, "brief.json")))
    textes = []
    def rec(o, chemin=""):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ("google", "photos", "registre", "adresse", "horaires", "tel", "maps_url", "demo", "geo"): continue
                rec(v, chemin + "." + k)
        elif isinstance(o, list):
            for v in o: rec(v, chemin)
        elif isinstance(o, str): textes.append((chemin, o))
    rec(site)
    alertes = [f"{c} : « {t[:80]} »" for c, t in textes if INTERDITS.search(t)]
    autorises = {str(b["google"]["nb_avis"]), b["adresse"]["cp"], b["adresse"]["dept"], (b.get("registre") or {}).get("creation", ""), (b.get("registre") or {}).get("siren", "")}
    autorises |= {str(b["google"]["note"] or "").replace(".", ","), str(b["google"]["note"] or ""), "5/5", "24h/24", "7j/7"}
    for c, t in textes:
        for n in re.findall(r"\b\d[\d  ]*\b", t):
            n = n.strip()
            if len(n) <= 2 and ("num" in c or "pastille" in c or "zones" in c or "faq" in c and "h" in t): continue
            if n in autorises or re.search(rf"{re.escape(n)}\s*h\d*", t) or re.search(rf"{re.escape(n)}e\b", t): continue
            if re.search(rf"\b{re.escape(n)}\b", b["adresse"]["complete"]) or (b.get("registre") and n in json.dumps(b["registre"])): continue
            alertes.append(f"{c} : chiffre « {n} » dans « {t[:70]} »")
    return alertes

def main():
    slugs = [os.path.basename(os.path.dirname(p)) for p in sorted(glob.glob(os.path.join(CACHE, "*", "brief.json")))]
    voulus = [a for a in sys.argv[1:] if not a.startswith("--")]
    if voulus: slugs = [s for s in slugs if s in voulus]
    limite = next((int(a.split("=")[1]) for a in sys.argv if a.startswith("--max=")), None)
    a_generer = [s for s in slugs if not os.path.exists(os.path.join(CACHE, s, "contenu.json"))][:limite]
    print(f"{len(slugs)} briefs, {len(a_generer)} à rédiger")
    erreurs = {}
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {ex.submit(generer, s): s for s in a_generer}
        for f in as_completed(futs):
            s = futs[f]
            try:
                c = f.result(); u = c.get("_usage", {})
                print(f"  rédigé  {s:<44} {c['nom'][:26]:<26} {u.get('s')}s ≈ {u.get('in',0)*10/1e6+u.get('out',0)*50/1e6:.2f} $", flush=True)
            except Exception as e:
                erreurs[s] = str(e)[:200]; print(f"  ✗ rédaction {s}: {erreurs[s]}", flush=True)
    a_construire = [s for s in slugs if os.path.exists(os.path.join(CACHE, s, "contenu.json")) and not os.path.exists(os.path.join(DOCS, s, "index.html"))]
    print(f"{len(a_construire)} à construire")
    with ThreadPoolExecutor(max_workers=3) as ex:
        futs = {ex.submit(construire, s): s for s in a_construire}
        for f in as_completed(futs):
            s = futs[f]
            try:
                site = f.result(); print(f"  construit {s:<44} photos {len(site['photos'])} avis {len(site['google']['avis'])}", flush=True)
            except Exception as e:
                erreurs[s] = str(e)[-300:]; print(f"  ✗ build {s}: {erreurs[s]}", flush=True)
    rapport = {}
    for s in slugs:
        if os.path.exists(os.path.join(CACHE, s, "site.json")):
            al = controle(s)
            if al: rapport[s] = al
    json.dump({"erreurs": erreurs, "alertes": rapport}, open(os.path.join(CACHE, "controle.json"), "w"), ensure_ascii=False, indent=1)
    print(f"\nContrôle : {len(rapport)} maquettes avec alertes, {len(erreurs)} erreurs → cache/controle.json")
    subprocess.run([sys.executable, os.path.join(BASE, "pipeline/index.py")])

if __name__ == "__main__":
    main()
