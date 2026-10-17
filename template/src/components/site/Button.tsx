import type { ComponentType, ReactNode } from "react";
import type { IconProps } from "@phosphor-icons/react";

type Icon = ComponentType<IconProps>;
type ButtonVariant = "accent" | "solid" | "light" | "ghost";
type ButtonSize = "md" | "lg";

const base =
  "group inline-flex items-center gap-3 rounded-full font-medium tracking-[-0.01em] " +
  "transition-smooth active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/*
  Hiérarchie de sens : `accent` (chartreuse) = CTA de conversion. Le
  chartreuse porte toujours l'encre, jamais du blanc. Anneau de focus défini
  par variante : sur le panneau graphite, l'offset doit être graphite.
*/
const variants: Record<ButtonVariant, string> = {
  accent: "bg-chartreuse text-onaccent hover:bg-ink hover:text-white focus-visible:ring-ink focus-visible:ring-offset-background",
  solid: "bg-ink text-white hover:bg-chartreuse hover:text-onaccent focus-visible:ring-chartreuse-strong focus-visible:ring-offset-background",
  light: "bg-white text-ink hover:bg-chartreuse hover:text-onaccent focus-visible:ring-chartreuse focus-visible:ring-offset-night",
  ghost: "bg-card text-ink ring-1 ring-ink/10 hover:ring-ink/30 focus-visible:ring-chartreuse-strong focus-visible:ring-offset-background",
};

/* Pastille de l'icône suiveuse, accordée à la variante et au survol. */
const bezel: Record<ButtonVariant, string> = {
  accent: "bg-ink/10 group-hover:bg-white/15",
  solid: "bg-white/15 group-hover:bg-ink/10",
  light: "bg-ink/[0.07]",
  ghost: "bg-ink/[0.06]",
};

const sizes: Record<ButtonSize, { btn: string; dot: string; icon: number }> = {
  md: { btn: "py-2 pl-5 pr-2 text-[15px]", dot: "h-8 w-8", icon: 16 },
  lg: { btn: "py-2.5 pl-6 pr-2.5 text-[16px]", dot: "h-10 w-10", icon: 18 },
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  icon: Icon;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
  external?: boolean;
}

export default function ButtonLink({
  href,
  children,
  icon: IconCmp,
  variant = "accent",
  size = "md",
  className = "",
  ariaLabel,
  external = false,
}: ButtonLinkProps) {
  const s = sizes[size];
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${variants[variant]} ${s.btn} ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full ${bezel[variant]} ${s.dot} transition-smooth group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105`}
      >
        <IconCmp size={s.icon} weight="regular" />
      </span>
    </a>
  );
}
