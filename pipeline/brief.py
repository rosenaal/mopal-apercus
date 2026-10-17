#!/usr/bin/env python3
"""Pour un prospect : relève la fiche Google (Places API v1), cherche
l'entreprise au registre (recherche-entreprises.api.gouv.fr), télécharge les
photos publiées par l'entreprise. Écrit cache/<slug>/brief.json + photos/."""
import json, os, re, subprocess, sys, time, unicodedata, urllib.parse, urllib.request
from datetime import datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(BASE, "cache")
KEY = open(os.path.expanduser("~/.mopal/google_api_key")).read().strip()
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
REGIONS = {  # département → région (pour le JSON-LD)
    "28": "Centre-Val de Loire", "45": "Centre-Val de Loire", "41": "Centre-Val de Loire", "37": "Centre-Val de Loire", "36": "Centre-Val de Loire", "18": "Centre-Val de Loire",
    "75": "Île-de-France", "77": "Île-de-France", "78": "Île-de-France", "91": "Île-de-France", "92": "Île-de-France", "93": "Île-de-France", "94": "Île-de-France", "95": "Île-de-France",
    "72": "Pays de la Loire", "49": "Pays de la Loire", "53": "Pays de la Loire", "44": "Pays de la Loire", "85": "Pays de la Loire",
    "27": "Normandie", "76": "Normandie", "14": "Normandie", "61": "Normandie", "50": "Normandie",
}
DEPTS = {"28": "Eure-et-Loir", "45": "Loiret", "41": "Loir-et-Cher", "37": "Indre-et-Loire", "75": "Paris", "77": "Seine-et-Marne", "78": "Yvelines",
         "91": "Essonne", "92": "Hauts-de-Seine", "93": "Seine-Saint-Denis", "94": "Val-de-Marne", "95": "Val-d'Oise", "72": "Sarthe", "27": "Eure",
         "61": "Orne", "76": "Seine-Maritime", "14": "Calvados", "49": "Maine-et-Loire", "53": "Mayenne", "36": "Indre", "18": "Cher"}
FORMES = {"1000": "Entrepreneur individuel", "5499": "SARL", "5498": "EURL", "5710": "SAS", "5720": "SASU", "5202": "SNC", "5306": "SARL", "5499 ": "SARL"}
APE_LIB = {"43.91A": "Travaux de charpente", "43.91B": "Travaux de couverture par éléments", "43.99A": "Travaux d'étanchéification",
           "43.22A": "Travaux d'installation d'eau et de gaz en tous locaux", "43.22B": "Travaux d'installation d'équipements thermiques et de climatisation",
           "81.30Z": "Services d'aménagement paysager", "02.40Z": "Services de soutien à l'exploitation forestière", "43.32A": "Travaux de menuiserie bois et PVC",
           "43.32B": "Travaux de menuiserie métallique et serrurerie", "95.29Z": "Réparation d'autres biens personnels et domestiques", "43.29B": "Autres travaux d'installation n.c.a.",
           "43.21A": "Travaux d'installation électrique dans tous locaux", "43.99C": "Travaux de maçonnerie générale et gros œuvre de bâtiment", "81.21Z": "Nettoyage courant des bâtiments",
           "43.34Z": "Travaux de peinture et vitrerie", "43.31Z": "Travaux de plâtrerie", "43.29A": "Travaux d'isolation", "81.29B": "Autres activités de nettoyage n.c.a.",
           "43.33Z": "Travaux de revêtement des sols et des murs", "80.20Z": "Activités liées aux systèmes de sécurité", "47.59B": "Commerce de détail d'autres équipements du foyer"}
APE_NICHE = {"Couverture": ("43.91", "43.99A", "43.29"), "Chauffage-PAC": ("43.22", "43.29", "43.21"), "Paysagiste": ("81.30", "02.40", "81.29", "01.6"), "Serrurerie": ("43.32", "95.29", "80.20", "47.59")}

