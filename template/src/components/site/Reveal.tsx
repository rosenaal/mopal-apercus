import type { ReactNode } from "react";
import { motion } from "framer-motion";

/*
  Entrée au scroll : fondu + montée + léger flou qui se résout. Un seul
  pattern pour tout le site. Props littérales fraîches à chaque rendu —
  jamais d'objet `Variants` partagé (conflit avec le double montage StrictMode).
*/
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article" | "figure";
}) {
  const Cmp = motion[as];
  return (
    <Cmp
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </Cmp>
  );
}
