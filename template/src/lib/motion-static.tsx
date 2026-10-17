/**
 * Substitut de `framer-motion` utilisé UNIQUEMENT par le build SSR (voir
 * l'alias conditionnel dans vite.config.ts).
 *
 * Pourquoi : au prérendu, `framer-motion` sérialiserait l'état `initial` des
 * animations, c'est-à-dire `style="opacity:0"` sur la quasi-totalité du
 * contenu. Un crawler qui lit le HTML sans exécuter le JavaScript verrait
 * donc une page dont tout le texte est transparent, ce qui est exactement le
 * signal qu'on cherche à éviter.
 *
 * Ce shim rend les mêmes balises, sans aucune prop d'animation : le HTML
 * statique sort propre et lisible. Le bundle client, lui, importe le vrai
 * `framer-motion` et les animations restent intactes à l'écran.
 */
import { createElement, forwardRef, type ReactNode } from "react";

/* Props propres à framer-motion, à retirer avant de passer au DOM. */
const PROPS_MOTION = new Set([
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "viewport",
  "whileInView",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "layout",
  "layoutId",
  "drag",
  "onAnimationStart",
  "onAnimationComplete",
  "onViewportEnter",
  "onViewportLeave",
  /* `style` peut contenir des MotionValue non sérialisables ; les seuls
     éléments concernés ici sont les rails décoratifs `aria-hidden`. */
  "style",
]);

type AnyProps = Record<string, unknown>;

const nettoie = (props: AnyProps): AnyProps => {
  const out: AnyProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (!PROPS_MOTION.has(k)) out[k] = v;
  }
  return out;
};

const composant = (tag: string) =>
  forwardRef<unknown, AnyProps>((props, ref) => createElement(tag, { ...nettoie(props), ref }));

/* Proxy : `motion.nimporteQuelleBalise` renvoie le composant correspondant. */
export const motion: Record<string, ReturnType<typeof composant>> = new Proxy(
  {} as Record<string, ReturnType<typeof composant>>,
  {
    get(cache, tag: string) {
      if (!(tag in cache)) cache[tag] = composant(tag);
      return cache[tag];
    },
  },
);

export const MotionConfig = ({ children }: { children?: ReactNode }) => children ?? null;
export const AnimatePresence = ({ children }: { children?: ReactNode }) => children ?? null;
export const LazyMotion = ({ children }: { children?: ReactNode }) => children ?? null;

/* Hooks : valeurs inertes, jamais lues pendant un rendu statique. */
const valeurInerte = { get: () => 0, set: () => {}, on: () => () => {}, destroy: () => {} };
export const useScroll = () => ({ scrollY: valeurInerte, scrollYProgress: valeurInerte, scrollX: valeurInerte, scrollXProgress: valeurInerte });
export const useSpring = () => valeurInerte;
export const useTransform = () => valeurInerte;
export const useMotionValue = () => valeurInerte;
export const useMotionValueEvent = () => {};
export const useInView = () => false;
export const useReducedMotion = () => false;
export const useAnimate = () => [() => {}, () => Promise.resolve()];
