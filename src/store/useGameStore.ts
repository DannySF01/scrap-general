import { create } from "zustand";
import type {
  Enemy,
  Robot,
  Base,
  GameStatus,
  AbilityType,
} from "../types/game";
import { REGISTRY } from "../data/registry";
import { persist, createJSONStorage } from "zustand/middleware";

interface GameState {
  status: GameStatus;

  scrap: number;
  luck: number;
  wave: number;
  baseHp: number;

  bases: Base[];
  robots: Robot[];
  enemies: Enemy[];

  selectedRobotType: Robot["type"];
  selectRobot: (type: Robot["type"]) => void;

  lastSpawnTime: number;

  abilityActive: AbilityType | null;
  cooldowns: Record<AbilityType, number>;
  triggerAbility: (ability: AbilityType) => void;
  tickCooldowns: (dt: number) => void;

  startGame: () => void;
  togglePause: () => void;
  resetGame: () => void;
  addScrap: (amount: number) => void;
  deployToBase: (baseId: number, robot: Robot["type"]) => void;
  spawnEnemies: () => void;
  tickEnemies: () => void;
  tick(): void;
  processCombat: () => void;
  takeDamage: (amount: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      status: "IDLE",

      scrap: 0,
      luck: 0,
      wave: 0,

      baseHp: 100,
      bases: [
        {
          id: 1,
          name: "VANGUARD-01",
          x: 20,
          y: 93,
          isUnlocked: true,
          occupantId: null,
        },
        {
          id: 2,
          name: "ALPHA-02",
          x: 35,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 3,
          name: "CENTER-03",
          x: 50,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 4,
          name: "BRAVO-04",
          x: 65,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
        {
          id: 5,
          name: "REAR-05",
          x: 80,
          y: 93,
          isUnlocked: false,
          occupantId: null,
        },
      ],
      robots: [],
      enemies: [],

      selectedRobotType: "SENTRY",
      selectRobot: (type: Robot["type"]) => set({ selectedRobotType: type }),

      lastSpawnTime: Date.now(),

      abilityActive: null,
      cooldowns: {} as Record<AbilityType, number>,

      startGame: () => set({ status: "PLAYING" }),

      togglePause: () => {
        const { status } = get();

        if (status === "PLAYING") {
          set({ status: "PAUSED" });
        } else if (status === "PAUSED") {
          set({ status: "PLAYING" });
        }
      },

      resetGame: () =>
        set({
          status: "IDLE",
          wave: 0,
          baseHp: 100,
          robots: [],
          enemies: [],
          bases: get().bases.map((b) => ({ ...b, occupantId: null })),
          lastSpawnTime: Date.now(),
        }),

      addScrap: (amount) => set((state) => ({ scrap: state.scrap + amount })),

      takeDamage: (damage: Robot["damage"]) => {
        const { baseHp } = get();

        set(() => ({ baseHp: baseHp - damage }));
      },

      tick: () => {
        const {
          status,
          baseHp,
          tickEnemies,
          processCombat,
          tickCooldowns,
          spawnEnemies,
          lastSpawnTime,
        } = get();
        const now = Date.now();

        if (status !== "PLAYING") return;

        if (baseHp <= 0) {
          set({ status: "GAME_OVER" });
          return;
        }

        if (now - lastSpawnTime > 3000) {
          spawnEnemies();
          set({ lastSpawnTime: now });
        }

        const dt = 60;
        tickCooldowns(dt);
        tickEnemies();
        processCombat();
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

      triggerAbility: (type) => {
        const { scrap, cooldowns, enemies } = get();
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
          set({ enemies: enemies.map((e) => ({ ...e, speed: 0 })) });

          setTimeout(() => {
            set({
              abilityActive: null,
              enemies: [...enemies],
            });
          }, config.duration);
        }
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

          if (robot.lastShot && now - robot.lastShot < robot.fireRate)
            return robot;

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
        const { enemies, takeDamage, abilityActive } = get();

        if (abilityActive === "EMP") return;

        set(() => ({
          enemies: enemies
            .map((e) => ({
              ...e,
              position: { ...e.position, y: e.position.y + e.speed },
            }))
            .filter((e) => {
              if (e.position.y >= 83) {
                takeDamage(e.damage);
                return false;
              }
              return true;
            }),
        }));
      },
    }),
    {
      name: "scrap-general-save",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ scrap: state.scrap }),
    },
  ),
);
