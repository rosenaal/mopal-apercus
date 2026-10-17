/* Point d'entrée du build SSR : sert uniquement au prérendu au moment du
   build (scripts/prerender.mjs). Rien de tout ceci n'est envoyé au navigateur. */
import { renderToStaticMarkup } from "react-dom/server";
import App from "./App";
import { ROUTES, type Route } from "./lib/routes";
import { headFor } from "./lib/seo";

export { ROUTES, headFor };

export function render(route: Route): string {
  return renderToStaticMarkup(<App route={route} />);
}
