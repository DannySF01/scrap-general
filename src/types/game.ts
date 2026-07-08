import type { LucideIcon } from "lucide-react";

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type TurretType = "SENTRY" | "SNIPER" | "ROCKET";
export type EnemyType =
  | "MINION"
  | "ARMORED_MINION"
  | "REGENERATOR"
  | "SHIELDER"
  | "APEX_STALKER"
  | "OVERSHIELD_TITAN"
  | "CRUSHER_PRIME"
  | "OVERLORD"
  | "NEXUS_GHOST"
  | "APOCALYPSE";
export type AbilityType = "EMP" | "REPAIR" | "OVERCLOCK" | "NAPALM";

export interface Blueprint {
  id: string;
  tab: "TURRETS" | "EXPANSIONS" | "ABILITIES";
  title: string;
  description: string;
  maxLevel?: number;
  source: "SCRAP" | "MATERIAL_DROP" | "MISSION_REWARD" | "STORE";
  cost: {
    scrap?: number;
    alloy?: number;
    core?: number;
  };
  modifiers?: Record<string, number>;
}

export interface Ability {
  id: string;
  type: AbilityType;
  cost: number;
  cooldown: number;
  duration: number;
  color: string;
  icon: LucideIcon;
}

export interface Upgrade {
  id: string;
  category: string;
  name: string;
  description: string;
  maxLevel: number;
  tier: number;
  cost: { scrap: number };
  icon: LucideIcon;
  requires?: string[];
  modifiers?: Record<string, number>;
}

export interface Turret {
  id: string;
  type: TurretType;
  level?: number;
  damage: number;
  fireRate: number;
  lastShot?: number;
  splashRadius?: number;
  lastTargetPos?: { x: number; y: number } | null;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  damage: number;
  speed: number;
  isCrit: boolean;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  damage: number;
  speed: number;
  position: { x: number; y: number };
  reward: number;
  spawnChance: number;
  color: string;
  icon: LucideIcon | React.ComponentType<any>;
  size: number;
  lastSpawn?: number;
  destroyedAt?: number;
  stunnedAt?: number;
  meltedAt?: number;
}

export interface ScrapDrop {
  id: string;
  rarity: Rarity;
  value: number;
  x: number;
  y: number;
  isCollected: boolean;
}