def http(url, headers=None, t=25):
    r = urllib.request.Request(url, headers=headers or {"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(r, timeout=t) as o: return o.read()

def norm(s):
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9 ]+", " ", s)

STOP = {"eurl", "sarl", "sas", "sasu", "ei", "entreprise", "ets", "societe", "et", "de", "du", "des", "la", "le", "les", "l", "d", "fils", "sa", "snc", "me", "monsieur", "madame"}
def mots(s): return {m for m in norm(s).split() if len(m) > 1 and m not in STOP}

def place(place_id):
    champs = ("id,displayName,formattedAddress,addressComponents,nationalPhoneNumber,internationalPhoneNumber,websiteUri,googleMapsUri,"
              "rating,userRatingCount,regularOpeningHours,reviews,photos,location,primaryType,primaryTypeDisplayName,types,businessStatus,editorialSummary")
    return json.loads(http(f"https://places.googleapis.com/v1/places/{place_id}?languageCode=fr", {"X-Goog-Api-Key": KEY, "X-Goog-FieldMask": champs}))

def composants(p):
    out = {}
    for c in p.get("addressComponents", []):
        for t in c.get("types", []): out.setdefault(t, c.get("longText"))
    return out

def horaires(p):
    wd = p.get("regularOpeningHours", {}).get("weekdayDescriptions") or []
    lignes = []
    for w in wd:
        jour, _, h = w.partition(":")
        h = h.strip().replace(" ", "").replace(" ", "").replace(" ", "")
        if not h or "ferm" in h.lower(): h = "Fermé"
        elif "24" in h and "/" in h or "ouvert24" in h.lower().replace(" ", ""): h = "24h/24"
        else:
            def fmt(x):
                m = re.match(r"(\d{1,2}):(\d{2})", x); return f"{int(m.group(1))}h{m.group(2)}" if m else x
            parts = re.split(r"[–-]", h)
            h = " – ".join(fmt(x) for x in parts) if len(parts) == 2 else h
        lignes.append((jour.strip().capitalize(), h))
    # regroupe les jours consécutifs identiques
    groupes = []
    for j, h in lignes:
        if groupes and groupes[-1][2] == h: groupes[-1][1] = j
        else: groupes.append([j, j, h])
    out = []
    for a, b, h in groupes:
        if h == "Fermé" and (a, b) in (("Samedi", "Dimanche"), ("Dimanche", "Dimanche")): continue
        out.append({"jours": a if a == b else f"{a.lower() if False else a} – {b.lower()}", "heures": h})
    return out

def avis(p):
    out = []
    for r in p.get("reviews", []):
        t = (r.get("text") or {}).get("text") or ""
        if not t.strip() or (r.get("rating") or 0) < 4: continue
        nom = (r.get("authorAttribution") or {}).get("displayName") or "Client"
        parts = nom.split()
        auteur = parts[0] + (f" {parts[-1][0]}." if len(parts) > 1 and parts[-1][0].isalpha() else "")
        d = r.get("publishTime", "")[:7]
        date = f"{MOIS[int(d[5:7]) - 1].capitalize()} {d[:4]}" if len(d) == 7 else r.get("relativePublishTimeDescription", "")
        out.append({"auteur": auteur, "date": date, "texte": t.strip(), "note": r.get("rating")})
    return out

def photos(p, dossier, slug, maxi=7):
    os.makedirs(dossier, exist_ok=True)
    out = []
    for i, ph in enumerate(p.get("photos", [])[:maxi]):
        nom = ph.get("name"); w, h = ph.get("widthPx", 0), ph.get("heightPx", 0)
        if not nom or w < 600: continue
        jpg = os.path.join(dossier, f"photo-{i+1}.jpg"); webp = os.path.join(dossier, f"photo-{i+1}.webp")
        if not os.path.exists(webp):
            try:
                data = http(f"https://places.googleapis.com/v1/{nom}/media?maxWidthPx=1400&maxHeightPx=1400&key={KEY}")
                open(jpg, "wb").write(data)
                subprocess.run(["cwebp", "-quiet", "-q", "82", jpg, "-o", webp], check=True)
                os.remove(jpg)
            except Exception as e:
                print("  ! photo", i + 1, e); continue
        dims = subprocess.run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", webp], capture_output=True, text=True).stdout
        pw = int(re.search(r"pixelWidth: (\d+)", dims).group(1)); phh = int(re.search(r"pixelHeight: (\d+)", dims).group(1))
        out.append({"src": f"/images/photo-{i+1}.webp", "w": pw, "h": phh, "alt": "", "auteur": [a.get("displayName") for a in ph.get("authorAttributions", [])]})
    return out

def sirene(nom, cp, ville, niche, tel):
    """Cherche l'entreprise au registre. N'accepte qu'une correspondance sûre :
    mots du nom en commun ET même commune/code postal, ou activité du métier."""
    cands = []
    for q in dict.fromkeys([nom, " ".join(sorted(mots(nom))[:3])]):
        if not q.strip(): continue
        url = "https://recherche-entreprises.api.gouv.fr/search?" + urllib.parse.urlencode({"q": q, "code_postal": cp or "", "per_page": 10, "etat_administratif": "A"})
        try: d = json.loads(http(url))
        except Exception: continue
        cands += d.get("results", [])
        if cands: break
    if not cands and ville:
        url = "https://recherche-entreprises.api.gouv.fr/search?" + urllib.parse.urlencode({"q": f"{nom} {ville}", "per_page": 10, "etat_administratif": "A"})
        try: cands = json.loads(http(url)).get("results", [])
        except Exception: cands = []
    mn = mots(nom); best = None; bs = 0
    for r in cands:
        noms = " ".join(filter(None, [r.get("nom_complet"), r.get("nom_raison_sociale"), r.get("sigle")] + [e.get("nom_commercial") or "" for e in r.get("matching_etablissements", [])]))
        mr = mots(noms)
        commun = len(mn & mr); 
        if commun == 0: continue
        s = commun * 3
        siege = r.get("siege", {})
        if cp and (siege.get("code_postal") == cp or any(e.get("code_postal") == cp for e in r.get("matching_etablissements", []))): s += 3
        ape = r.get("activite_principale") or ""
        if any(ape.startswith(x) for x in APE_NICHE.get(niche, ())): s += 2
        if s > bs: bs, best = s, r
    if not best or bs < 5: return None
    siege = best.get("siege", {})
    dir_ = None
    for d in best.get("dirigeants", []):
        if d.get("type_dirigeant") == "personne physique" and d.get("nom"):
            pre = (d.get("prenoms") or "").split()[:1]
            dir_ = " ".join(x.capitalize() for x in pre) + " " + d["nom"].upper(); break
    ape = best.get("activite_principale") or ""
    siren = best.get("siren", "")
    return {
        "nom_complet": (best.get("nom_raison_sociale") or best.get("nom_complet") or "").strip(),
        "siren": f"{siren[:3]} {siren[3:6]} {siren[6:]}", "siret": f"{siren[:3]} {siren[3:6]} {siren[6:]} {siege.get('siret','')[9:]}",
        "forme": FORMES.get(str(best.get("nature_juridique")), "Société"), "ape": ape, "ape_libelle": APE_LIB.get(ape, best.get("libelle_activite_principale") or ""),
        "creation": (best.get("date_creation") or "")[:4], "dirigeant": dir_, "siege": siege.get("adresse", "").title().replace("Cs ", "CS "),
        "effectif": best.get("tranche_effectif_salarie"), "score_match": bs,
    }

def texte_site(url):
    if not url: return None
    try:
        h = http(url, t=12).decode("utf-8", "ignore")
    except Exception: return None
    h = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", " ", h, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", h); t = re.sub(r"\s+", " ", t).strip()
    return t[:6000] if len(t) > 200 else None

