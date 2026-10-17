import { S } from "@/lib/site";

/* Bandeau d'aperçu : la maquette est présentée au prospect, elle n'est ni
   indexée ni contractuelle. Retiré à la mise en ligne réelle. */
export default function DemoBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-3 sm:px-6">
      <p className="pointer-events-auto flex max-w-full items-center gap-3 rounded-full bg-ink/90 py-2 pl-4 pr-2 text-[12px] text-white shadow-float ring-1 ring-white/10 backdrop-blur">
        <span className="truncate">
          Maquette préparée par <span className="font-semibold">MOPALE</span> pour {S.nom} — textes à valider ensemble
        </span>
        <a href="https://www.agencemopale.com/" target="_blank" rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-chartreuse px-3 py-1 font-medium text-onaccent transition-quick hover:bg-white hover:text-ink">
          En savoir plus
        </a>
      </p>
    </div>
  );
}
