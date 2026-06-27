import { create } from "zustand";
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
import { LEVELS_MANIFEST } from "../data/levels";

export type GameState = SystemSlice &
  CombatSlice &
  AbilitySlice &
  EnemySlice &
  MetaSlice & {
    tick: (dt: number) => void;
  };

export const useGameStore = create<GameState>()(
  persist(
    (set, get, api) => ({
      ...createSystemSlice(set, get, api),
      ...createCombatSlice(set, get, api),
      ...createAbilitySlice(set, get, api),
      ...createEnemySlice(set, get, api),
      ...createMetaSlice(set, get, api),

      tick: (dt: number) => {
        const {
          status,
          baseHp,
          tickEnemies,
          processCombat,
          tickCooldowns,
          currentLevelId,
          spawnEnemies,
          wave,
          waveTimeLeft,
          lastSpawnTime,
        } = get();

        const now = Date.now();

        // GAMEPLAY SYSTEM CHECK
        if (status !== "PLAYING") return;

        if (baseHp <= 0) {
          set({ status: "GAME_OVER" });
          return;
        }

        // SPAWN ENEMIES TIMELINE

        const SPAWN_INTERVAL = 1500;
        const levelData = LEVELS_MANIFEST[currentLevelId];
        const currentWaveConfig = levelData?.waves[wave];
        const spawnIntervalMs =
          currentWaveConfig?.spawnInterval || SPAWN_INTERVAL;

        const nextTimeLeft = Math.max(0, waveTimeLeft - dt);
        set({ waveTimeLeft: nextTimeLeft });

        if (nextTimeLeft > 0) {
          if (now - lastSpawnTime > spawnIntervalMs) {
            spawnEnemies();
            set({ lastSpawnTime: now });
          }
        }

        // TICK SYSTEM UPDATES
        tickCooldowns(dt);
        tickEnemies(dt);
        processCombat(dt);
      },
    }),
    {
      name: "scrap-general-save",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scrap: state.scrap,
        alloy: state.alloy,
        core: state.core,
        upgrades: state.upgrades,
        unlocks: state.unlocks,
        currentlevelId: state.currentLevelId,
        completedLevels: state.completedLevels,
      }),
    },
  ),
);
