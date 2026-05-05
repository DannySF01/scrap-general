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

export type GameState = SystemSlice &
  CombatSlice &
  AbilitySlice &
  EnemySlice & {
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

      bases: [
        {
          id: 1,
          name: "VANGUARD-01",
          x: 20,
          y: 93,
          isUnlocked: true,
          occupantId: null,
        },
        {
          id: 2,
          name: "ALPHA-02",
          x: 35,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 3,
          name: "CENTER-03",
          x: 50,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 4,
          name: "BRAVO-04",
          x: 65,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 5,
          name: "REAR-05",
          x: 80,
          y: 93,
          isUnlocked: false,
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

        if (status !== "PLAYING") return;

        if (baseHp <= 0) {
          set({ status: "GAME_OVER" });
          return;
        }

        if (now - lastSpawnTime > 3000) {
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
      partialize: (state) => ({ scrap: state.scrap }),
    },
  ),
);
