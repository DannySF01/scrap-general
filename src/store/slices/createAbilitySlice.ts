import type { StateCreator } from "zustand";
import type { AbilityType } from "../../types/game";
import { REGISTRY } from "../../data/registry";
import type { GameState } from "../useGameStore";

export interface AbilitySlice {
  abilityActive: AbilityType[] | [];
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
  abilityActive: [],
  cooldowns: {} as Record<AbilityType, number>,

  triggerAbility: (type) => {
    const { scrap, cooldowns } = get();
    const config = REGISTRY.ABILITIES[type];
    const now = Date.now();

    if (scrap < config.cost || (cooldowns[type] && now < cooldowns[type]))
      return;

    set((state) => ({
      scrap: state.scrap - config.cost,
      cooldowns: { ...state.cooldowns, [type]: config.cooldown },
      abilityActive: [...state.abilityActive, type],
    }));

    const removeAbility = (abilityType: AbilityType) => {
      setTimeout(() => {
        set((state) => ({
          abilityActive: state.abilityActive.filter((a) => a !== abilityType),
        }));
      }, config.duration);
    };

    switch (type) {
      case "EMP":
      case "OVERCLOCK":
      case "NAPALM":
        removeAbility(type);
        break;
      case "REPAIR":
        set((state) => ({
          hp: state.maxHp,
          abilityActive: state.abilityActive.filter((a) => a !== "REPAIR"),
        }));
        break;
      default:
        break;
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
