import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S } from "@/lib/site";
import { icon } from "@/lib/icons";

/* Split éditorial : texte + points à gauche ; zone d'intervention à droite,
   codes départements en très gros chiffres mono, puis l'identité au registre. */
export default function APropos() {
  const a = S.apropos;
  const r = S.registre;
  return (
    <section id="a-propos" className="section-y">
      <div className="container-wide grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Qui intervient</p>
            <h2 className="mt-7 h2-display">{a.h2} <span className="text-ink/50">{a.h2_soft}</span></h2>
            <p className="mt-8 max-w-[34rem] text-[18px] leading-[1.65] text-muted-foreground text-pretty">{a.texte}</p>
          </Reveal>
          <ul className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {a.points.slice(0, 4).map((p, i) => {
              const I = icon(p.icon);
              return (
                <Reveal as="li" key={p.titre} delay={i * 0.06}>
                  <I size={26} weight="light" className="text-chartreuse-strong" aria-hidden="true" />
                  <p className="mt-4 text-[17px] font-semibold tracking-[-0.02em]">{p.titre}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground text-pretty">{p.texte}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
          <div className="lg:sticky lg:top-28">
            <div className="bezel">
              <div className="bezel-core p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <p className="text-[17px] font-semibold tracking-[-0.02em]">Zone d'intervention</p>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{a.zones_note}</span>
                </div>
                <ul className="mt-6 divide-y divide-ink/[0.07]">
                  {a.zones.slice(0, 3).map((z) => (
                    <li key={z.code} className="group flex items-center gap-6 py-6 first:pt-2 last:pb-0">
                      <span className="font-mono text-[4.5rem] font-medium leading-none tracking-[-0.06em] text-ink transition-smooth group-hover:text-chartreuse-strong sm:text-[5.5rem]">{z.code}</span>
                      <span>
                        <span className="block text-[22px] font-semibold tracking-[-0.03em]">{z.nom}</span>
                        <span className="mt-1 block text-[15px] text-muted-foreground">{z.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {r && (
              <div className="mt-6 rounded-[1.5rem] bg-card px-6 py-5 ring-1 ring-ink/[0.07]">
                <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">
                  <span className="block text-[17px] font-semibold tracking-[-0.02em] text-ink">Entreprise immatriculée depuis {r.creation}</span>
                  {r.nom_complet}, {r.forme.toLowerCase()}. SIREN {r.siren}.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
