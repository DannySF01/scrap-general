import type { StateCreator } from "zustand";
import type { Bullet, Turret } from "../../types/game";
import type { GameState } from "../useGameStore";
import { REGISTRY } from "../../data/registry";
import { resolveStat } from "../../utils/stats";

export interface CombatSlice {
  turrets: Turret[];
  playerPos: { x: number; y: number };
  isFiring: boolean;
  bullets: Bullet[];
  lastShotTime: number;
  selectedTurretType: Turret["type"];
  selectTurret: (type: Turret["type"]) => void;
  processCombat: (dt: number) => void;
  vfxEvents: {
    id: number;
    type: string;
    pos: { x: number; y: number };
    radius?: number;
  }[];
  removeVfx: (id: number) => void;
  updatePlayerPos: (x: number, y: number) => void;
  updateTurretType: (type: Turret["type"]) => void;
  setFiring: (isFiring: boolean) => void;
}

export const createCombatSlice: StateCreator<GameState, [], [], CombatSlice> = (
  set,
  get,
) => ({
  turrets: [],
  playerPos: { x: 50, y: 80 },
  isFiring: false,
  bullets: [],
  lastShotTime: 0,
  selectedTurretType: "SENTRY",
  vfxEvents: [],
  removeVfx: (id: number) =>
    set({ vfxEvents: get().vfxEvents.filter((e) => e.id !== id) }),

  selectTurret: (type: Turret["type"]) => set({ selectedTurretType: type }),

  updatePlayerPos: (x: number, y: number) => set({ playerPos: { x, y } }),

  updateTurretType: (type: Turret["type"]) => {
    const { unlocks } = get();

    // Check if turret is unlocked
    const blueprintKey = `${type}_BLUEPRINT`;
    const isTurretUnlocked = type === "SENTRY" || !!unlocks[blueprintKey];

    if (!isTurretUnlocked) return;

    set({ selectedTurretType: type });
  },

  setFiring: (isFiring: boolean) => set({ isFiring }),

  processCombat: (dt: number) => {
    const {
      playerPos,
      isFiring,
      lastShotTime,
      selectedTurretType,
      enemies,
      upgrades,
      bullets,
      abilityActive,
    } = get();
    const now = Date.now();

    let currentEnemies = [...enemies];
    let activeBullets = [...bullets];
    let totalScrapGained = 0;
    let newVfx: CombatSlice["vfxEvents"] = [];

    // Get selected turret template
    const turretTemplate = REGISTRY.TURRETS[selectedTurretType];
    if (!turretTemplate) return;

    // Firing logic
    if (isFiring) {
      let fireRate = resolveStat("fireRate", turretTemplate.fireRate, upgrades);
      if (abilityActive.find((a) => a === "OVERCLOCK")) fireRate /= 2;

      // Turret fire cooldown
      const onCooldown = now - lastShotTime <= fireRate;

      if (!onCooldown) {
        const baseDamage = resolveStat(
          "damage",
          turretTemplate.damage,
          upgrades,
        );
        const sentryBonus =
          selectedTurretType === "SENTRY"
            ? resolveStat("sentryDamage", 0, upgrades)
            : 0;
        const critChance = resolveStat("critChance", 0, upgrades);

        const isCrit = Math.random() < critChance;

        const finalDamage = isCrit
          ? (baseDamage + sentryBonus) * 2
          : baseDamage + sentryBonus;

        const bulletSpeed = (turretTemplate as any).bulletSpeed ?? 6.0;

        // Double shot Tech
        const doubleShotChance = resolveStat("doubleShotChance", 0, upgrades);
        const triggersDoubleShot = Math.random() < doubleShotChance;

        if (selectedTurretType === "SHOTGUN") {
          const pelletCount = 6;

          // Shotgun wide spread
          const spawnShotgunBlast = (yOffset: number) => {
            for (let i = 0; i < pelletCount; i++) {
              // Calculate horizontal spread
              const spreadFraction = i / (pelletCount - 1) - 0.5;
              const lateralDirX = spreadFraction * 0.9; // Wide scatter width multiplier

              activeBullets.push({
                id: crypto.randomUUID(),
                x: playerPos.x,
                y: playerPos.y + yOffset,
                dirX: lateralDirX,
                dirY: -1,
                damage: finalDamage,
                speed: bulletSpeed,
                isCrit,
                startY: playerPos.y + yOffset,
                maxDistanceY: turretTemplate.maxRange,
                isShotgunPellet: true,
              } as any);
            }
          };

          // Deploy primary heavy blast cluster
          spawnShotgunBlast(-2);
          if (triggersDoubleShot) spawnShotgunBlast(-8);
        } else {
          // SINGLE SHOT (Sentry, Sniper, Rocket)

          const spawnSingleShot = (yOffset: number) => {
            activeBullets.push({
              id: crypto.randomUUID(),
              x: playerPos.x,
              y: playerPos.y + yOffset,
              dirX: 0,
              dirY: -1,
              damage: finalDamage,
              speed: bulletSpeed,
              isCrit,
            });
          };

          spawnSingleShot(-2);
          if (triggersDoubleShot) spawnSingleShot(-8);
        }

        set({ lastShotTime: now });
      }
    }

    // Bullet movement
    const updatedBullets: Bullet[] = [];

    // Converts to millisecond
    const timeStepMultiplier = dt / 16.666; // 60fps

    for (const bullet of activeBullets) {
      const nextX =
        bullet.x + (bullet.dirX || 0) * bullet.speed * timeStepMultiplier;
      const nextY = bullet.y + bullet.dirY * bullet.speed * timeStepMultiplier;

      // Destroy bullet if it goes out of bounds
      if (nextY < -2 || nextX < -5 || nextX > 105) {
        continue;
      }

      //  Destroy bullet if it reaches max range
      if ((bullet as any).isShotgunPellet) {
        const distanceTravelledY = Math.abs((bullet as any).startY - nextY);
        if (distanceTravelledY >= (bullet as any).maxDistanceY) {
          continue;
        }
      }

      // Check for collision with enemies
      let hitEnemy = null;
      for (const enemy of currentEnemies) {
        if (enemy.hp <= 0) continue;
        const edx = enemy.position.x - nextX;
        const edy = enemy.position.y - nextY;
        const distance = Math.sqrt(edx * edx + edy * edy);

        // Bullet hit an enemy
        if (distance < 3) {
          hitEnemy = enemy;
          break;
        }
      }

      if (hitEnemy) {
        // Shielder Blocks Single/Splash calculations
        if (hitEnemy.type === "SHIELDER" && Math.random() < 0.2) {
          newVfx.push({
            id: Math.random(),
            type: "BLOCKED",
            pos: hitEnemy.position,
          });
          continue;
        }

        const acidChance = resolveStat("acidChance", 0, upgrades);
        const triggersAcid = Math.random() < acidChance;

        // Apply damage to the hit enemy
        if (turretTemplate.splashRadius) {
          newVfx.push({
            id: Math.random(),
            type: "EXPLOSION",
            pos: hitEnemy.position,
            radius: turretTemplate.splashRadius,
          });

          currentEnemies = currentEnemies.map((e) => {
            const sdx = e.position.x - hitEnemy!.position.x;
            const sdy = e.position.y - hitEnemy!.position.y;
            const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
            return sdist <= (turretTemplate.splashRadius ?? 0)
              ? { ...e, hp: e.hp - bullet.damage }
              : e;
          });
        } else {
          currentEnemies = currentEnemies.map((e) => {
            if (e.id === hitEnemy!.id) {
              const stunTimestamp =
                bullet.isCrit && selectedTurretType === "SNIPER"
                  ? now + 5000
                  : e.stunnedAt;

              // Check if the enemy is currently corroded (4sec)
              const isCurrentlyCorroded = e.meltedAt && now < e.meltedAt + 4000;
              const acidDamage = 0.2; // 20% damage increase
              const acidTimestamp = triggersAcid ? now + 4000 : e.meltedAt;

              const dmgMultiplier = isCurrentlyCorroded ? 1 + acidDamage : 1;

              const computedDamage = bullet.damage * dmgMultiplier;

              return {
                ...e,
                hp: e.hp - computedDamage,
                stunnedAt: stunTimestamp,
                meltedAt: acidTimestamp,
              };
            }
            return e;
          });
        }

        if (bullet.isCrit)
          newVfx.push({
            id: Math.random(),
            type: "CRIT",
            pos: hitEnemy.position,
          });

        continue; // Destroy bullet if it hits an enemy
      }

      // Preserve bullet if it doesn't hit an enemy
      updatedBullets.push({
        ...bullet,
        x: nextX,
        y: nextY,
      });
    }

    // Calculate bonus scrap from tech
    const bonusScrapPayout = resolveStat("scrapFlat", 0, upgrades);

    // Remove dead enemies
    const survivingEnemies = currentEnemies.filter((e) => {
      if (e.hp <= 0) {
        // Register enemy death time
        if (!e.destroyedAt) {
          e.destroyedAt = Date.now();
          totalScrapGained += e.reward + bonusScrapPayout;
        }

        // Keep enemy dead for 500ms
        const timeSinceDeath = Date.now() - e.destroyedAt;
        return timeSinceDeath < 500;
      }
      return true;
    });

    set((state) => ({
      enemies: survivingEnemies,
      bullets: updatedBullets,
      scrap: state.scrap + totalScrapGained,
      vfxEvents: [...state.vfxEvents, ...newVfx],
    }));
  },
});
