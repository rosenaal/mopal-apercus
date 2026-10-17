import type { Route } from "./routes";
import { S } from "./site";

/* URL publique de l'aperçu : fournie au build par le pipeline. */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

const ENTREPRISE_ID = `${SITE_URL}/#entreprise`;

const JOURS: Record<string, string> = {
  lundi: "Monday", mardi: "Tuesday", mercredi: "Wednesday", jeudi: "Thursday",
  vendredi: "Friday", samedi: "Saturday", dimanche: "Sunday",
};

/* Horaires JSON-LD : dérivés des lignes « lundi – vendredi : 8h00 – 17h00 ». */
function ouverture() {
  const out: unknown[] = [];
  for (const h of S.horaires) {
    const m = h.heures.match(/(\d{1,2})h(\d{2})\s*[–-]\s*(\d{1,2})h(\d{2})/);
    if (!m) continue;
    const jours = h.jours.toLowerCase().split(/\s*[–-]\s*/);
    const noms = Object.keys(JOURS);
    const a = noms.indexOf(jours[0]), b = noms.indexOf(jours[jours.length - 1]);
    if (a < 0 || b < 0) continue;
    out.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: noms.slice(a, b + 1).map((j) => JOURS[j]),
      opens: `${m[1].padStart(2, "0")}:${m[2]}`,
      closes: `${m[3].padStart(2, "0")}:${m[4]}`,
    });
  }
  return out;
}

const entreprise = {
  "@type": [S.seo.schema_type, "LocalBusiness"],
  "@id": ENTREPRISE_ID,
  name: S.nom,
  url: `${SITE_URL}/`,
  ...(S.photos[0] ? { image: `${SITE_URL}/${S.photos[0].src.replace(/^\/+/, "")}` } : {}),
  telephone: S.tel.tel,
  ...(S.email ? { email: S.email } : {}),
  ...(S.registre?.dirigeant ? { founder: { "@type": "Person", name: S.registre.dirigeant } } : {}),
  description: S.seo.jsonld_description,
  address: {
    "@type": "PostalAddress",
    streetAddress: S.adresse.rue,
    postalCode: S.adresse.cp,
    addressLocality: S.adresse.ville,
    addressRegion: S.adresse.region,
    addressCountry: "FR",
  },
  ...(S.geo ? { geo: { "@type": "GeoCoordinates", latitude: S.geo.lat, longitude: S.geo.lng } } : {}),
  hasMap: S.maps_url,
  sameAs: [S.maps_url],
  areaServed: S.apropos.zones.map((z) => ({ "@type": "AdministrativeArea", name: z.nom })),
  openingHoursSpecification: ouverture(),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `Prestations ${S.nom}`,
    itemListElement: [S.prestations.principale, ...S.prestations.secondaires, ...S.prestations.autres].map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.titre, description: p.desc },
    })),
  },
};

const faqPage = (items: readonly { q: string; r: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.r },
  })),
});

export interface Head {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  jsonLd: unknown;
}

export function headFor(route: Route): Head {
  if (route.kind === "home") {
    return {
      title: S.seo.title,
      description: S.seo.description,
      canonical: `${SITE_URL}/`,
      ogTitle: S.seo.og_title,
      ogDescription: S.seo.og_description,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          entreprise,
          { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: `${SITE_URL}/`, name: S.nom, inLanguage: "fr-FR", publisher: { "@id": ENTREPRISE_ID } },
          ...(S.faq.length ? [faqPage(S.faq)] : []),
        ],
      },
    };
  }
  const mentions = route.page === "mentions-legales";
  const url = `${SITE_URL}${route.path}`;
  const titre = mentions ? `Mentions légales : ${S.nom}` : `Politique de confidentialité : ${S.nom}`;
  return {
    title: titre,
    description: mentions
      ? `Éditeur, hébergeur et informations légales du site de ${S.nom}, ${S.metier} à ${S.adresse.ville}.`
      : `Comment le site de ${S.nom} traite vos données. Aucune donnée personnelle n'est collectée ni stockée.`,
    canonical: url,
    ogTitle: titre,
    ogDescription: mentions ? `Informations légales du site ${S.nom}.` : `Traitement des données personnelles sur le site ${S.nom}.`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        entreprise,
        { "@type": "WebPage", "@id": `${url}#page`, url, name: mentions ? "Mentions légales" : "Politique de confidentialité", isPartOf: { "@id": `${SITE_URL}/#site` }, publisher: { "@id": ENTREPRISE_ID } },
      ],
    },
  };
}
