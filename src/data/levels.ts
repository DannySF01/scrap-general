import type LevelConfig from "../types/levels";

export const LEVELS_MANIFEST: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: "Sector 01 // Perimeter Breaked",
    description:
      "Intercept incoming scouting forces before they secure the flank lines.",
    rewards: { scrap: 500, alloy: 5 },
    waves: [
      {
        allowedTypes: ["MINION"],
        spawnInterval: 1500,
      },
      {
        allowedTypes: ["MINION", "ARMORED_MINION"],
        spawnInterval: 1500,
      },
    ],
  },
  2: {
    id: 2,
    name: "Sector 02 // Core Network Vault",
    description:
      "Defend the structural power hubs from a dense vanguard division.",
    rewards: { scrap: 1200, alloy: 10 },
    waves: [
      {
        allowedTypes: ["ARMORED_MINION"],
        spawnInterval: 1500,
      },
    ],
  },
  3: {
    id: 3,
    name: "Sector 03 // Core Network Vault",
    description:
      "Defend the structural power hubs from a dense vanguard division.",
    rewards: { scrap: 1200, alloy: 10 },
    waves: [
      {
        allowedTypes: ["ARMORED_MINION", "REGENERATOR"],
        spawnInterval: 1500,
      },
    ],
  },
  4: {
    id: 4,
    name: "Sector 04 // Core Network Vault",
    description:
      "Defend the structural power hubs from a dense vanguard division.",
    rewards: { scrap: 1200, alloy: 10 },
    waves: [
      {
        allowedTypes: ["ARMORED_MINION", "REGENERATOR"],
        spawnInterval: 1500,
      },
    ],
  },
  5: {
    id: 5,
    name: "Sector 05 // Core Network Vault",
    description:
      "Defend the structural power hubs from a dense vanguard division.",
    rewards: { scrap: 1200, alloy: 10 },
    waves: [
      {
        allowedTypes: ["ARMORED_MINION", "REGENERATOR", "SHIELDER"],
        spawnInterval: 1500,
      },
    ],
  },
  6: {
    id: 6,
    name: "Sector 06 // Core Network Vault",
    description:
      "Defend the structural power hubs from a dense vanguard division.",
    rewards: { scrap: 1200, alloy: 10 },
    waves: [
      {
        allowedTypes: ["ARMORED_MINION", "REGENERATOR", "SHIELDER"],
        spawnInterval: 1500,
      },
    ],
  },
};
