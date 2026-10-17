#!/usr/bin/env python3
"""Rédige le contenu d'un aperçu avec Claude Fable 5.1 à partir du brief
(fiche Google, registre, photos). Sortie structurée validée → cache/<slug>/contenu.json"""
import base64, json, os, sys, time
from typing import List, Literal, Optional
import anthropic
from pydantic import BaseModel, Field

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(BASE, "cache")
MODEL = "claude-fable-5-1"

ICONS = ["house", "drop", "paint-brush", "funnel", "buildings", "paint-roller", "squares", "hammer", "map-pin", "receipt", "clock", "shield",
         "leaf", "tree", "flower", "scissors", "plant", "flame", "thermometer", "wrench", "snowflake", "sun", "wind", "faucet", "pipe", "key",
         "lock", "door", "warning", "phone", "truck", "ruler", "broom", "sparkle", "recycle", "hand-heart", "star", "lightning", "wall", "stairs",
         "certificate", "users"]
Icon = str  # validé côté client (liste ICONS)
THEMES = ["chartreuse", "ambre", "tuile", "sarcelle", "marine", "ardoise", "mousse", "vermillon", "laiton", "cobalt", "cramoisi", "olive", "zinc"]
Theme = str  # validé côté client (liste THEMES)

class Logo(BaseModel):
    a: str = Field(description="Premier mot (ou deux) du nom, en blanc")
    b: str = Field(description="Suite du nom, en couleur d'accent ; vide si le nom tient en un mot")
    sous: str = Field(description="Métier en 2-3 mots, ex. « Couvreur zingueur »")
    icon: Icon

class Badge(BaseModel):
    icon: Icon; titre: str; sous: str

class PhotoLegende(BaseModel):
    titre: str = Field(description="3-4 mots décrivant la photo du héros (ou l'activité si pas de photo)")
    sous: str = Field(description="Sous-titre mono, 3-5 mots")
    pastille: str = Field(description="2-3 caractères : numéro de département ou initiales")

class Hero(BaseModel):
    titre_avant: str; titre_souligne: str = Field(description="Le mot clé souligné, 1-2 mots"); titre_apres: str
    texte: str = Field(description="2 phrases, 30-45 mots")
    badges: List[Badge]
    photo: PhotoLegende

class Engagement(BaseModel):
    icon: Icon; titre: str; label: str

class Prestation(BaseModel):
    num: str; titre: str; desc: str; tags: List[str]; icon: Icon

class Autre(BaseModel):
    titre: str; desc: str; icon: Icon

class Prestations(BaseModel):
    h2: str; h2_soft: str; intro: str
    principale: Prestation
    secondaires: List[Prestation]
    autres_titre: str
    autres: List[Autre]

class Point(BaseModel):
    icon: Icon; titre: str; texte: str

class Zone(BaseModel):
    code: str = Field(description="Numéro de département ou arrondissement (ex. « 28 », « 17e »)"); nom: str; detail: str

class APropos(BaseModel):
    h2: str; h2_soft: str; texte: str
    points: List[Point]
    zones: List[Zone]
    zones_note: str = Field(description="2-3 mots en complément, ex. « Et communes voisines »")

class Etape(BaseModel):
    titre: str; desc: str

class Methode(BaseModel):
    h2: str; h2_soft: str; intro: str
    etapes: List[Etape]
    cta: str

class Faq(BaseModel):
    q: str; r: str

class Contact(BaseModel):
    h2: str; h2_soft: str; texte: str; form_intro: str

class Footer(BaseModel):
    desc: str

class Seo(BaseModel):
    title: str; description: str; og_title: str; og_description: str
    schema_type: str = Field(description="Un de : RoofingContractor, Plumber, HVACBusiness, Locksmith, LandscapingBusiness, HomeAndConstructionBusiness, GeneralContractor, Electrician")
    jsonld_description: str

class PhotoAlt(BaseModel):
    index: int = Field(description="Index de la photo dans la liste fournie (0 = première)")
    alt: str = Field(description="Description factuelle de ce que montre la photo, 8-16 mots")
    garder: bool = Field(description="false si la photo est un logo, une capture d'écran, un texte, une personne en gros plan, ou sans rapport avec le métier")

