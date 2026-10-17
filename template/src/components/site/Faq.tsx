import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";
import { S } from "@/lib/site";

/* Questions courtes, toutes visibles dans une grille à deux colonnes. */
export default function Faq() {
  const faq = S.faq.slice(0, 6);
  if (faq.length === 0) return null;
  return (
    <section id="faq" className="section-y pt-0 sm:pt-0 lg:pt-0">
      <div className="container-wide">
        <div className="bezel">
          <div className="bezel-core grid gap-12 p-7 sm:p-12 lg:grid-cols-12 lg:gap-10 lg:p-16">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Questions fréquentes</p>
              <h2 className="mt-7 text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[3rem]">
                Avant <span className="text-ink/50">d'appeler.</span>
              </h2>
            </Reveal>
            <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
              {faq.map((f, i) => (
                <Reveal key={f.q} delay={(i % 2) * 0.06} className="border-t border-ink/[0.08] pt-6">
                  <dt className="flex gap-3 text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                    <span className="mt-[3px] font-mono text-[11px] font-medium text-chartreuse-strong">{String(i + 1).padStart(2, "0")}</span>
                    {f.q}
                  </dt>
                  <dd className="mt-3 pl-7 text-[15px] leading-relaxed text-muted-foreground text-pretty">{f.r}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
