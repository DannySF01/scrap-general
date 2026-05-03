export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
export type RobotType = "SENTRY";
export type EnemyType = "SCOUT" | "TANK";

export interface Base {
  id: number;
  name: string;
  x: number;
  y: number;
  isUnlocked: boolean;
  occupantId: string | null;
}

export interface Robot {
  id: string;
  type: RobotType;
  position: { x: number; y: number };
  level: number;
  damage: number;
  fireRate: number;
  lastShot: number;
  lastTargetPos: { x: number; y: number } | null;
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
}

export interface ScrapDrop {
  id: string;
  rarity: Rarity;
  value: number;
  x: number;
  y: number;
  isCollected: boolean;
}

export interface Ability {
  id: string;
  name: string;
  cooldown: number;
  lastUsed: number;
  isActive: boolean;
}
