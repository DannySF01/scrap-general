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
          "Repel a quick scouting wing of low-tier mechanical scrap insects infiltrating the perimeter.",
        rewards: { scrap: 300, alloy: 1 },
        waves: [{ allowedTypes: ["MINION"], spawnInterval: 3000 }],
      },
      {
        id: "1-2",
        name: "Pipeline Trace",
        description:
          "Scouts are moving down the secondary auxiliary conduits. Keep weapon sensors warm.",
        rewards: { scrap: 450, alloy: 2 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 2500 },
          { allowedTypes: ["MINION"], spawnInterval: 2000 },
        ],
      },
      {
        id: "1-3",
        name: "Iron Influx",
        description:
          "Heavy bipedal logistics loaders are shifting through the primary mining grid corridor.",
        rewards: { scrap: 600, alloy: 3 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 2000 },
          { allowedTypes: ["MINION", "ARMORED_MINION"], spawnInterval: 1800 },
        ],
      },
      {
        id: "1-4",
        name: "Ventilation Sweep",
        description:
          "Swarms are bypassing primary defense gates via air shafts. Wide spread weaponry recommended.",
        rewards: { scrap: 800, alloy: 4 },
        waves: [{ allowedTypes: ["MINION"], spawnInterval: 1200 }],
      },
      {
        id: "1-5",
        name: "GATEKEEPER: RECYCLER SQUAD",
        description:
          "MID-CHAPTER BREAKTHROUGH. Multiple armored heavy loaders are reinforcing the front lines.",
        rewards: { scrap: 1100, alloy: 6, core: 1 },
        waves: [{ allowedTypes: ["ARMORED_MINION"], spawnInterval: 2500 }],
      },
      {
        id: "1-6",
        name: "Drainage Bypass",
        description:
          "Drones are emerging from sludge reservoirs. Keep base integrity high.",
        rewards: { scrap: 1400, alloy: 7 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 1500 },
          { allowedTypes: ["ARMORED_MINION"], spawnInterval: 2300 },
        ],
      },
      {
        id: "1-7",
        name: "Pressure Valve",
        description:
          "The routing mainframe has breached. High-density scrap swarms are flooding the sectors.",
        rewards: { scrap: 1700, alloy: 9 },
        waves: [
          { allowedTypes: ["MINION", "ARMORED_MINION"], spawnInterval: 2000 },
        ],
      },
      {
        id: "1-8",
        name: "Smelting Vault",
        description:
          "Intense heat spikes detected. Automated security protocols have turned hostile.",
        rewards: { scrap: 2100, alloy: 11 },
        waves: [{ allowedTypes: ["ARMORED_MINION"], spawnInterval: 2000 }],
      },
      {
        id: "1-9",
        name: "Chamber Threshold",
        description:
          "Final defensive blockades before the core foundry. Clear the path.",
        rewards: { scrap: 2600, alloy: 14, core: 1 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 900 },
          { allowedTypes: ["ARMORED_MINION"], spawnInterval: 1500 },
        ],
      },
      {
        id: "1-10",
        name: "BOSS: CRUSHER PRIME",
        description:
          "CRITICAL INCURSION. A massive, heavily armored recycling behemoth is descending down the vertical vector.",
        rewards: { scrap: 4000, alloy: 25, core: 2 },
        waves: [{ allowedTypes: ["CRUSHER_PRIME"], spawnInterval: 1 }],
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
          "Corrupted network arrays are deploying mechanical shield pulses down narrow avenues.",
        rewards: { scrap: 3000, alloy: 15 },
        waves: [
          { allowedTypes: ["MINION", "REGENERATOR"], spawnInterval: 2200 },
        ],
      },
      {
        id: "2-2",
        name: "Signal Jam",
        description:
          "Static fields are blinding targeting computers. Defend the antenna junctions.",
        rewards: { scrap: 3400, alloy: 18 },
        waves: [
          { allowedTypes: ["MINION"], spawnInterval: 1500 },
          { allowedTypes: ["REGENERATOR"], spawnInterval: 2000 },
        ],
      },
      {
        id: "2-3",
        name: "Carrier Surge",
        description:
          "Heavy mobile automaton factories are printing miniature combat swarms onto the field.",
        rewards: { scrap: 3900, alloy: 21 },
        waves: [
          { allowedTypes: ["ARMORED_MINION", "OVERLORD"], spawnInterval: 4500 },
        ],
      },
      {
        id: "2-4",
        name: "Alleyway Ambush",
        description:
          "Tight geometry ahead. High-frequency interceptors are locking onto your tank tracks.",
        rewards: { scrap: 4500, alloy: 24 },
        waves: [{ allowedTypes: ["MINION", "OVERLORD"], spawnInterval: 2000 }],
      },
      {
        id: "2-5",
        name: "GATEKEEPER: THE GRID ASSEMBLEY",
        description:
          "MID-CHAPTER OVERLOAD. Twin factory matrices are mass-producing combat wings simultaneously.",
        rewards: { scrap: 5200, alloy: 28 },
        waves: [
          { allowedTypes: ["REGENERATOR", "OVERLORD"], spawnInterval: 3500 },
        ],
      },
      {
        id: "2-6",
        name: "Data Breach",
        description:
          "Rogue firewalls are executing automated wipes. Rapid drone clusters are rushing the terminal.",
        rewards: { scrap: 6000, alloy: 32 },
        waves: [
          { allowedTypes: ["MINION", "REGENERATOR"], spawnInterval: 1200 },
        ],
      },
      {
        id: "2-7",
        name: "Subnet Flush",
        description:
          "Flush infected nodes out of the regional routers. Expect high resistance.",
        rewards: { scrap: 6900, alloy: 36 },
        waves: [
          { allowedTypes: ["ARMORED_MINION"], spawnInterval: 1000 },
          { allowedTypes: ["OVERLORD"], spawnInterval: 4000 },
        ],
      },
      {
        id: "2-8",
        name: "Grid Siphon",
        description:
          "Reroute central core power lines while repelling reinforced maintenance swarms.",
        rewards: { scrap: 7900, alloy: 41 },
        waves: [
          {
            allowedTypes: ["MINION", "ARMORED_MINION", "OVERLORD"],
            spawnInterval: 1600,
          },
        ],
      },
      {
        id: "2-9",
        name: "Core Terminal",
        description:
          "The mainframe access gate is right ahead. Crack the final defensive grid layer.",
        rewards: { scrap: 9000, alloy: 47, core: 1 },
        waves: [
          { allowedTypes: ["REGENERATOR", "OVERLORD"], spawnInterval: 2500 },
        ],
      },
      {
        id: "2-10",
        name: "BOSS: NEXUS_GHOST",
        description:
          "SECURITY BREACH. A sentient software ghost virus is threatening to hack your terminal console components.",
        rewards: { scrap: 12000, alloy: 60, core: 2 },
        waves: [{ allowedTypes: ["NEXUS_GHOST"], spawnInterval: 1 }],
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
          "Warning: Scanning interference detected. Cloaked units are navigating inner pipelines.",
        rewards: { scrap: 15000, alloy: 70, core: 1 },
        waves: [
          { allowedTypes: ["MINION", "APEX_STALKER"], spawnInterval: 1400 },
        ],
      },
      {
        id: "3-2",
        name: "Vacuum Lock",
        description:
          "Decompression alert. High-speed phantom assassins are splitting through the hull breach.",
        rewards: { scrap: 16500, alloy: 78 },
        waves: [
          { allowedTypes: ["APEX_STALKER"], spawnInterval: 1200 },
          { allowedTypes: ["ARMORED_MINION"], spawnInterval: 1000 },
        ],
      },
      {
        id: "3-3",
        name: "Dread Matrix",
        description:
          "Mainframe protocols are mobilizing massive multi-layered shielding titans toward the wall.",
        rewards: { scrap: 18500, alloy: 88, core: 1 },
        waves: [
          {
            allowedTypes: ["ARMORED_MINION", "OVERSHIELD_TITAN"],
            spawnInterval: 3500,
          },
        ],
      },
      {
        id: "3-4",
        name: "Hangar Flush",
        description:
          "Clear out the hangar bays before reinforcements launch. Use high burst damage models.",
        rewards: { scrap: 21000, alloy: 100 },
        waves: [
          { allowedTypes: ["APEX_STALKER", "OVERLORD"], spawnInterval: 1800 },
        ],
      },
      {
        id: "3-5",
        name: "GATEKEEPER: ELITE PHALANX",
        description:
          "MID-CHAPTER APEX. Multiple massive shielding titans are locking down the core entrance.",
        rewards: { scrap: 24500, alloy: 115, core: 2 },
        waves: [
          {
            allowedTypes: ["OVERSHIELD_TITAN", "APEX_STALKER"],
            spawnInterval: 3000,
          },
        ],
      },
      {
        id: "3-6",
        name: "Gravity Vault",
        description:
          "Anti-gravity fields are failing. Phantom interceptors are dive-bombing your coordinates.",
        rewards: { scrap: 28500, alloy: 135 },
        waves: [
          {
            allowedTypes: ["MINION", "APEX_STALKER", "REGENERATOR"],
            spawnInterval: 1000,
          },
        ],
      },
      {
        id: "3-7",
        name: "Plasma Conduit",
        description:
          "Hold the line at the main plasma injectors against heavily combined mechanical legions.",
        rewards: { scrap: 33500, alloy: 160, core: 1 },
        waves: [
          {
            allowedTypes: ["OVERLORD", "OVERSHIELD_TITAN"],
            spawnInterval: 3500,
          },
        ],
      },
      {
        id: "3-8",
        name: "Zero-G Chamber",
        description:
          "The main reactor room is breached. Maximum defensive legion fleets are deploying.",
        rewards: { scrap: 39500, alloy: 190 },
        waves: [
          {
            allowedTypes: ["APEX_STALKER", "OVERSHIELD_TITAN", "OVERLORD"],
            spawnInterval: 1200,
          },
        ],
      },
      {
        id: "3-9",
        name: "The Event Horizon",
        description:
          "The final line of defense protecting the planetary core supercomputer processor.",
        rewards: { scrap: 47000, alloy: 230, core: 2 },
        waves: [
          {
            allowedTypes: ["OVERSHIELD_TITAN", "APEX_STALKER", "OVERLORD"],
            spawnInterval: 1000,
          },
        ],
      },
      {
        id: "3-10",
        name: "BOSS: APOCALYPSE",
        description:
          "GRAND TERMINATION CODES ENGAGED. Neutralize the planetary supercomputer mainframe before system destruction.",
        rewards: { scrap: 100000, alloy: 500, core: 5 },
        waves: [{ allowedTypes: ["APOCALYPSE"], spawnInterval: 1 }],
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
