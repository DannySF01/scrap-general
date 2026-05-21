import type LevelConfig from "../types/levels";
import type { ChapterConfig } from "../types/levels";

export const CAMPAIGN_MANIFEST: Record<number, ChapterConfig> = {
  1: {
    id: 1,
    name: "Chapter 01 - The Sunken Foundry",
    description:
      "Scavenge the forgotten rust corridors of Aethel-IV's deep industrial pipelines.",
    levels: [
      {
        id: "1-1",
        name: "Flank Leak",
        description:
          "Repel a quick scouting wing of low-tier mechanical scrap insects infiltrating the parameter.",
        rewards: { scrap: 400, alloy: 2 },
        waves: [{ allowedTypes: ["MINION"], spawnInterval: 3000 }],
      },
      {
        id: "1-2",
        name: "Iron Influx",
        description:
          "Heavy bipedal logistics loaders are shifting through the primary mining grid corridor.",
        rewards: { scrap: 800, alloy: 5 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 2000 },
          { allowedTypes: ["MINION", "ARMORED_MINION"], spawnInterval: 1500 },
        ],
      },
      {
        id: "1-3",
        name: "BOSS: CRUSHER PRIME",
        description:
          "CRITICAL INCURSION. A massive, heavily armored recycling behemoth is descending down the vertical vector.",
        rewards: { scrap: 2000, alloy: 15, core: 1 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 2000 },
          { allowedTypes: ["ARMORED_MINION"], spawnInterval: 3000 },
          //{ allowedTypes: ["CRUSHER_PRIME"], spawnInterval: 10000 }, // Boss spawn entry point
        ],
      },
    ],
  },
  2: {
    id: 2,
    name: "Chapter 02 - The Neon Slums",
    description:
      "Infiltrate the high-density tech grids and alleyways controlled by rogue network nodes.",
    levels: [
      {
        id: "2-1",
        name: "Proxy Ping",
        description:
          "Corrupted network arrays are deploying mechanical shield pulses down the narrow avenues.",
        rewards: { scrap: 1200, alloy: 8 },
        waves: [
          { allowedTypes: ["MINION", "REGENERATOR"], spawnInterval: 1800 },
        ],
      },
      {
        id: "2-2",
        name: "Carrier Surge",
        description:
          "Heavy mobile automaton factories are printing miniature combat swarms directly onto the grid.",
        rewards: { scrap: 1800, alloy: 12 },
        waves: [
          { allowedTypes: ["MINION", "REGENERATOR"], spawnInterval: 1500 },
          { allowedTypes: ["ARMORED_MINION", "OVERLORD"], spawnInterval: 4000 },
        ],
      },
      {
        id: "2-3",
        name: "BOSS: NEXUS_GHOST",
        description:
          "SECURITY BREACH. A sentient software ghost virus is threatening to hack your terminal console components.",
        rewards: { scrap: 3500, alloy: 25, core: 1 },
        waves: [
          { allowedTypes: ["REGENERATOR", "OVERLORD"], spawnInterval: 3500 },
          //{ allowedTypes: ["NEXUS_GHOST"], spawnInterval: 12000 },
        ],
      },
    ],
  },
  3: {
    id: 3,
    name: "Chapter 03 - The Orbital Cradle",
    description:
      "Storm the hyper-secure data repositories floating above the high-tech void labs.",
    levels: [
      {
        id: "3-1",
        name: "Stealth Vector",
        description:
          "Warning: High-frequency scanning interference detected. Cloaked units are navigating the inner flank pipelines.",
        rewards: { scrap: 2500, alloy: 18, core: 1 },
        waves: [
          //{ allowedTypes: ["MINION", "APEX_STALKER"], spawnInterval: 1200 },
        ],
      },
      {
        id: "3-2",
        name: "Dread Matrix",
        description:
          "The mainframe defense protocols are mobilizing massive multi-layered shielding titans toward the core wall.",
        rewards: { scrap: 4000, alloy: 30, core: 1 },
        waves: [
          // { allowedTypes: ["APEX_STALKER", "OVERLORD"], spawnInterval: 1500 },
          //  { allowedTypes: ["ARMORED_MINION", "OVERSHIELD_TITAN"], spawnInterval: 3000 },
        ],
      },
      {
        id: "3-3",
        name: "BOSS: APOCALYPSE",
        description:
          "GRAND TERMINATION CODES ENGAGED. Neutralize the planetary supercomputer mainframe before system destruction.",
        rewards: { scrap: 10000, alloy: 50, core: 3 },
        waves: [
          //{  allowedTypes: ["APEX_STALKER", "OVERSHIELD_TITAN"], spawnInterval: 2000,  },
          //  { allowedTypes: ["APOCALYPSE_ENGINE"], spawnInterval: 15000 },
        ],
      },
    ],
  },
};

export const LEVELS_MANIFEST: Record<string, LevelConfig> = Object.values(
  CAMPAIGN_MANIFEST,
).reduce(
  (acc, chapter) => {
    chapter.levels.forEach((level) => {
      acc[level.id] = level;
    });
    return acc;
  },
  {} as Record<string, any>,
);
