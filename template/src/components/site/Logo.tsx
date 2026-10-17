import { S } from "@/lib/site";
import { icon } from "@/lib/icons";

/* Marque typographique : pastille encre, deux tons, icône du métier. */
export default function Logo({ compact = false }: { compact?: boolean }) {
  const Icon = icon(S.logo.icon);
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5">
        <Icon size={16} weight="bold" className="text-chartreuse" aria-hidden="true" />
        <span className="whitespace-nowrap text-[15px] font-extrabold uppercase leading-none tracking-[-0.03em]">
          <span className="text-white">{S.logo.a}</span>
          {S.logo.b && <> <span className="text-chartreuse">{S.logo.b}</span></>}
        </span>
      </span>
      {!compact && S.logo.sous && (
        <span className="hidden text-[14px] font-medium leading-tight tracking-[-0.01em] text-ink sm:block">
          {S.logo.sous}
        </span>
      )}
    </span>
  );
}
