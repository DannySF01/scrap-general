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
    const { robots, enemies, scrap, upgrades, abilityActive } = get();
    const now = Date.now();

    const sortedEnemies = [...enemies].sort(
      (a, b) => b.position.y - a.position.y,
    );

    const updatedRobots = robots.map((robot) => {
      let currentFireRate = resolveStat("fireRate", robot.fireRate, upgrades);

      if (abilityActive.find((a) => a === "OVERCLOCK")) currentFireRate /= 2;
      else currentFireRate *= 2;

      const baseDamage = resolveStat("damage", robot.damage, upgrades);
      const sentryBonus =
        robot.type === "SENTRY" ? resolveStat("sentryDamage", 0, upgrades) : 0;
      const finalDamage = baseDamage + sentryBonus;

      if (
        robot.lastTargetPos &&
        robot.lastShot &&
        now - robot.lastShot > robot.fireRate
      ) {
        return { ...robot, lastTargetPos: null };
      }

      // on cooldown
      if (robot.lastShot && now - robot.lastShot < currentFireRate)
        return robot;

      const target = sortedEnemies.find(
        (enemy) => enemy.hp > 0 && enemy.position.y > 0,
      );

      if (target) {
        const critChance = resolveStat("critChance", 0, upgrades);
        const isCrit = Math.random() < critChance;
        const damageToApply = isCrit ? finalDamage * 2 : finalDamage;

        // SHIELDER ENEMY BLOCK
        const wasBlocked = Math.random() < 0.2; // 20% chance of being blocked
        if (target.type === "SHIELDER" && wasBlocked) {
          set((state) => ({
            vfxEvents: [
              ...state.vfxEvents,
              {
                id: Math.random(),
                type: "BLOCKED",
                pos: target.position,
              },
            ],
          }));
          return {
            ...robot,
            lastShot: now,
            lastTargetPos: { ...target.position },
          };
        }

        target.hp -= damageToApply;

        if (isCrit) {
          set((state) => ({
            vfxEvents: [
              ...state.vfxEvents,
              {
                id: Math.random(),
                type: "CRIT",
                pos: target.position,
              },
            ],
          }));
        }
        return {
          ...robot,
          lastShot: now,
          lastTargetPos: { ...target.position },
        };
      }

      return robot;
    });

    const deadEnemies = enemies.filter((e) => e.hp <= 0);
    const scrapGained = deadEnemies.reduce((acc, e) => acc + e.reward, 0);

    const survivingEnemies = enemies.filter((e) => e.hp > 0);

    set({
      robots: updatedRobots,
      enemies: survivingEnemies,
      scrap: scrap + scrapGained,
    });
  },
});
