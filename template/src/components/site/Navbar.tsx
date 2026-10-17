import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Phone, ArrowUpRight } from "@phosphor-icons/react";
import Logo from "./Logo";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, HORAIRES, S, href } from "@/lib/site";

const LINKS = [
  { href: "#prestations", label: "Prestations" },
  { href: "#a-propos", label: "Qui intervient" },
  { href: "#methode", label: "Méthode" },
  { href: "#contact", label: "Contact" },
];

const ease = [0.32, 0.72, 0, 1] as const;
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function Navbar({ base: baseProp }: { base?: string } = {}) {
  const base = baseProp === undefined ? "" : href(baseProp);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Îlot flottant, détaché du haut de page. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
        <div
          className={`pointer-events-auto mx-auto flex max-w-[82rem] items-center justify-between gap-3 rounded-full py-1.5 pl-1.5 pr-1.5 transition-smooth lg:w-max lg:gap-10 ${
            open
              ? "bg-transparent"
              : scrolled
                ? "bg-white/80 shadow-soft ring-1 ring-ink/[0.07] backdrop-blur-xl"
                : "bg-white/60 ring-1 ring-ink/[0.05] backdrop-blur-md"
          }`}
        >
          <a href={base || "#top"} aria-label={`${S.nom}, retour en haut`} className={`rounded-full pr-2 ${ring}`}>
            <Logo />
          </a>

          <nav aria-label="Navigation principale" className="hidden items-center lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={`${base}${l.href}`}
                className={`rounded-full px-3.5 py-2 text-[14px] text-muted-foreground transition-quick hover:bg-ink/[0.05] hover:text-ink ${ring}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${PHONE_TEL}`}
              aria-label={`Appeler le ${PHONE_DISPLAY}`}
              className="group flex h-10 items-center gap-2 rounded-full bg-chartreuse pl-2 pr-2 text-[14px] font-medium text-onaccent transition-smooth hover:bg-ink hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:pl-4"
            >
              <span className="tabular hidden sm:inline">{PHONE_DISPLAY}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10 transition-smooth group-hover:bg-white/15">
                <Phone size={15} weight="regular" aria-hidden="true" />
              </span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-plein-ecran"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/[0.05] transition-quick hover:bg-ink/10 lg:hidden ${ring}`}
            >
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 bg-ink transition-smooth ${open ? "top-[5px] rotate-45" : "top-0.5 rotate-0"}`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 bg-ink transition-smooth ${open ? "top-[5px] -rotate-45" : "top-[9px] rotate-0"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <motion.div
          id="menu-plein-ecran"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-0 z-40 bg-background/90 backdrop-blur-3xl lg:hidden"
        >
          <nav aria-label="Navigation mobile" className="container-wide flex h-full flex-col justify-center pt-20">
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={`${base}${l.href}`}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.08 + i * 0.05, ease }}
                    className="block rounded-2xl py-2 text-[2.5rem] font-semibold tracking-[-0.045em] text-ink transition-quick hover:text-chartreuse-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong"
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.36, ease }}
              className="mt-12 space-y-2 border-t border-ink/10 pt-8"
            >
              <a href={`tel:${PHONE_TEL}`} className="tabular flex items-center gap-2 text-2xl font-semibold tracking-[-0.03em]">
                {PHONE_DISPLAY}
                <ArrowUpRight size={20} weight="light" aria-hidden="true" />
              </a>
              {HORAIRES[0] && (
                <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted-foreground">
                  {HORAIRES[0].jours} · {HORAIRES[0].heures}
                </p>
              )}
              {EMAIL && (
                <a href={`mailto:${EMAIL}`} className="block break-all text-[15px] text-muted-foreground">
                  {EMAIL}
                </a>
              )}
            </motion.div>
          </nav>
        </motion.div>
      )}
    </>
  );
}
