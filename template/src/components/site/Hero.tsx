import { motion } from "framer-motion";
import { Phone, ArrowRight } from "@phosphor-icons/react";
import ButtonLink from "./Button";
import { Crosshair, ReticleFrame } from "./Reticle";
import { S, href } from "@/lib/site";
import { icon } from "@/lib/icons";

const ease = [0.32, 0.72, 0, 1] as const;

/*
  Split éditorial : très grand titre à gauche, photo réelle de la fiche
  Google à droite dans un double cadre. Sans photo, un panneau graphite
  typographique prend la place (jamais d'image de banque).
*/
export default function Hero() {
  const h = S.hero;
  const photo = S.photos[0];
  const LogoIcon = icon(S.logo.icon);
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44">
      <div id="contenu" className="container-wide grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="eyebrow">
            <Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />
            {S.zone.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.08, ease }}
            className="mt-8 max-w-[14ch] text-[clamp(2.25rem,11vw,3.1rem)] font-semibold leading-[0.95] tracking-[-0.055em] sm:text-[4.5rem] lg:text-[5.5rem]"
          >
            {h.titre_avant}{h.titre_avant ? " " : ""}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">{h.titre_souligne}</span>
              <motion.span
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.7, ease }}
                className="absolute inset-x-[-0.06em] bottom-[0.08em] h-[0.32em] origin-left rounded-full bg-chartreuse/70"
              />
            </span>
            {h.titre_apres ? " " : ""}{h.titre_apres}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.18, ease }}
            className="mt-8 max-w-[34rem] text-[18px] leading-[1.6] text-muted-foreground text-pretty sm:text-[20px]">
            {h.texte}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.26, ease }}
            className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href={`tel:${S.tel.tel}`} icon={Phone} variant="accent" size="lg" className="tabular">
              {S.tel.display}
            </ButtonLink>
            <ButtonLink href="#contact" icon={ArrowRight} variant="ghost" size="lg">
              Demander un devis
            </ButtonLink>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.34, ease }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            {h.badges.slice(0, 2).map((b, i) => {
              const I = icon(b.icon);
              return (
                <div key={b.titre} className="contents">
                  {i > 0 && <span className="hidden h-10 w-px bg-ink/10 sm:block" aria-hidden="true" />}
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card ring-1 ring-ink/[0.07]">
                      <I size={22} weight="light" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium leading-tight">{b.titre}</span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{b.sous}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
          className="relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none"
        >
          <div className="bezel shadow-float lg:rotate-[1.5deg]">
            <div className="group relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-ink">
              {photo ? (
                <img
                  src={href(photo.src)}
                  width={photo.w}
                  height={photo.h}
                  alt={photo.alt}
                  fetchPriority="high"
                  className="aspect-[4/5] w-full object-cover transition-smooth duration-1000 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="relative flex aspect-[4/5] w-full flex-col justify-between p-8 text-white">
                  <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-16 h-[26rem] w-[26rem] text-white/[0.07]" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M20 220 200 60l180 160" /><path d="M60 260 200 136l140 124" /><path d="M100 300 200 212l100 88" /><path d="M20 220v160M380 220v160" />
                  </svg>
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chartreuse text-onaccent">
                    <LogoIcon size={32} weight="light" />
                  </span>
                  <p className="relative text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[3rem]">{S.nom}</p>
                </div>
              )}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
              <ReticleFrame />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-full bg-white/95 py-2 pl-2 pr-4 shadow-soft">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
                    {h.photo.pastille}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[14px] font-semibold tracking-[-0.01em]">{h.photo.titre}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{h.photo.sous}</span>
                  </span>
                </span>
                <Crosshair className="h-4 w-4 text-chartreuse-strong" />
              </figcaption>
            </div>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
