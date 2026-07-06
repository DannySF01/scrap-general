import type { StateCreator } from "zustand";
import type { GameState } from "../useGameStore";
import type { GameStatus } from "../../types/game";
import { resolveStat } from "../../utils/stats";

export type MenuView = "MAIN" | "MISSION_SELECT" | "TECH_TREE" | "MECH_BAY";

export interface SystemSlice {
  status: GameStatus;
  scrap: number;
  alloy: number;
  core: number;
  luck: number;
  wave: number;
  hp: number;
  baseHp: number;
  maxHp: number;
  currentView: MenuView;
  currentLevelId: string;
  lastRegenTime: number;
  isEmergencyRepairSpent: boolean;

  setView: (view: MenuView) => void;
  startGame: () => void;
  togglePause: () => void;
  restartGame: () => void;
  resetGame: () => void;
  quitGame: () => void;
  addScrap: (amount: number) => void;
  syncStats: () => void;
}

export const createSystemSlice: StateCreator<GameState, [], [], SystemSlice> = (
  set,
  get,
) => ({
  status: "IDLE",
  currentView: "MAIN",
  scrap: 0,
  alloy: 0,
  core: 0,
  luck: 0,
  wave: 0,
  hp: 100,
  baseHp: 100,
  maxHp: 100,
  currentLevelId: "1-1",
  lastRegenTime: Date.now(),
  isEmergencyRepairSpent: false,

  setView: (view) => set({ currentView: view }),

  startGame: () => {
    set({ status: "PLAYING" });
    get().syncStats();
  },

  togglePause: () => {
    const { status } = get();
    if (status === "PLAYING") set({ status: "PAUSED" });
    else if (status === "PAUSED") set({ status: "PLAYING" });
  },

  restartGame: () => {
    set({
      status: "PLAYING",
      wave: 0,
      waveTimeLeft: 30000,
      turrets: [],
      enemies: [],
    });
    get().syncStats();
  },

  quitGame: () =>
    set({
      status: "IDLE",
      currentView: "MAIN",
      turrets: [],
      enemies: [],
      wave: 0,
      waveTimeLeft: 30000,
    }),

  resetGame: () =>
    set({
      currentLevelId: "1-1",
      completedLevels: [],
      wave: 0,
      turrets: [],
      enemies: [],
      scrap: 0,
      alloy: 0,
      core: 0,
      luck: 0,
      hp: 100,
      baseHp: 100,
      maxHp: 100,
    }),

  addScrap: (amount) =>
    set((state) => ({
      scrap: state.scrap + amount,
    })),

  syncStats: () => {
    const { upgrades, baseHp } = get();

    const calculatedMax = resolveStat("maxHp", baseHp, upgrades);

    set({
      maxHp: calculatedMax,
      hp: calculatedMax,
    });
  },
});
