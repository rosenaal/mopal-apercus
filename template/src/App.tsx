import { MotionConfig } from "framer-motion";
import type { Route } from "@/lib/routes";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";

/*
  Le JSON-LD n'est pas injecté ici : il est écrit en dur dans le <head> de
  chaque page au prérendu (voir src/lib/seo.ts et scripts/prerender.mjs).
  Un crawler qui n'exécute pas le JavaScript le voit donc.
*/
export default function App({ route }: { route: Route }) {
  return (
    <MotionConfig reducedMotion="user">
      <main className="grain min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          Aller au contenu
        </a>
        {route.kind === "legal" ? <Legal page={route.page} /> : <Home />}
      </main>
    </MotionConfig>
  );
}
