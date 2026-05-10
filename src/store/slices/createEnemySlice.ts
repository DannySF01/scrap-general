import type { StateCreator } from "zustand";
import type { Enemy } from "../../types/game";
import { REGISTRY } from "../../data/registry";
import type { GameState } from "../useGameStore";

export interface EnemySlice {
  enemies: Enemy[];
  lastSpawnTime: number;

  spawnEnemies: () => void;
  tickEnemies: () => void;
}

export const createEnemySlice: StateCreator<GameState, [], [], EnemySlice> = (
  set,
  get,
) => ({
  enemies: [],
  lastSpawnTime: Date.now(),

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
    const { takeDamage, abilityActive } = get();

    if (abilityActive.find((a) => a === "EMP")) return;
    const isNapalmActive = abilityActive.find((a) => a === "NAPALM");

    const now = Date.now();
    let spawnedFromOverlord: Enemy[] = [];

    set((state) => {
      const updatedEnemies = state.enemies.map((e) => {
        let nextHp = e.hp;

        if (e.type === "OVERLORD") {
          if (!e.lastSpawn) e.lastSpawn = now;

          if (now - e.lastSpawn > 5000) {
            e.lastSpawn = now;
            const minionTemplate = REGISTRY.ENEMIES.MINION;
            spawnedFromOverlord = Array.from({ length: 5 }).map((_, i) => ({
              ...minionTemplate,
              id: `enemy-${now}-${i}`,
              position: {
                x: e.position.x - 10 + i * 5,
                y: e.position.y,
              },
            }));
          }
        }

        if (isNapalmActive) nextHp -= 1;

        if (e.type === "REGENERATOR" && nextHp > 0 && nextHp < e.maxHp) {
          nextHp = Math.min(e.maxHp, nextHp + e.maxHp * 0.01);
        }

        return {
          ...e,
          hp: nextHp,
          position: { ...e.position, y: e.position.y + e.speed },
        };
      });

      return {
        enemies: [...updatedEnemies, ...spawnedFromOverlord].filter((e) => {
          if (e.hp <= 0) return false;
          if (e.position.y >= 83) {
            takeDamage(e.damage);
            return false;
          }
          return true;
        }),
      };
    });
  },
});
