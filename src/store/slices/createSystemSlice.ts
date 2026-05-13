import type { StateCreator } from "zustand";
import type { GameState } from "../useGameStore";
import type { GameStatus } from "../../types/game";
import { resolveStat } from "../../utils/stats";

export type MenuView = "MAIN" | "TECH_TREE" | "MECH_BAY" | "INTEL";

export interface SystemSlice {
  status: GameStatus;
  scrap: number;
  luck: number;
  wave: number;
  hp: number;
  baseHp: number;
  maxHp: number;
  currentView: MenuView;

  setView: (view: MenuView) => void;
  startGame: () => void;
  togglePause: () => void;
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
  scrap: 0,
  luck: 0,
  wave: 1,
  hp: 100,
  baseHp: 100,
  maxHp: 100,
  currentView: "MAIN",

  setView: (view) => set({ currentView: view }),

  startGame: () => set({ status: "PLAYING" }),

  togglePause: () => {
    const { status } = get();
    if (status === "PLAYING") set({ status: "PAUSED" });
    else if (status === "PAUSED") set({ status: "PLAYING" });
  },

  resetGame: () =>
    set({
      status: "IDLE",
      wave: 0,
      baseHp: 100,
      robots: [],
      enemies: [],
      bases: get().bases.map((b) => ({ ...b, occupantId: null })),
      lastSpawnTime: Date.now(),
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
