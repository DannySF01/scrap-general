import type { StateCreator } from "zustand";
import type { AbilityType } from "../../types/game";
import { REGISTRY } from "../../data/registry";
import type { GameState } from "../useGameStore";

export interface AbilitySlice {
  abilityActive: AbilityType | null;
  cooldowns: Record<AbilityType, number>;

  triggerAbility: (type: AbilityType) => void;
  tickCooldowns: (dt: number) => void;
}

export const createAbilitySlice: StateCreator<
  GameState,
  [],
  [],
  AbilitySlice
> = (set, get) => ({
  abilityActive: null,
  cooldowns: {} as Record<AbilityType, number>,

  triggerAbility: (type) => {
    const { scrap, cooldowns } = get();
    const config = REGISTRY.ABILITIES[type];
    const now = Date.now();

    if (scrap < config.cost || (cooldowns[type] && now < cooldowns[type]))
      return;

    set({
      scrap: scrap - config.cost,
      cooldowns: { ...cooldowns, [type]: config.cooldown },
      abilityActive: type,
    });

    if (type === "EMP") {
      setTimeout(() => {
        set({
          abilityActive: null,
        });
      }, config.duration);
    }
  },

  tickCooldowns: (dt) => {
    const { cooldowns, status } = get();
    if (status !== "PLAYING") return;

    const nextCooldowns = { ...cooldowns };
    let hasChanged = false;

    for (const key in nextCooldowns) {
      const type = key as AbilityType;
      if (nextCooldowns[type] > 0) {
        nextCooldowns[type] = Math.max(0, nextCooldowns[type] - dt);
        hasChanged = true;
      }
    }

    if (hasChanged) set({ cooldowns: nextCooldowns });
  },
});
