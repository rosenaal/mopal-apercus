import Reveal from "./Reveal";
import { S } from "@/lib/site";
import { icon } from "@/lib/icons";

/* Une seule coque pour les quatre engagements, séparés par des filets. */
export default function Engagements() {
  return (
    <section aria-label="Nos engagements" className="pb-8">
      <div className="container-wide">
        <Reveal className="bezel">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[calc(2rem-0.375rem)] bg-ink/[0.07] lg:grid-cols-4">
            {S.engagements.slice(0, 4).map((it) => {
              const I = icon(it.icon);
              return (
                <li key={it.titre} className="flex flex-col gap-4 bg-card p-5 sm:gap-5 sm:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-ink ring-1 ring-ink/[0.06]">
                    <I size={22} weight="light" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold leading-snug tracking-[-0.02em] sm:text-[17px]">{it.titre}</span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-muted-foreground sm:text-[15px]">{it.label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
