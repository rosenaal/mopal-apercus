import { GoogleLogo, Quotes, Star } from "@phosphor-icons/react";
import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S } from "@/lib/site";

/* Avis Google cités sans modification (prénom + initiale). Section absente
   s'il y a moins de deux avis exploitables. */
export default function Avis() {
  const g = S.google;
  const avis = g.avis.slice(0, 3);
  if (avis.length < 2 || g.note === null) return null;
  const note = g.note.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <section id="avis" className="section-y">
      <div className="container-wide">
        <Reveal className="max-w-3xl">
          <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Avis clients</p>
          <h2 className="mt-7 h2-display">Ce qu'en disent <span className="text-ink/50">les clients.</span></h2>
        </Reveal>
        <div className="mt-16 grid gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-4">
            <div className="bezel h-full">
              <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[calc(2rem-0.375rem)] bg-ink p-8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <GoogleLogo size={22} weight="light" aria-hidden="true" />
                </span>
                <div>
                  <p className="flex items-end gap-3">
                    <span className="text-[56px] font-semibold leading-none tracking-[-0.04em]">{note}</span>
                    <span className="mb-2 flex gap-0.5 text-chartreuse" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} weight={i < Math.round(g.note ?? 0) ? "fill" : "regular"} />)}
                    </span>
                  </p>
                  <p className="mt-3 text-[20px] font-medium leading-[1.2] tracking-[-0.02em]">
                    Note moyenne des {g.nb_avis} avis publiés sur la fiche Google.
                  </p>
                  <a href={S.maps_url} target="_blank" rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-ink transition-smooth hover:bg-chartreuse hover:text-onaccent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse">
                    Lire tous les avis<span className="sr-only"> (nouvel onglet)</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          {avis.map((a, i) => (
            <Reveal key={a.auteur + i} delay={0.08 * (i + 1)} className={avis.length === 2 ? "lg:col-span-4" : "lg:col-span-4"}>
              <div className="bezel h-full">
                <figure className="bezel-core flex h-full flex-col p-8 lg:p-10">
                  <Quotes size={36} weight="fill" className="text-chartreuse-strong/80" aria-hidden="true" />
                  <blockquote className="mb-8 mt-6 text-pretty text-[19px] leading-[1.45] tracking-[-0.01em]">{a.texte}</blockquote>
                  <figcaption className="mt-auto flex items-center justify-between gap-4 border-t border-ink/[0.07] pt-6 text-[14px]">
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-chartreuse-soft text-[15px] font-medium text-chartreuse-strong">{a.auteur[0]}</span>
                      <span className="font-medium">{a.auteur}</span>
                    </span>
                    <span className="text-muted-foreground">{a.date}</span>
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
