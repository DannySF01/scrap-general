import { create } from "zustand";
import type { Enemy, Robot, Base } from "../types/game";
import { REGISTRY } from "../data/registry";

interface GameState {
  scrap: number;
  luck: number;
  wave: number;
  baseHp: number;

  bases: Base[];
  robots: Robot[];
  enemies: Enemy[];

  lastSpawnTime: number;

  addScrap: (amount: number) => void;

  deployToBase: (baseId: number, robot: Robot["type"]) => void;

  spawnEnemies: () => void;
  tickEnemies: () => void;

  tick(): void;
  processCombat: () => void;

  takeDamage: (amount: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  scrap: 0,
  luck: 0,
  wave: 0,
  baseHp: 100,
  bases: [
    {
      id: 1,
      name: "VANGUARD-01",
      x: 20,
      y: 90,
      isUnlocked: true,
      occupantId: null,
    },
    {
      id: 2,
      name: "ALPHA-02",
      x: 35,
      y: 90,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 3,
      name: "CENTER-03",
      x: 50,
      y: 90,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 4,
      name: "BRAVO-04",
      x: 65,
      y: 90,
      isUnlocked: false,
      occupantId: null,
    },
    {
      id: 5,
      name: "REAR-05",
      x: 80,
      y: 90,
      isUnlocked: false,
      occupantId: null,
    },
  ],
  robots: [],
  enemies: [],
  lastSpawnTime: Date.now(),

  addScrap: (amount) => set((state) => ({ scrap: state.scrap + amount })),

  takeDamage: (damage: Robot["damage"]) => {
    const { baseHp } = get();

    set(() => ({ baseHp: baseHp - damage }));
  },

  tick: () => {
    const { tickEnemies, processCombat, spawnEnemies, lastSpawnTime } = get();
    const now = Date.now();

    if (now - lastSpawnTime > 3000) {
      spawnEnemies();
      set({ lastSpawnTime: now });
    }

    tickEnemies();
    processCombat();
  },

  processCombat: () => {
    const { robots, enemies, scrap } = get();
    const now = Date.now();

    const sortedEnemies = [...enemies].sort(
      (a, b) => b.position.y - a.position.y,
    );

    const updatedRobots = robots.map((robot) => {
      if (
        robot.lastTargetPos &&
        robot.lastShot &&
        now - robot.lastShot > robot.fireRate
      ) {
        return { ...robot, lastTargetPos: null };
      }

      if (robot.lastShot && now - robot.lastShot < robot.fireRate) return robot;

      const target = sortedEnemies.find(
        (enemy) => enemy.hp > 0 && enemy.position.y > 0,
      );

      if (target) {
        target.hp -= robot.damage;
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

  deployToBase: (baseId, type: Robot["type"]) => {
    const { bases, robots } = get();
    const targetBase = bases.find((b: Base) => b.id === baseId);

    if (!targetBase || !targetBase.isUnlocked || targetBase.occupantId) return;

    const template = REGISTRY.ROBOTS[type];

    const newRobot: Robot = {
      ...template,
      id: crypto.randomUUID(),
      level: 1,
      position: { x: targetBase.x, y: targetBase.y },
      type,
      lastShot: 0,
      lastTargetPos: null,
    };

    set({
      robots: [...robots, newRobot],
      bases: bases.map((b) =>
        b.id === baseId ? { ...b, occupantId: newRobot.id } : b,
      ),
    });
  },

  spawnEnemies: () => {
    const { enemies } = get();

    const enemyEntries = Object.entries(REGISTRY.ENEMIES);
    const totalWeight = enemyEntries.reduce(
      (acc, [_, config]) => acc + config.spawnChance,
      0,
    );
    let random = Math.random() * totalWeight;
    let selectedType: Enemy["type"] = "MINION";

    for (const [type, config] of enemyEntries) {
      if (random < config.spawnChance) {
        selectedType = type as Enemy["type"];
        break;
      }
      random -= config.spawnChance;
    }

    const stats = REGISTRY.ENEMIES[selectedType];

    const newEnemy: Enemy = {
      ...stats,
      id: crypto.randomUUID(),
      position: { x: Math.random() * 80 + 10, y: -5 },
    };

    set({ enemies: [...enemies, newEnemy] });
  },

  tickEnemies: () => {
    const { enemies, takeDamage } = get();

    set(() => ({
      enemies: enemies
        .map((e) => ({
          ...e,
          position: { ...e.position, y: e.position.y + e.speed },
        }))
        .filter((e) => {
          if (e.position.y >= 85) {
            takeDamage(e.damage);
            return false;
          }
          return true;
        }),
    }));
  },
}));
