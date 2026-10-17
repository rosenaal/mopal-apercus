import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S, href } from "@/lib/site";

/* Photos publiées par l'entreprise sur sa fiche Google. Aucune image de
   banque. Section absente s'il y a moins de trois photos (après le héros). */
export default function Galerie() {
  const photos = S.photos.slice(1, 7);
  if (photos.length < 3) return null;
  return (
    <section id="realisations" className="section-y pt-0 sm:pt-0 lg:pt-0" aria-label="Photos de chantiers">
      <div className="container-wide flex items-end justify-between gap-6">
        <Reveal>
          <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Sur le terrain</p>
          <h2 className="mt-7 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3rem]">
            Photos <span className="text-ink/50">de chantiers.</span>
          </h2>
        </Reveal>
        <p className="hidden text-[14px] text-muted-foreground sm:block">Faites défiler →</p>
      </div>
      <ul tabIndex={0} aria-label="Galerie, défilement horizontal"
        className="snap-row mt-10 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong sm:px-8 lg:px-[max(3rem,calc((100vw-82rem)/2+3rem))]">
        {photos.map((p, i) => (
          <Reveal as="li" key={p.src} delay={i * 0.05} className="w-[72vw] shrink-0 snap-start sm:w-[340px]">
            <figure className="bezel">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-ink">
                <img src={href(p.src)} width={p.w} height={p.h} alt={p.alt} loading="lazy"
                  className="h-full w-full object-cover transition-smooth duration-1000 group-hover:scale-[1.04]" />
              </div>
            </figure>
          </Reveal>
        ))}
      </ul>
      <p className="container-wide mt-6 text-[13px] text-muted-foreground">Photos publiées par {S.nom} sur sa fiche Google.</p>
    </section>
  );
}
