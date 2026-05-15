import type { StateCreator } from "zustand";
import type { GameState } from "../useGameStore";
import { REGISTRY } from "../../data/registry";
import type { Blueprint } from "../../types/game";

export interface MetaSlice {
  upgrades: Record<string, number>;
  unlocks: Record<string, boolean>;
  purchaseUpgrade: (id: string, blueprintCosts: Blueprint["cost"]) => void;
  purchaseUnlock: (id: string) => void;
}

export const createMetaSlice: StateCreator<GameState, [], [], MetaSlice> = (
  set,
  get,
) => ({
  upgrades: {},
  unlocks: {},

  purchaseUpgrade: (id, blueprintCosts) => {
    const { scrap, upgrades } = get();

    const config = REGISTRY.UPGRADES[id] || REGISTRY.BLUEPRINTS[id];
    const currentLevel = upgrades[id] || 0;

    if (!config || currentLevel >= config.maxLevel) return;

    // DYNAMIC COST SCALING
    const baseCost = config.cost.scrap || blueprintCosts?.scrap || 0;
    const finalCost = baseCost * (currentLevel + 1);

    if (scrap < finalCost) return;

    const newUpgrades = { ...upgrades, [id]: currentLevel + 1 };

    set({
      scrap: scrap - finalCost,
      upgrades: newUpgrades,
    });
  },

  purchaseUnlock: (id) => {
    const { scrap, unlocks } = get();
    if (unlocks[id]) return;

    const blueprint_cost = REGISTRY.BLUEPRINTS[id].cost;
    const cost_scrap = blueprint_cost.scrap || 0;

    if (scrap >= cost_scrap) {
      set((state) => ({
        scrap: state.scrap - cost_scrap,
        unlocks: { ...state.unlocks, [id]: true },
      }));
    }
  },
});
