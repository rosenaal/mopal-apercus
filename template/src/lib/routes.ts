export type PageLegale = "mentions-legales" | "confidentialite";
export type Route = { kind: "home"; path: "/" } | { kind: "legal"; path: string; page: PageLegale };

const LEGALES: PageLegale[] = ["mentions-legales", "confidentialite"];

export const ROUTES: Route[] = [
  { kind: "home", path: "/" },
  ...LEGALES.map((page) => ({ kind: "legal" as const, path: `/${page}/`, page })),
];

/* Routeur minimal : lit le chemin après le préfixe de publication. */
export function resolveRoute(pathname: string): Route {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const rel = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const slug = rel.replace(/^\/+|\/+$/g, "").replace(/\.html$/, "");
  const legale = LEGALES.find((p) => p === slug);
  if (legale) return { kind: "legal", path: `/${legale}/`, page: legale };
  return ROUTES[0];
}