def brief(lead):
    slug = lead["slug"]; dossier = os.path.join(CACHE, slug)
    os.makedirs(dossier, exist_ok=True)
    p = place(lead["place_id"])
    if "error" in p: raise RuntimeError(p["error"])
    comp = composants(p)
    cp = comp.get("postal_code") or ""; ville = comp.get("locality") or lead["ville_recherche"]
    rue = " ".join(filter(None, [comp.get("street_number"), comp.get("route")]))
    dept = cp[:2] if cp else ""
    if dept == "97": dept = cp[:3]
    tel = p.get("internationalPhoneNumber") or ""
    nom = (p.get("displayName") or {}).get("text") or lead["entreprise"]
    reg = sirene(nom, cp, ville, lead["niche"], tel)
    b = {
        "slug": slug, "place_id": lead["place_id"], "niche": lead["niche"], "nom_google": nom,
        "tel": {"display": p.get("nationalPhoneNumber") or lead["tel"], "tel": tel.replace(" ", "") or ("+33" + re.sub(r"\D", "", lead["tel"])[1:])},
        "email": lead.get("email"), "site_actuel": p.get("websiteUri") or lead.get("site"),
        "adresse": {"rue": rue, "cp": cp, "ville": ville, "complete": p.get("formattedAddress", "").replace(", France", ""), "region": REGIONS.get(dept, ""), "dept": dept, "dept_nom": DEPTS.get(dept, "")},
        "horaires": horaires(p), "maps_url": p.get("googleMapsUri", "").split("&g_mp")[0],
        "geo": {"lat": p["location"]["latitude"], "lng": p["location"]["longitude"]} if p.get("location") else None,
        "google": {"note": p.get("rating"), "nb_avis": p.get("userRatingCount", 0), "avis": avis(p),
                   "categorie": (p.get("primaryTypeDisplayName") or {}).get("text"), "types": p.get("types", []),
                   "resume": (p.get("editorialSummary") or {}).get("text"), "statut": p.get("businessStatus")},
        "photos": photos(p, os.path.join(dossier, "photos"), slug),
        "registre": reg, "texte_site_actuel": texte_site(p.get("websiteUri") or lead.get("site")),
        "lead": {k: lead[k] for k in ("cms", "perf", "angle", "score", "statut", "requete", "ville_recherche", "avis", "note")},
        "releve_le": datetime.now().strftime("%Y-%m-%d"),
    }
    json.dump(b, open(os.path.join(dossier, "brief.json"), "w"), ensure_ascii=False, indent=1)
    return b

if __name__ == "__main__":
    leads = json.load(open(os.path.join(CACHE, "leads.json")))
    voulus = sys.argv[1:]
    for l in leads:
        if voulus and l["slug"] not in voulus and l["place_id"] not in voulus: continue
        if not voulus and os.path.exists(os.path.join(CACHE, l["slug"], "brief.json")): continue
        try:
            b = brief(l)
            print(f"✓ {l['slug']:<44} {b['adresse']['cp']} {b['adresse']['ville'][:18]:<18} avis {len(b['google']['avis'])}/{b['google']['nb_avis']}  photos {len(b['photos'])}  registre {'oui' if b['registre'] else 'non'}")
        except Exception as e:
            print(f"✗ {l['slug']}: {e}")
        time.sleep(0.3)
