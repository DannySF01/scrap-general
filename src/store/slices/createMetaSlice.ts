import type { StateCreator } from "zustand";
import type { GameState } from "../useGameStore";
import { REGISTRY } from "../../data/registry";

export interface MetaSlice {
  upgrades: Record<string, number>;
  unlocks: Record<string, boolean>;
  purchaseUpgrade: (id: string) => void;
  purchaseUnlock: (
    id: string,
    costs: { scrap?: number; matrices?: number },
  ) => void;
}

export const createMetaSlice: StateCreator<GameState, [], [], MetaSlice> = (
  set,
  get,
) => ({
  upgrades: {},
  unlocks: {},

  purchaseUpgrade: (id) => {
    const { scrap, upgrades } = get();
    const upgrade = REGISTRY.UPGRADES[id];
    const currentLevel = upgrades[id] || 0;

    if (!upgrade || scrap < upgrade.cost || currentLevel >= upgrade.maxLevel)
      return;

    set((state) => ({
      scrap: state.scrap - upgrade.cost,
      upgrades: { ...state.upgrades, [id]: currentLevel + 1 },
    }));

    if (id === "REINFORCED_CORE") {
      set({
        baseHp: get().baseHp + 25,
      });
    }

    if (id === "SALVAGE_OPTIMIZER") {
      set({ luck: (get().luck || 0) + 2 });
    }
  },

  purchaseUnlock: (id) => set((state) => ({})),
});
