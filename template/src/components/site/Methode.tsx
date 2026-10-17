import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Phone } from "@phosphor-icons/react";
import ButtonLink from "./Button";
import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S } from "@/lib/site";

/* Panneau graphite arrondi posé dans la page ; étapes reliées par un rail
   accent rempli par la progression de lecture. */
export default function Methode() {
  const m = S.methode;
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const etapes = m.etapes.slice(0, 4);
  return (
    <section id="methode" className="px-2 sm:px-4">
      <div className="mx-auto max-w-[88rem] rounded-[2.5rem] bg-ink px-2 py-24 text-white sm:rounded-[3rem] sm:py-32 lg:py-36">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow-night"><Crosshair className="h-3.5 w-3.5 text-chartreuse" />Méthode</p>
              <h2 className="mt-7 h2-display">{m.h2} <span className="text-white/45">{m.h2_soft}</span></h2>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="max-w-sm text-[17px] leading-relaxed text-white/60 text-pretty">{m.intro}</p>
            </Reveal>
          </div>

          <ol ref={ref} className="relative mt-20 grid gap-4 pl-8 lg:mt-24 lg:grid-cols-4 lg:gap-5 lg:pl-0 lg:pt-14">
            <span aria-hidden="true" className="absolute bottom-6 left-[5px] top-6 w-px bg-white/10 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[5px] lg:h-px lg:w-auto" />
            <motion.span aria-hidden="true" style={{ scaleY: progress }} className="absolute bottom-6 left-[5px] top-6 w-px origin-top bg-chartreuse lg:hidden" />
            <motion.span aria-hidden="true" style={{ scaleX: progress }} className="absolute left-0 right-0 top-[5px] hidden h-px origin-left bg-chartreuse lg:block" />
            {etapes.map((p, i) => (
              <Reveal as="li" key={p.titre} delay={i * 0.08} className="relative">
                <span aria-hidden="true" className="absolute -left-8 top-8 h-[11px] w-[11px] rounded-full bg-chartreuse ring-4 ring-ink lg:-top-14 lg:left-0" />
                <div className="bezel-night h-full">
                  <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] bg-white/[0.03] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <span className="font-mono text-[12px] text-chartreuse">{String(i + 1).padStart(2, "0")} / {String(etapes.length).padStart(2, "0")}</span>
                    <h3 className="mt-12 text-[1.625rem] font-semibold leading-tight tracking-[-0.035em]">{p.titre}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/60 text-pretty">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1} className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ButtonLink href={`tel:${S.tel.tel}`} icon={Phone} variant="light" size="lg" className="tabular">
              {m.cta} · {S.tel.display}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
