import type { Ability, Enemy, Robot } from "../types/game";
import { Crosshair, Shield, Target, Triangle, Zap } from "lucide-react";

export const REGISTRY: {
  ROBOTS: Record<Robot["type"], Robot>;
  ENEMIES: Record<Enemy["type"], Enemy>;
  ABILITIES: Record<string, Ability>;
} = {
  ROBOTS: {
    SENTRY: {
      id: "SENTRY",
      type: "SENTRY",
      damage: 5,
      fireRate: 800,
      color: "indigo",
      icon: Crosshair,
    },
    SNIPER: {
      id: "SNIPER",
      type: "SNIPER",
      damage: 25,
      fireRate: 2500,
      color: "emerald",
      icon: Target,
    },
  },
  ENEMIES: {
    MINION: {
      id: "MINION",
      type: "MINION",
      hp: 20,
      maxHp: 20,
      damage: 10,
      speed: 0.2,
      reward: 10,
      position: { x: 0, y: 0 },
      spawnChance: 80,
      color: "red",
      icon: Triangle,
      size: 20,
    },
    TANK: {
      id: "TANK",
      type: "TANK",
      hp: 120,
      maxHp: 120,
      damage: 50,
      speed: 0.08,
      reward: 45,
      position: { x: 0, y: 0 },
      spawnChance: 20,
      color: "sky",
      icon: Shield,
      size: 30,
    },
  },
  ABILITIES: {
    EMP: {
      id: "EMP",
      type: "EMP",
      cost: 150,
      cooldown: 15000,
      duration: 3000,
      color: "cyan",
      icon: Zap,
    },
  },
};
