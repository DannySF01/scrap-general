import { useGameStore } from "../store/useGameStore";
import { resolveStat } from "../utils/stats";

export function StatPanel() {
  const upgrades = useGameStore((state) => state.upgrades);

  const dmgMult = resolveStat("damage", 1, upgrades);

  const rateMult = 1 / resolveStat("fireRate", 1, upgrades);

  const critMult = resolveStat("critChance", 0, upgrades) * 100;

  return (
    <div className="flex gap-3">
      <PanelRow
        label="ATK"
        value={`x${dmgMult.toFixed(1)}`}
        color="text-red-400"
      />
      <PanelRow
        label="SPD"
        value={`x${rateMult.toFixed(1)}`}
        color="text-indigo-400"
      />
      <PanelRow label="CRIT" value={`${critMult}%`} color="text-sky-400" />
    </div>
  );
}

function PanelRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">
        {label}
      </span>
      <span className={`text-[10px] font-black tabular-nums ${color}`}>
        {value}
      </span>
    </div>
  );
}
