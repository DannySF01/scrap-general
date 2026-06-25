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
  processCombat: () => void;
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

  updateTurretType: (type: Turret["type"]) => set({ selectedTurretType: type }),

  setFiring: (isFiring: boolean) => set({ isFiring }),

  processCombat: () => {
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

    const weaponTemplate = REGISTRY.TURRETS[selectedTurretType];
    if (!weaponTemplate) return;

    // Execução do disparo
    if (isFiring) {
      let fireRate = resolveStat("fireRate", weaponTemplate.fireRate, upgrades);
      if (abilityActive.find((a) => a === "OVERCLOCK")) fireRate /= 2;

      if (now - lastShotTime >= fireRate && currentEnemies.length > 0) {
        const baseDamage = resolveStat(
          "damage",
          weaponTemplate.damage,
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
        const bulletSpeed = (weaponTemplate as any).bulletSpeed ?? 6.0;

        activeBullets.push({
          id: crypto.randomUUID(),
          x: playerPos.x,
          y: playerPos.y, // Bala aparece 3px acima do jogador
          dirX: 0,
          dirY: -1,
          damage: finalDamage,
          speed: bulletSpeed,
        });

        set({ lastShotTime: now });
      }
    }

    // ================= 2. MOVIMENTO EM LINHA RETA E DETEÇÃO DE IMPACTO MULTI-ALVO =================
    const updatedBullets: Bullet[] = [];

    for (const bullet of activeBullets) {
      const nextX = bullet.x;
      const nextY = bullet.y + bullet.dirY * bullet.speed;

      // Se a bala sair dos limites da Arena, é destruída
      if (nextY < -2) {
        continue;
      }

      // Procura QUALQUER inimigo que esteja perto das coordenadas atuais da bala (Deteção de colisão por proximidade)
      let hitEnemy = null;
      for (const enemy of currentEnemies) {
        if (enemy.hp <= 0) continue;
        const edx = enemy.position.x - nextX;
        const edy = enemy.position.y - nextY;
        const distance = Math.sqrt(edx * edx + edy * edy);

        // Raio de colisão do corpo do monstro
        if (distance < 3) {
          hitEnemy = enemy;
          break; // Para o loop, a bala bateu no primeiro que encontrou
        }
      }

      if (hitEnemy) {
        // Regra do Shielder
        if (hitEnemy.type === "SHIELDER" && Math.random() < 0.2) {
          newVfx.push({
            id: Math.random(),
            type: "BLOCKED",
            pos: hitEnemy.position,
          });
          continue;
        }

        // Aplicação de Dano (Splash vs Alvo Único)
        if (weaponTemplate.splashRadius) {
          newVfx.push({
            id: Math.random(),
            type: "EXPLOSION",
            pos: hitEnemy.position,
            radius: weaponTemplate.splashRadius,
          });

          currentEnemies = currentEnemies.map((e) => {
            const sdx = e.position.x - hitEnemy!.position.x;
            const sdy = e.position.y - hitEnemy!.position.y;
            const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
            return sdist <= (weaponTemplate.splashRadius ?? 0)
              ? { ...e, hp: e.hp - bullet.damage }
              : e;
          });
        } else {
          currentEnemies = currentEnemies.map((e) =>
            e.id === hitEnemy!.id ? { ...e, hp: e.hp - bullet.damage } : e,
          );
        }

        const isCritDamage =
          bullet.damage >
          resolveStat("damage", weaponTemplate.damage, upgrades) * 1.5;
        if (isCritDamage) {
          newVfx.push({
            id: Math.random(),
            type: "CRIT",
            pos: hitEnemy.position,
          });
        }

        continue; // A bala explode e morre aqui
      }

      // Se não bateu em nada, a bala continua viva para o próximo tick
      updatedBullets.push({
        ...bullet,
        x: nextX,
        y: nextY,
      });
    }

    // ================= 3. LIMPEZA DE MORTES =================
    const survivingEnemies = currentEnemies.filter((e) => {
      if (e.hp <= 0) {
        totalScrapGained += e.reward;
        return false;
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
