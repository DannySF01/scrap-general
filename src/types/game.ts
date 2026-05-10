import type { LucideIcon } from "lucide-react";

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type RobotType = "SENTRY" | "SNIPER";
export type EnemyType =
  | "MINION"
  | "ARMORED_MINION"
  | "REGENERATOR"
  | "SHIELDER"
  | "OVERLORD";
export type AbilityType = "EMP" | "REPAIR" | "OVERCLOCK" | "NAPALM";

export interface Base {
  id: number;
  name: string;
  x: number;
  y: number;
  isUnlocked: boolean;
  occupantId: string | null;
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
  cost: number;
  icon: LucideIcon;
  requires?: string[];
  modifiers?: Record<string, number>;
}

export interface Robot {
  id: string;
  type: RobotType;
  position?: { x: number; y: number };
  level?: number;
  damage: number;
  fireRate: number;
  lastShot?: number;
  lastTargetPos?: { x: number; y: number } | null;
  color: string;
  icon: LucideIcon;
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
}

export interface ScrapDrop {
  id: string;
  rarity: Rarity;
  value: number;
  x: number;
  y: number;
  isCollected: boolean;
}
