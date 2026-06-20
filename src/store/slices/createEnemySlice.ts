import type { StateCreator } from "zustand";
import type { Enemy } from "../../types/game";
import { REGISTRY } from "../../data/registry";
import type { GameState } from "../useGameStore";
import { LEVELS_MANIFEST } from "../../data/levels";

export interface EnemySlice {
  enemies: Enemy[];
  lastSpawnTime: number;
  waveTimeLeft: number;

  spawnEnemies: () => void;
  tickEnemies: () => void;
  selectLevel: (id: string) => void;
}

export const createEnemySlice: StateCreator<GameState, [], [], EnemySlice> = (
  set,
  get,
) => ({
  enemies: [],
  lastSpawnTime: Date.now(),
  waveTimeLeft: 30000,

  selectLevel: (id) =>
    set({
      currentLevelId: id,
      wave: 0,
      waveTimeLeft: 30000,
    }),

  spawnEnemies: () => {
    const { enemies, currentLevelId, wave } = get();

    const isBossType = (type: string) =>
      type.includes("CRUSHER_PRIME") ||
      type.includes("NEXUS_GHOST") ||
      type.includes("APOCALYPSE");

    // LEVEL DATA
    const levelData = LEVELS_MANIFEST[currentLevelId];
    if (!levelData) return;

    const currentWaveConfig = levelData.waves[wave];
    if (!currentWaveConfig) return;

    const pool = currentWaveConfig.allowedTypes.filter((type) => {
      if (isBossType(type)) {
        set({ waveTimeLeft: 0 });
        const bossAlreadyOnField = enemies.some((e) => e.type === type);
        return !bossAlreadyOnField;
      }

      return true;
    });
    if (pool.length === 0) return;

    // SPAWN ENEMIES
    const totalWeight = pool.reduce((acc, type) => {
      const config = REGISTRY.ENEMIES[type];
      return acc + config.spawnChance;
    }, 0);

    if (totalWeight <= 0) return;

    let randomRoll = Math.random() * totalWeight;
    let selectedType: Enemy["type"] = pool[0];

    for (const type of pool) {
      const config = REGISTRY.ENEMIES[type];

      if (randomRoll < config.spawnChance) {
        selectedType = type;
        break;
      }
      randomRoll -= config.spawnChance;
    }

    // ENEMY STATS
    const stats = REGISTRY.ENEMIES[selectedType];

    // ADD ENEMY
    const newEnemy: Enemy = {
      ...stats,
      id: crypto.randomUUID(),
      position: {
        x: isBossType(selectedType) ? 50 : Math.random() * 80,
        y: -5,
      },
    };

    set({ enemies: [...enemies, newEnemy] });
  },

  tickEnemies: () => {
    const {
      takeDamage,
      currentLevelId,
      wave,
      enemies,
      waveTimeLeft,
      abilityActive,
      markLevelCompleted,
    } = get();

    const levelData = LEVELS_MANIFEST[currentLevelId];
    if (!levelData) return;

    if (abilityActive.find((a) => a === "EMP")) return;
    const isNapalmActive = abilityActive.find((a) => a === "NAPALM");

    const now = Date.now();

    let spawnedFromOverlord: Enemy[] = [];

    set((state) => {
      const updatedEnemies = state.enemies.map((e) => {
        let nextHp = e.hp;

        if (e.type === "OVERLORD") {
          if (!e.lastSpawn) e.lastSpawn = now;

          if (now - e.lastSpawn > 10000) {
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

    const liveEnemies = enemies.filter((e) => e.hp > 0).length;
    const isWaveOver = waveTimeLeft === 0 && liveEnemies === 0;
    const hasMoreWaves = wave < levelData.waves.length - 1;

    if (isWaveOver) {
      if (hasMoreWaves) {
        set({
          wave: wave + 1,
          waveTimeLeft: 30000,
          lastSpawnTime: now,
          enemies: [],
        });
      } else {
        const [chapter, level] = currentLevelId.split("-");
        const nextLevelId = `${chapter}-${Number(level) + 1}`;

        const goToNextChapter =
          !!LEVELS_MANIFEST[`${Number(chapter) + 1}-1`] &&
          !LEVELS_MANIFEST[nextLevelId];

        const hasMoreLevels = !!LEVELS_MANIFEST[nextLevelId] || goToNextChapter;

        markLevelCompleted(currentLevelId);

        set((state) => ({
          scrap: state.scrap + (levelData.rewards.scrap || 0),
          alloy: (state.alloy || 0) + (levelData.rewards.alloy || 0),
          core: (state.core || 0) + (levelData.rewards.core || 0),

          currentView: !hasMoreLevels ? "MAIN" : undefined,
          currentLevelId: hasMoreLevels
            ? goToNextChapter
              ? `${Number(chapter) + 1}-1`
              : nextLevelId
            : state.currentLevelId,
          wave: 0,
          waveTimeLeft: 30000,

          // TODO : add mission rewards
        }));
      }
    }
  },
});
