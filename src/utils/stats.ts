import { REGISTRY } from "../data/registry";

export function resolveStat(
  statKey: string,
  baseValue: number,
  upgrades: Record<string, number>,
) {
  let flatBonus = 0;
  let totalMultiplier = 1;

  Object.entries(upgrades).forEach(([id, level]) => {
    const config = REGISTRY.UPGRADES[id];
    if (!config?.modifiers || level === 0) return;

    const flat = config.modifiers[statKey as keyof typeof config.modifiers];
    if (typeof flat === "number") {
      flatBonus += flat * level;
    }

    const mult =
      config.modifiers[`${statKey}Mult` as keyof typeof config.modifiers];
    if (typeof mult === "number") {
      totalMultiplier *= Math.pow(1 + mult, level);
    }
  });

  if (statKey === "fireRate") {
    return baseValue / totalMultiplier;
  }

  if (statKey === "critChance") {
    return Math.min(1.0, flatBonus);
  }

  return (baseValue + flatBonus) * totalMultiplier;
}

export function getProjectedStat(
  upgradeId: string,
  upgrades: Record<string, number>,
) {
  const node = REGISTRY.UPGRADES[upgradeId];
  if (!node.modifiers) return [];

  const affectedStats = Object.keys(node.modifiers)
    .map((key) => key.replace("Mult", ""))
    .filter((v, i, a) => a.indexOf(v) === i);

  return affectedStats.map((statKey) => {
    const baseValue =
      statKey === "fireRate" ? 1000 : statKey === "maxHp" ? 100 : 10;

    const current = resolveStat(statKey, baseValue, upgrades);
    const projected = resolveStat(statKey, baseValue, {
      ...upgrades,
      [upgradeId]: (upgrades[upgradeId] || 0) + 1,
    });

    return {
      label: statKey.toUpperCase(),
      current,
      projected,
      isBetter:
        statKey === "fireRate" ? projected < current : projected > current,
    };
  });
}
