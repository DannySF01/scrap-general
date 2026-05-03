export type Rarity = "COMMON" | "RARE" | "EPIC" | "LEGENDARY";

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
  type: "SENTRY";
  x: number;
  y: number;
  level: number;
  damage: number;
  fireRate: number;
  lastShot: number;
}

export interface Enemy {
  id: string;
  rarity: Rarity;
  hp: number;
  maxHp: number;
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
