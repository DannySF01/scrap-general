import type { StateCreator } from "zustand";
import type { Bullet, Enemy, Turret } from "../../types/game";
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
  dispatchVfx: (
    pos: Enemy["position"],
    type: "EXPLOSION" | "CRIT" | "BLOCKED" | "RICOCHET",
    turretTemplate?: any,
  ) => void;
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

  dispatchVfx: (
    pos: Enemy["position"],
    type: "EXPLOSION" | "CRIT" | "BLOCKED" | "RICOCHET",
    turretTemplate?: Turret,
  ) => {
    window.dispatchEvent(
      new CustomEvent("spawnVfx", {
        detail: {
          id: Math.random(),
          type: type,
          pos: { x: pos.x, y: pos.y },
          radius: turretTemplate?.splashRadius || 0,
        },
      }),
    );
  },

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
      dispatchVfx,
    } = get();
    const now = Date.now();

    let currentEnemies = [...enemies];
    let activeBullets = [...bullets];
    let totalScrapGained = 0;

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
        // Apply sentry bonus tech
        const sentryBonus =
          selectedTurretType === "SENTRY"
            ? resolveStat("sentryDamage", 0, upgrades)
            : 0;

        // Calculate crit
        const critChance = resolveStat("critChance", 0, upgrades);
        const isCrit = Math.random() < critChance;

        const finalDamage = isCrit
          ? (baseDamage + sentryBonus) * 2
          : baseDamage + sentryBonus;

        const bulletSpeed = 6;

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
      if ((bullet as Bullet).isShotgunPellet) {
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
          dispatchVfx(hitEnemy.position, "BLOCKED");
          continue;
        }

        const acidChance = resolveStat("acidChance", 0, upgrades);
        const triggersAcid = Math.random() < acidChance;

        // Apply damage to the hit enemy
        if (turretTemplate.splashRadius) {
          dispatchVfx(hitEnemy.position, "EXPLOSION", turretTemplate);
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

        if (bullet.isCrit) dispatchVfx(hitEnemy.position, "CRIT");

        const ricochetChance = resolveStat("ricochetChance", 0, upgrades);

        // Prevent infinite bouncing chains on the same frame
        const canBounce =
          ricochetChance > 0 &&
          Math.random() < ricochetChance &&
          !hitEnemy.hasBulletBounced;

        if (canBounce) {
          let closestSecondaryEnemy: typeof hitEnemy | null = null;
          let shortestDistance = 99999;

          for (const potentialTarget of currentEnemies) {
            // Ignore the target we just shot, and skip anything already dead
            if (potentialTarget.id === hitEnemy.id || potentialTarget.hp <= 0)
              continue;

            const tx = potentialTarget.position.x - hitEnemy.position.x;
            const ty = potentialTarget.position.y - hitEnemy.position.y;
            const targetDistance = Math.sqrt(tx * tx + ty * ty);

            // Find the closest secondary target (up to 25 pixels away)
            if (targetDistance < shortestDistance && targetDistance < 25) {
              shortestDistance = targetDistance;
              closestSecondaryEnemy = potentialTarget;
            }
          }

          // Bounce the bullet off the closest secondary target
          if (closestSecondaryEnemy) {
            const bounceDx = closestSecondaryEnemy.position.x - nextX;
            const bounceDy = closestSecondaryEnemy.position.y - nextY;

            // Calculate the distance toward the secondary target
            const bounceDistance = Math.sqrt(
              bounceDx * bounceDx + bounceDy * bounceDy,
            );

            if (bounceDistance > 0) {
              const newDirX = bounceDx / bounceDistance;
              const newDirY = bounceDy / bounceDistance;

              dispatchVfx(hitEnemy.position, "RICOCHET");

              updatedBullets.push({
                ...bullet,
                x: nextX,
                y: nextY,
                dirX: newDirX,
                dirY: newDirY,
                hasBulletBounced: true,
              } as any);
              continue; // Keeps the bullet alive until it hits the secondary target
            }
          }
        }
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
    }));
  },
});
