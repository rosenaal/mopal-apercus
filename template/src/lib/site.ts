/**
 * Toutes les données du site viennent de src/data/site.json, écrit par le
 * pipeline d'aperçus (faits relevés sur la fiche Google et le registre
 * SIRENE, textes rédigés à partir de ces faits). Rien n'est codé en dur ici.
 */
import data from "@/data/site.json";

export type IconName =
  | "house" | "drop" | "paint-brush" | "funnel" | "buildings" | "paint-roller" | "squares" | "hammer"
  | "map-pin" | "receipt" | "clock" | "shield" | "leaf" | "tree" | "flower" | "scissors" | "plant"
  | "flame" | "thermometer" | "wrench" | "snowflake" | "sun" | "wind" | "faucet" | "pipe"
  | "key" | "lock" | "door" | "warning" | "phone" | "truck" | "ruler" | "broom" | "sparkle"
  | "recycle" | "hand-heart" | "star" | "lightning" | "wall" | "stairs" | "certificate" | "users";

export interface Prestation { num: string; titre: string; desc: string; tags: string[]; icon: IconName }
export interface Point { icon: IconName; titre: string; texte: string }
export interface Avis { auteur: string; date: string; texte: string; note: number }
export interface Photo { src: string; w: number; h: number; alt: string }

export interface SiteData {
  slug: string;
  nom: string;
  logo: { a: string; b: string; sous: string; icon: IconName };
  signature: string;
  metier: string;
  zone: { eyebrow: string; cible: string; texte: string; code: string };
  hero: {
    titre_avant: string; titre_souligne: string; titre_apres: string; texte: string;
    badges: { icon: IconName; titre: string; sous: string }[];
    photo: { titre: string; sous: string; pastille: string };
  };
  engagements: { icon: IconName; titre: string; label: string }[];
  prestations: {
    h2: string; h2_soft: string; intro: string;
    principale: Prestation; secondaires: Prestation[];
    autres_titre: string; autres: { titre: string; desc: string; icon: IconName }[];
  };
  apropos: {
    h2: string; h2_soft: string; texte: string; points: Point[];
    zones: { code: string; nom: string; detail: string }[]; zones_note: string;
  };
  methode: { h2: string; h2_soft: string; intro: string; etapes: { titre: string; desc: string }[]; cta: string };
  faq: { q: string; r: string }[];
  contact: { h2: string; h2_soft: string; texte: string; form_intro: string };
  footer: { desc: string };
  seo: { title: string; description: string; og_title: string; og_description: string; schema_type: string; jsonld_description: string };
  theme: string;
  tel: { display: string; tel: string };
  email: string | null;
  site_actuel: string | null;
  adresse: { rue: string; cp: string; ville: string; complete: string; region: string };
  horaires: { jours: string; heures: string }[];
  maps_url: string;
  geo: { lat: number; lng: number } | null;
  google: { note: number | null; nb_avis: number; avis: Avis[] };
  photos: Photo[];
  registre: {
    nom_complet: string; siren: string; siret: string; forme: string; ape: string; ape_libelle: string;
    creation: string; dirigeant: string | null; siege: string;
  } | null;
  demo: { hebergeur: string; hebergeur_adresse: string; hebergeur_url: string; date: string };
}

export const S = data as unknown as SiteData;

/* Préfixe de publication (Vite `base`), toujours terminé par « / ». */
export const BASE: string = import.meta.env.BASE_URL;
export const href = (p: string) => BASE + p.replace(/^\/+/, "");

export const PHONE_DISPLAY = S.tel.display;
export const PHONE_TEL = S.tel.tel;
export const EMAIL = S.email;
export const HORAIRES = S.horaires;
export const ADRESSE = S.adresse.complete;
export const VILLE = S.adresse.ville;
export const GERANT = S.registre?.dirigeant ?? null;
