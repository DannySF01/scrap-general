import { create } from "zustand";
import type { Base } from "../types/game";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  createCombatSlice,
  type CombatSlice,
} from "./slices/createCombatSlice";
import {
  createSystemSlice,
  type SystemSlice,
} from "./slices/createSystemSlice";
import {
  createAbilitySlice,
  type AbilitySlice,
} from "./slices/createAbilitySlice";
import { createEnemySlice, type EnemySlice } from "./slices/createEnemySlice";
import { createMetaSlice, type MetaSlice } from "./slices/createMetaSlice";

export type GameState = SystemSlice &
  CombatSlice &
  AbilitySlice &
  EnemySlice &
  MetaSlice & {
    bases: Base[];
    tick: () => void;
  };

export const useGameStore = create<GameState>()(
  persist(
    (set, get, api) => ({
      ...createSystemSlice(set, get, api),
      ...createCombatSlice(set, get, api),
      ...createAbilitySlice(set, get, api),
      ...createEnemySlice(set, get, api),
      ...createMetaSlice(set, get, api),

      bases: [
        {
          id: 1,
          name: "VANGUARD_01",
          x: 10,
          y: 93,
          occupantId: null,
        },
        {
          id: 2,
          name: "ALPHA_02",
          x: 20,
          y: 93,
          occupantId: null,
        },
        {
          id: 3,
          name: "CENTER_03",
          x: 30,
          y: 93,
          occupantId: null,
        },
        {
          id: 4,
          name: "BRAVO_04",
          x: 70,
          y: 93,
          occupantId: null,
        },
        {
          id: 5,
          name: "REAR_05",
          x: 80,
          y: 93,
          occupantId: null,
        },
        {
          id: 6,
          name: "OMEGA_06",
          x: 90,
          y: 93,
          occupantId: null,
        },
      ],

      tick: () => {
        const {
          status,
          baseHp,
          tickEnemies,
          processCombat,
          tickCooldowns,
          spawnEnemies,
          lastSpawnTime,
        } = get();
        const now = Date.now();
        const SPAWN_INTERVAL = 2000;

        if (status !== "PLAYING") return;

        if (baseHp <= 0) {
          set({ status: "GAME_OVER" });
          return;
        }

        if (now - lastSpawnTime > SPAWN_INTERVAL) {
          spawnEnemies();
          set({ lastSpawnTime: now });
        }

        const dt = 60;
        tickCooldowns(dt);
        tickEnemies();
        processCombat();
      },
    }),
    {
      name: "scrap-general-save",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scrap: state.scrap,
        upgrades: state.upgrades,
        unlocks: state.unlocks,
      }),
    },
  ),
);
