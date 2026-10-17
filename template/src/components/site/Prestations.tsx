import { S, type Prestation } from "@/lib/site";
import { icon } from "@/lib/icons";
import Reveal from "./Reveal";
import { Crosshair } from "./Reticle";

function Tags({ tags, night = false }: { tags: readonly string[]; night?: boolean }) {
  return (
    <p className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className={`rounded-full px-3 py-1 text-[13px] ${night ? "bg-white/[0.07] text-white/70" : "bg-background text-muted-foreground ring-1 ring-ink/[0.06]"}`}>
          {t}
        </span>
      ))}
    </p>
  );
}

function Carte({ num, icon: name, titre, desc, tags }: Prestation) {
  const I = icon(name);
  return (
    <div className="bezel group h-full transition-smooth hover:-translate-y-1">
      <article className="bezel-core flex h-full flex-col gap-10 p-7 sm:p-9">
        <div className="flex items-start justify-between">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-ink ring-1 ring-ink/[0.06] transition-smooth group-hover:bg-chartreuse group-hover:text-onaccent group-hover:ring-transparent">
            <I size={28} weight="light" />
          </span>
          <span className="font-mono text-[12px] text-muted-foreground">{num}</span>
        </div>
        <div className="mt-auto">
          <h3 className="text-[1.875rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.25rem]">{titre}</h3>
          <p className="mt-3 max-w-[30rem] text-[16px] leading-relaxed text-muted-foreground text-pretty">{desc}</p>
          <div className="mt-6"><Tags tags={tags} /></div>
        </div>
      </article>
    </div>
  );
}

/* Bento 12 colonnes : la prestation principale sur un cœur graphite (7 col.
   × 2 rangées), trois cartes secondaires, puis les autres travaux en liste. */
export default function Prestations() {
  const p = S.prestations;
  const Main = icon(p.principale.icon);
  const sec = p.secondaires.slice(0, 3);
  return (
    <section id="prestations" className="section-y">
      <div className="container-wide">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <p className="eyebrow"><Crosshair className="h-3.5 w-3.5 text-chartreuse-strong" />Prestations</p>
            <h2 className="mt-7 h2-display">{p.h2} <span className="text-ink/50">{p.h2_soft}</span></h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4">
            <p className="max-w-sm text-[17px] leading-relaxed text-muted-foreground text-pretty">{p.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 lg:grid-cols-12 lg:gap-5">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <div className="bezel group h-full transition-smooth hover:-translate-y-1">
              <article className="relative flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-ink p-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-10 lg:min-h-0">
                <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-16 h-[26rem] w-[26rem] text-white/[0.07] transition-smooth duration-1000 group-hover:-translate-y-2" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="200" cy="200" r="150" /><circle cx="200" cy="200" r="100" /><circle cx="200" cy="200" r="50" />
                  <path d="M200 20v360M20 200h360" />
                </svg>
                <div className="relative flex items-start justify-between">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chartreuse text-onaccent"><Main size={32} weight="light" /></span>
                  <span className="font-mono text-[12px] text-white/50">{p.principale.num} · Cœur de métier</span>
                </div>
                <div className="relative mt-auto pt-16">
                  <h3 className="text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-[4rem]">{p.principale.titre}</h3>
                  <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/65 text-pretty">{p.principale.desc}</p>
                  <div className="mt-8"><Tags tags={p.principale.tags} night /></div>
                </div>
              </article>
            </div>
          </Reveal>

          {sec.map((c, i) => (
            <Reveal key={c.titre} delay={0.08 + i * 0.04} className="lg:col-span-5"><Carte {...c} /></Reveal>
          ))}

          {p.autres.length > 0 && (
            <Reveal delay={0.1} className="lg:col-span-7">
              <div className="bezel h-full">
                <div className="bezel-core flex h-full flex-col p-7 sm:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[1.5rem] font-semibold tracking-[-0.035em]">{p.autres_titre}</h3>
                    <span className="hidden font-mono text-[12px] text-muted-foreground sm:inline">
                      {String(sec.length + 2).padStart(2, "0")} à {String(sec.length + 1 + p.autres.length).padStart(2, "0")}
                    </span>
                  </div>
                  <ul className="mt-6 divide-y divide-ink/[0.07] border-t border-ink/[0.07]">
                    {p.autres.map((s) => {
                      const I = icon(s.icon);
                      return (
                        <li key={s.titre} className="group/row flex items-center gap-5 py-5">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background ring-1 ring-ink/[0.06] transition-smooth group-hover/row:bg-chartreuse group-hover/row:text-onaccent">
                            <I size={22} weight="light" aria-hidden="true" />
                          </span>
                          <span className="flex-1">
                            <span className="block text-[17px] font-semibold tracking-[-0.02em]">{s.titre}</span>
                            <span className="mt-0.5 block text-[15px] leading-relaxed text-muted-foreground">{s.desc}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
