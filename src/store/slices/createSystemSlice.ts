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

  setView: (view: MenuView) => void;
  startGame: () => void;
  togglePause: () => void;
  quitGame: () => void;
  resetGame: () => void;
  addScrap: (amount: number) => void;
  takeDamage: (amount: number) => void;
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

  setView: (view) => set({ currentView: view }),

  startGame: () => set({ status: "PLAYING" }),

  togglePause: () => {
    const { status } = get();
    if (status === "PLAYING") set({ status: "PAUSED" });
    else if (status === "PAUSED") set({ status: "PLAYING" });
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
      baseHp: 100,
      turrets: [],
      enemies: [],
      scrap: 0,
      alloy: 0,
      core: 0,
      luck: 0,
      hp: 100,
      maxHp: 100,
    }),

  addScrap: (amount) =>
    set((state) => ({
      scrap: state.scrap + amount,
    })),

  takeDamage: (amount) =>
    set((state) => {
      const newHp = Math.max(0, state.hp - amount);
      return {
        hp: newHp,
        status: newHp <= 0 ? "GAME_OVER" : state.status,
      };
    }),

  syncStats: () => {
    const { upgrades, baseHp } = get();

    const calculatedMax = resolveStat("maxHp", baseHp, upgrades);

    set({
      maxHp: calculatedMax,
      hp: calculatedMax,
    });
  },
});
