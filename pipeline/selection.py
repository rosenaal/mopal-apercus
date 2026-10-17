#!/usr/bin/env python3
"""Sélectionne dans ~/mopal-leadgen/mopal.db les prospects à qui préparer un
aperçu : un téléphone, un métier couvert par le gabarit, pas écartés.
Écrit cache/leads.json (une entrée par place_id), triés par intérêt."""
import json, os, re, sqlite3, sys, unicodedata

DB = os.path.expanduser("~/mopal-leadgen/mopal.db")
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "cache", "leads.json")
NICHES = {"Couverture", "Paysagiste", "Chauffage-PAC", "Serrurerie"}
ORDRE_ANGLE = {"domaine-expire": 0, "site-en-erreur": 0, "aucun-site": 1, "site-usine": 2, "pas-https": 3, "non-responsive": 3}
ORDRE_STATUT = {"à appeler": 0, "nouveau": 0, "à contacter": 0, "contacté": 1, "relancé": 1, "clos": 2}

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:48].rstrip("-")

def main():
    c = sqlite3.connect(DB); c.row_factory = sqlite3.Row
    rows = c.execute("""SELECT * FROM leads WHERE tel IS NOT NULL AND tel<>'' AND statut NOT IN ('écarté','désinscrit','email invalide')
                        AND COALESCE(segment,'')<>'EXCLU'""").fetchall()
    leads, slugs = [], set()
    for r in rows:
        if r["niche"] not in NICHES: continue
        angles = (r["angle"] or "").split(" / ")
        prio = min([ORDRE_ANGLE.get(a.split("-")[0] + ("-" + a.split("-")[1] if "-" in a and not a.split("-")[1].isdigit() else ""), 4) for a in angles] or [4])
        slug = slugify(r["entreprise"]) or r["place_id"].lower()
        base = slug; n = 2
        while slug in slugs: slug = f"{base}-{n}"; n += 1
        slugs.add(slug)
        leads.append({
            "place_id": r["place_id"], "slug": slug, "entreprise": r["entreprise"], "niche": r["niche"],
            "ville_recherche": r["ville"], "tel": r["tel"], "site": r["site"] or None, "email": r["email"] or None,
            "avis": r["avis"] or 0, "note": r["note"], "cms": r["cms"], "perf": r["perf"], "angle": r["angle"],
            "score": r["score"] or 0, "statut": r["statut"], "requete": r["requete"],
            "prio": (prio, ORDRE_STATUT.get(r["statut"], 3), -(r["score"] or 0)),
        })
    leads.sort(key=lambda l: l["prio"])
    for l in leads: l["prio"] = list(l["prio"])
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(leads, open(OUT, "w"), ensure_ascii=False, indent=1)
    print(f"{len(leads)} prospects → {OUT}")
    from collections import Counter
    print(Counter(l["niche"] for l in leads))
    print(Counter(l["statut"] for l in leads))

if __name__ == "__main__":
    main()