class Contenu(BaseModel):
    nom: str = Field(description="Nom d'affichage de l'entreprise, nettoyé (sans « Eurl », sans slogan Google), 1-4 mots")
    logo: Logo
    signature: str = Field(description="Mot unique en capitales pour la signature géante du pied de page, 4-10 lettres")
    metier: str = Field(description="Métier au singulier minuscule : couvreur, paysagiste, plombier-chauffagiste, serrurier…")
    zone_eyebrow: str = Field(description="Ex. « Berchères-les-Pierres · Eure-et-Loir (28) »")
    zone_cible: str = Field(description="Complément de lieu pour le H1, ex. « en Eure-et-Loir », « à Paris 17e »")
    zone_texte: str = Field(description="Ex. « Eure-et-Loir (28) et communes voisines »")
    hero: Hero
    engagements: List[Engagement]
    prestations: Prestations
    apropos: APropos
    methode: Methode
    faq: List[Faq]
    contact: Contact
    footer: Footer
    seo: Seo
    theme: Theme
    photo_hero: int = Field(description="Index de la photo à mettre dans le héros (la plus représentative, cadrage vertical ou carré de préférence) ; -1 si aucune")
    photos: List[PhotoAlt]
    avis_retenus: List[int] = Field(description="Indices des 2 ou 3 avis à afficher, les plus concrets et courts ; [] si moins de deux avis exploitables")
    a_verifier: List[str] = Field(description="Chaque élément du site qui n'est PAS directement attesté par le brief (ex. une prestation déduite du métier, une zone élargie). Phrases courtes, pour relecture humaine.")
    sms: str = Field(description="SMS de prise de contact pour Alexandre (MOPALE), 2-3 phrases, ≤ 300 caractères, tutoiement interdit, signé « Alexandre, MOPALE », avec le marqueur {URL} à l'endroit du lien")

SYSTEM = """Tu rédiges le contenu d'une maquette de site vitrine pour un artisan, que l'agence MOPALE (Alexandre Rosenberger, Chartres) va lui présenter. L'artisan ne t'a rien demandé : la maquette doit être juste, sobre et immédiatement crédible à ses yeux, car il connaît son métier mieux que toi.

Règles absolues (le non-respect rend la maquette inutilisable) :
1. Aucune donnée inventée : pas de chiffres (années d'expérience, nombre de chantiers, pourcentages, délais chiffrés, tarifs), pas de date de création autre que celle du registre, pas de certification/label/qualification (RGE, Qualibat, garantie décennale…) sauf si le brief la mentionne explicitement, pas d'équipe ni d'effectif chiffré, pas de témoignage autre que les avis Google fournis (que tu ne modifies jamais), pas d'e-mail, pas d'adresse autre que celle du brief.
2. Les prestations : tu pars de ce que la fiche Google, les avis et l'éventuel site actuel attestent. Tu peux compléter avec les prestations usuelles du métier, formulées de manière générique, et tu les listes dans `a_verifier`.
3. Les horaires, le téléphone, l'adresse, la note Google viennent du brief ; tu n'en parles dans tes textes que tels quels.
4. Zone d'intervention : la commune de la fiche et son département. Jamais une liste de communes inventée.

Style : français soigné, phrases courtes, concret, vocabulaire du métier. Interdits : « passion », « expertise », « savoir-faire », « à votre écoute », « n'hésitez pas », superlatifs, points d'exclamation, tirets cadratins. Les H2 suivent le motif « partie forte » + « partie douce » (ex. h2 « La toiture, » / h2_soft « du faîtage à la gouttière. ») : 2-4 mots chacun, la seconde se termine par un point. Le H1 : titre_avant + titre_souligne + titre_apres ≤ 8 mots au total, le mot souligné est le cœur du métier. Descriptions de prestation : une phrase, ≤ 20 mots. Tags : 1-2 mots. FAQ : réponses de 1-2 phrases, uniquement fondées sur le brief (devis, zone, horaires, type de clients, déroulement) ; si tu ne sais pas, ne pose pas la question.

Thème (un de : chartreuse, ambre, tuile, sarcelle, marine, ardoise, mousse, vermillon, laiton, cobalt, cramoisi, olive, zinc) : choisis un preset cohérent avec le métier et, s'il existe, avec les couleurs visibles du logo ou des photos. Couverture/toiture : tuile, ardoise, zinc, chartreuse. Chauffage/plomberie : marine, cobalt, vermillon, ambre. Paysagiste : mousse, olive, chartreuse, sarcelle. Serrurerie : laiton, cobalt, cramoisi, zinc. Varie d'une entreprise à l'autre.

Icônes : uniquement celles-ci : house, drop, paint-brush, funnel, buildings, paint-roller, squares, hammer, map-pin, receipt, clock, shield, leaf, tree, flower, scissors, plant, flame, thermometer, wrench, snowflake, sun, wind, faucet, pipe, key, lock, door, warning, phone, truck, ruler, broom, sparkle, recycle, hand-heart, star, lightning, wall, stairs, certificate, users. Choisis-les selon le sens (ex. « drop » pour l'étanchéité/zinguerie, « flame » pour le chauffage, « leaf »/« tree »/« scissors » pour le végétal, « key »/« lock »/« door » pour la serrurerie, « receipt » devis, « map-pin » zone, « broom » propreté, « clock » délais sans chiffre).

Photos : tu les vois. Décris-les factuellement dans `alt`. Marque `garder: false` pour tout ce qui n'est pas un chantier/matériel/véhicule de l'entreprise. Pour le héros, préfère une photo de chantier nette ; indique -1 si aucune ne convient. Si le héros n'a pas de photo, `hero.photo` décrit l'activité.

SMS : court, humain, sans jargon, qui dit qu'Alexandre a préparé une maquette de site pour l'entreprise et propose de la regarder au lien {URL}, rien à payer pour regarder."""

