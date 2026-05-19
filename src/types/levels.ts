import type { Enemy } from "./game";

export interface Wave {
  allowedTypes: Enemy["type"][];
  spawnInterval: number;
}

export default interface LevelConfig {
  id: number;
  name: string;
  description: string;
  waves: Wave[];
  rewards: {
    scrap?: number;
    alloy?: number;
    core?: number;
  };
}
