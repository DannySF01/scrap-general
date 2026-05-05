import type { LucideIcon } from "lucide-react";

export type GameStatus = "IDLE" | "PLAYING" | "PAUSED" | "GAME_OVER";
export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type RobotType = "SENTRY" | "SNIPER";
export type EnemyType = "MINION" | "TANK";
export type AbilityType = "EMP";

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
  icon: LucideIcon;
  size: number;
}

export interface ScrapDrop {
  id: string;
  rarity: Rarity;
  value: number;
  x: number;
  y: number;
  isCollected: boolean;
}
