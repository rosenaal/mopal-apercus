import type { ComponentType } from "react";
import {
  HouseLine, Drop, PaintBrushBroad, Funnel, Buildings, PaintRoller, SquaresFour, Hammer,
  MapPin, Receipt, Clock, ShieldCheck, Leaf, Tree, Flower, Scissors, Plant,
  Flame, Thermometer, Wrench, Snowflake, Sun, Wind, Shower, Pipe,
  Key, Lock, Door, Warning, Phone, Truck, Ruler, Broom, Sparkle,
  Recycle, HandHeart, Star, Lightning, Wall, Stairs, Certificate, Users,
  type IconProps,
} from "@phosphor-icons/react";
import type { IconName } from "./site";

export type Icon = ComponentType<IconProps>;

const ICONS: Record<IconName, Icon> = {
  house: HouseLine, drop: Drop, "paint-brush": PaintBrushBroad, funnel: Funnel, buildings: Buildings,
  "paint-roller": PaintRoller, squares: SquaresFour, hammer: Hammer, "map-pin": MapPin, receipt: Receipt,
  clock: Clock, shield: ShieldCheck, leaf: Leaf, tree: Tree, flower: Flower, scissors: Scissors, plant: Plant,
  flame: Flame, thermometer: Thermometer, wrench: Wrench, snowflake: Snowflake, sun: Sun, wind: Wind,
  faucet: Shower, pipe: Pipe, key: Key, lock: Lock, door: Door, warning: Warning, phone: Phone, truck: Truck,
  ruler: Ruler, broom: Broom, sparkle: Sparkle, recycle: Recycle, "hand-heart": HandHeart, star: Star,
  lightning: Lightning, wall: Wall, stairs: Stairs, certificate: Certificate, users: Users,
};

export function icon(name: IconName | string): Icon {
  return ICONS[name as IconName] ?? Sparkle;
}
