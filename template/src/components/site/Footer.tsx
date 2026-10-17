import Logo from "./Logo";
import { S, href } from "@/lib/site";

const titre = "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground";
const lien = "rounded-md transition-quick hover:text-chartreuse-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chartreuse-strong focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function Footer() {
  const r = S.registre;
  return (
    <footer className="overflow-hidden border-t border-ink/[0.07] pt-16 sm:pt-20">
      <div className="container-wide">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-10">
          <div className="col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{S.footer.desc}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h2 className={titre}>Contact</h2>
            <a href={`tel:${S.tel.tel}`} className={`tabular mt-4 inline-block text-[22px] font-semibold tracking-[-0.03em] ${lien}`}>{S.tel.display}</a>
            {S.email && <p className="mt-1"><a href={`mailto:${S.email}`} className={`break-all text-[15px] text-muted-foreground ${lien}`}>{S.email}</a></p>}
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h2 className={titre}>Horaires</h2>
            <ul className="mt-4 space-y-1.5 text-[15px] text-muted-foreground">
              {S.horaires.map((x) => (
                <li key={x.jours}><span className="block text-ink">{x.jours}</span><span className="font-mono text-[13px]">{x.heures}</span></li>
              ))}
              {S.horaires.length === 0 && <li>Sur rendez-vous</li>}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-3">
            <h2 className={titre}>Secteur</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{S.adresse.complete}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{S.zone.texte}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ink/[0.07] py-6 text-[13px] text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
          <p>
            <span className="block">© {new Date().getFullYear()} {S.nom}</span>
            <span className="mt-1 block">
              Conception &amp; réalisation{" "}:{" "}
              <a href="https://www.agencemopale.com/" target="_blank" rel="noopener noreferrer"
                className="transition-quick rounded-sm underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                MOPALE
              </a>
            </span>
          </p>
          <div className="flex flex-col gap-2 sm:items-end">
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <a href={href("/mentions-legales/")} className={lien}>Mentions légales</a>
              <a href={href("/confidentialite/")} className={lien}>Politique de confidentialité</a>
            </p>
            {r && <p>{r.nom_complet} · {r.forme} · SIREN {r.siren} · APE {r.ape}</p>}
          </div>
        </div>
      </div>

      <p aria-hidden="true"
        className="pointer-events-none mx-auto -mb-[0.2em] max-w-[88rem] select-none whitespace-nowrap text-center font-extrabold leading-[0.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_hsl(var(--ink)/0.12)]"
        style={{ fontSize: "clamp(6rem, 30vw, 28rem)" }}>
        {S.signature}
      </p>
    </footer>
  );
}
