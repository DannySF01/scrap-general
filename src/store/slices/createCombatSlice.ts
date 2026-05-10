import type { StateCreator } from "zustand";
import type { Base, Robot } from "../../types/game";
import type { GameState } from "../useGameStore";
import { REGISTRY } from "../../data/registry";
import { resolveStat } from "../../utils/stats";

export interface CombatSlice {
  robots: Robot[];
  selectedRobotType: Robot["type"];
  selectRobot: (type: Robot["type"]) => void;
  deployToBase: (baseId: number, type: Robot["type"]) => void;
  processCombat: () => void;
  vfxEvents: {
    id: number;
    type: string;
    pos: { x: number; y: number };
    radius?: number;
  }[];
  removeVfx: (id: number) => void;
}

export const createCombatSlice: StateCreator<GameState, [], [], CombatSlice> = (
  set,
  get,
) => ({
  robots: [],
  selectedRobotType: "SENTRY",
  vfxEvents: [],
  removeVfx: (id: number) =>
    set({ vfxEvents: get().vfxEvents.filter((e) => e.id !== id) }),

  selectRobot: (type: Robot["type"]) => set({ selectedRobotType: type }),

  deployToBase: (baseId: number, type: Robot["type"]) => {
    const { bases, robots } = get();
    const targetBase = bases.find((b: Base) => b.id === baseId);

    if (!targetBase || !targetBase.isUnlocked) return;

    let updatedRobots = [...robots];
    if (targetBase.occupantId) {
      updatedRobots = updatedRobots.filter(
        (r) => r.id !== targetBase.occupantId,
      );
    }

    const template = REGISTRY.ROBOTS[type];

    const newRobot: Robot = {
      ...template,
      id: crypto.randomUUID(),
      level: 1,
      position: { x: targetBase.x, y: targetBase.y },
      type,
      lastShot: Date.now(),
      lastTargetPos: null,
    };

    set({
      robots: [...updatedRobots, newRobot],
      bases: bases.map((b) =>
        b.id === baseId ? { ...b, occupantId: newRobot.id } : b,
      ),
    });
  },

  processCombat: () => {
    const { robots, enemies, upgrades, abilityActive } = get();
    const now = Date.now();

    let currentEnemies = [...enemies];
    let totalScrapGained = 0;
    let newVfx: CombatSlice["vfxEvents"] = [];

    const updatedRobots = robots.map((robot) => {
      let fireRate = resolveStat("fireRate", robot.fireRate, upgrades);

      if (abilityActive.find((a) => a === "OVERCLOCK")) fireRate /= 2;
      else fireRate *= 2;

      // Cooldown check
      if (robot.lastShot && now - robot.lastShot < fireRate) return robot;

      // 3. Find Target (Highest Y first)
      const target = [...currentEnemies]
        .sort((a, b) => b.position.y - a.position.y)
        .find((e) => e.hp > 0 && e.position.y > 0);

      if (!target) return robot;

      // 4. Calculate Damage
      const baseDamage = resolveStat("damage", robot.damage, upgrades);
      const sentryBonus =
        robot.type === "SENTRY" ? resolveStat("sentryDamage", 0, upgrades) : 0;
      const critChance = resolveStat("critChance", 0, upgrades);
      const isCrit = Math.random() < critChance;
      const damageToApply = isCrit
        ? (baseDamage + sentryBonus) * 2
        : baseDamage + sentryBonus;

      // 5. Handle Block Chance
      if (target.type === "SHIELDER" && Math.random() < 0.2) {
        newVfx.push({
          id: Math.random(),
          type: "BLOCKED",
          pos: target.position,
        });
        return {
          ...robot,
          lastShot: now,
          lastTargetPos: { ...target.position },
        };
      }

      // 6. Apply Damage (Splash / Single)
      if (robot.splashRadius) {
        newVfx.push({
          id: Math.random(),
          type: "EXPLOSION",
          pos: target.position,
          radius: robot.splashRadius,
        });
        currentEnemies = currentEnemies.map((e) => {
          const dx = e.position.x - target.position.x;
          const dy = e.position.y - target.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const radius = robot.splashRadius ?? 0;
          return dist <= radius ? { ...e, hp: e.hp - damageToApply } : e;
        });
      } else {
        currentEnemies = currentEnemies.map((e) =>
          e.id === target.id ? { ...e, hp: e.hp - damageToApply } : e,
        );
      }

      if (isCrit)
        newVfx.push({ id: Math.random(), type: "CRIT", pos: target.position });

      return { ...robot, lastShot: now, lastTargetPos: { ...target.position } };
    });

    const survivingEnemies = currentEnemies.filter((e) => {
      if (e.hp <= 0) {
        totalScrapGained += e.reward;
        return false;
      }
      return true;
    });

    set((state) => ({
      robots: updatedRobots,
      enemies: survivingEnemies,
      scrap: state.scrap + totalScrapGained,
      vfxEvents: [...state.vfxEvents, ...newVfx],
    }));
  },
});
