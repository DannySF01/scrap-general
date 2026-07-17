import type { StateCreator } from "zustand";
import type { Enemy } from "../../types/game";
import { REGISTRY } from "../../data/registry";
import type { GameState } from "../useGameStore";
import { LEVELS_MANIFEST } from "../../data/levels";
import { resolveStat } from "../../utils/stats";

export interface EnemySlice {
  enemies: Enemy[];
  lastSpawnTime: number;
  waveTimeLeft: number;

  spawnEnemies: () => void;
  tickEnemies: (dt: number) => void;
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
        x: isBossType(selectedType) ? 50 : Math.random() * 80 + 10,
        y: -5,
      },
    };

    set({ enemies: [...enemies, newEnemy] });
  },

  tickEnemies: (dt: number) => {
    const {
      currentLevelId,
      wave,
      enemies,
      waveTimeLeft,
      abilityActive,
      markLevelCompleted,
      upgrades,
      lastRegenTime,
    } = get();

    const levelData = LEVELS_MANIFEST[currentLevelId];
    if (!levelData) return;

    if (abilityActive.find((a) => a === "EMP")) return;
    const isNapalmActive = abilityActive.find((a) => a === "NAPALM");

    const now = Date.now();
    let spawnedFromOverlord: Enemy[] = [];

    const timeStepMultiplier = dt / 16.666;

    // NANO REPAIR BOTS (TECH)
    let healingPayout = 0;
    let wallDamagePayout = 0;

    if (now - lastRegenTime >= 5000) {
      healingPayout = resolveStat("regenFlat", 0, upgrades);
      set({ lastRegenTime: now });
    }

    set((state) => {
      const activeRegenerators = state.enemies.filter(
        (e) => e.type === "REGENERATOR" && e.hp > 0,
      );
      // Raio de alcance da cura em área (50% da grelha de distância)
      const healRadius = 50;
      // Quantidade de cura convertida para frames (3 HP por segundo / 60)
      const flatHealPerFrame = (3 / 60) * timeStepMultiplier;

      const updatedEnemies = state.enemies.map((e) => {
        let nextHp = e.hp;
        let currentY = e.position.y;

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
                y: currentY,
              },
            }));
          }
        }

        // Napalm damage enemies each tick
        if (isNapalmActive) nextHp -= 1 * timeStepMultiplier;

        // Regenerators heal alies near them
        if (nextHp < e.maxHp) {
          const isNearHealer = activeRegenerators.some((healer) => {
            const rdx = e.position.x - healer.position.x;
            const rdy = e.position.y - healer.position.y;
            const distance = Math.sqrt(rdx * rdx + rdy * rdy);

            return distance <= healRadius;
          });
          if (isNearHealer) {
            nextHp = Math.min(e.maxHp, nextHp + flatHealPerFrame);
          }
        }

        // Check if enemy is stunned for 5 seconds
        const isStunned = e.stunnedAt && now < e.stunnedAt;

        // Moves enemies until they hit the base
        if (!isStunned && currentY < 64) {
          currentY = Math.min(64, currentY + e.speed * timeStepMultiplier);
        }

        return {
          ...e,
          hp: nextHp,
          position: { ...e.position, y: currentY },
          stunnedAt: isStunned ? e.stunnedAt : undefined,
        };
      });

      const filteredEnemies = [
        ...updatedEnemies,
        ...spawnedFromOverlord,
      ].filter((e) => {
        const isStunned = e.stunnedAt && now < e.stunnedAt;
        if (e.position.y >= 64 && !isStunned) {
          wallDamagePayout += e.damage * 0.01 * timeStepMultiplier;
        }
        return true;
      });

      let rawHpCalculated = state.hp + healingPayout - wallDamagePayout;

      // Emergency repair (Gain +50hp if below 25% of max hp)
      let usedEmergencyRepair = state.isEmergencyRepairSpent;
      const hasEmergencyRepair = upgrades["EMERGENCY_REPAIR"];

      if (hasEmergencyRepair && !state.isEmergencyRepairSpent) {
        const criticalThreshold = state.maxHp * 0.25;
        if (rawHpCalculated < criticalThreshold) {
          usedEmergencyRepair = true;
          rawHpCalculated += 50;
        }
      }

      // Final hp calculation
      const finalHp = Math.max(0, Math.min(state.maxHp, rawHpCalculated));

      if (finalHp <= 0)
        return {
          status: "GAME_OVER",
        };

      return {
        enemies: filteredEnemies,
        hp: finalHp,
        isEmergencyRepairSpent: usedEmergencyRepair,
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
          isEmergencyRepairSpent: false,
          hp: state.maxHp,

          // TODO : add mission rewards
        }));
      }
    }
  },
});