def img_block(path):
    data = base64.b64encode(open(path, "rb").read()).decode()
    return {"type": "image", "source": {"type": "base64", "media_type": "image/webp", "data": data}}

def generer(slug, force=False):
    d = os.path.join(CACHE, slug)
    out = os.path.join(d, "contenu.json")
    if os.path.exists(out) and not force: return json.load(open(out))
    b = json.load(open(os.path.join(d, "brief.json")))
    brief_llm = {k: v for k, v in b.items() if k not in ("photos",)}
    brief_llm["photos_fournies"] = len(b["photos"])
    content = [{"type": "text", "text": "Brief (faits relevés, ne rien ajouter) :\n" + json.dumps(brief_llm, ensure_ascii=False, indent=1)}]
    for i, ph in enumerate(b["photos"]):
        p = os.path.join(d, "photos", os.path.basename(ph["src"]))
        if os.path.exists(p):
            content.append({"type": "text", "text": f"Photo index {i} ({ph['w']}×{ph['h']}) :"})
            content.append(img_block(p))
    content.append({"type": "text", "text": "Rédige maintenant le contenu complet de la maquette."})
    schema = json.dumps(Contenu.model_json_schema(), ensure_ascii=False)
    content.append({"type": "text", "text": "Réponds uniquement par un objet JSON valide (sans balises de code, sans commentaire) conforme à ce schéma JSON :\n" + schema})
    client = anthropic.Anthropic()
    t0 = time.time()
    dernier = None
    for essai in range(3):
        with client.messages.stream(model=MODEL, max_tokens=20000, system=SYSTEM, output_config={"effort": "high"},
                                    messages=[{"role": "user", "content": content}]) as stream:
            resp = stream.get_final_message()
        if resp.stop_reason == "refusal":
            raise RuntimeError(f"refus : {getattr(resp, 'stop_details', None)}")
        txt = "".join(b.text for b in resp.content if b.type == "text").strip()
        txt = txt[txt.find("{"): txt.rfind("}") + 1]
        try:
            parsed = Contenu.model_validate_json(txt)
            break
        except Exception as e:
            dernier = e
            content = content + [{"type": "text", "text": f"Ta réponse précédente n'était pas valide ({str(e)[:300]}). Recommence, JSON seul."}]
    else:
        raise RuntimeError(f"JSON invalide après 3 essais : {dernier}")
    c = parsed.model_dump()
    def fix(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k == "icon" and v not in ICONS: o[k] = "sparkle"
                else: fix(v)
        elif isinstance(o, list):
            for v in o: fix(v)
    fix(c)
    if c["theme"] not in THEMES: c["theme"] = "chartreuse"
    c["_usage"] = {"in": resp.usage.input_tokens, "out": resp.usage.output_tokens, "s": round(time.time() - t0, 1), "model": MODEL}
    json.dump(c, open(out, "w"), ensure_ascii=False, indent=1)
    return c

if __name__ == "__main__":
    force = "--force" in sys.argv
    slugs = [s for s in sys.argv[1:] if not s.startswith("--")]
    for s in slugs:
        try:
            c = generer(s, force)
            u = c.get("_usage", {})
            cout = u.get("in", 0) * 10 / 1e6 + u.get("out", 0) * 50 / 1e6
            print(f"✓ {s:<44} {c['nom']:<28} thème {c['theme']:<10} {u.get('s')}s  {u.get('in')}→{u.get('out')} tok  ≈ {cout:.2f} $  à vérifier : {len(c['a_verifier'])}")
        except Exception as e:
            print(f"✗ {s}: {e}")
