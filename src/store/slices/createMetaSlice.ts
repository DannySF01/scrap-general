import type { StateCreator } from "zustand";
import type { GameState } from "../useGameStore";
import { REGISTRY } from "../../data/registry";

export interface MetaSlice {
  upgrades: Record<string, number>;
  purchaseUpgrade: (id: string) => void;
}

export const createMetaSlice: StateCreator<GameState, [], [], MetaSlice> = (
  set,
  get,
) => ({
  upgrades: {},

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
});
