import type { AbilityType } from "../types/game";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import { Lock } from "lucide-react";

interface ActionSlotProps {
  abilityId?: AbilityType;
  hotkey: string;
}

export default function ActionSlot({ abilityId, hotkey }: ActionSlotProps) {
  const { scrap, cooldowns, triggerAbility, abilityActive } = useGameStore();

  if (!abilityId) {
    return (
      <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-950 opacity-30 h-full w-full grayscale">
        <span className="absolute top-2 left-2 text-[10px] text-slate-800 font-bold">
          {hotkey}
        </span>
        <Lock size={20} className="text-slate-800" />
        <span className="text-[8px] font-black mt-2 text-slate-800 uppercase tracking-widest">
          LOCKED
        </span>
      </div>
    );
  }

  const config = REGISTRY.ABILITIES[abilityId];
  const Icon = config.icon;
  const cooldownEnd = cooldowns[abilityId] || 0;
  const isAffordable = scrap >= config.cost;
  const isActive = abilityActive === abilityId;
  const isLocked = !abilityId || cooldownEnd > 0 || !isAffordable;

  const remainingTime = cooldowns[abilityId] || 0;
  const cooldownPercent = (remainingTime / config.cooldown) * 100;
  const isOnCooldown = cooldownPercent > 0;

  return (
    <button
      disabled={isLocked}
      onClick={() => triggerAbility(abilityId)}
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 transition-all overflow-hidden
      ${
        isLocked
          ? "bg-slate-950 border-slate-900 opacity-40 cursor-not-allowed"
          : !isAffordable
            ? "bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed grayscale"
            : isActive
              ? "bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
              : "bg-slate-900 border-slate-800 hover:border-indigo-500 hover:bg-slate-800 active:translate-y-0.5 cursor-pointer group"
      }`}
    >
      {isOnCooldown && (
        <div
          className="absolute bottom-0 left-0 w-full bg-indigo-500/30 pointer-events-none transition-all duration-100"
          style={{ height: `${cooldownPercent}%` }}
        />
      )}

      {isOnCooldown && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white bg-slate-950/40">
          {(remainingTime / 1000).toFixed(0)}s
        </span>
      )}

      <span className="absolute top-2 left-2 text-[10px] text-slate-600 font-bold group-hover:text-indigo-400/50">
        {hotkey}
      </span>

      <div
        className={`transition-colors ${
          isActive
            ? "text-indigo-400"
            : isLocked
              ? "text-slate-800"
              : "text-slate-400 group-hover:text-indigo-400"
        }`}
      >
        {<Icon size={24} />}
      </div>

      <span
        className={`text-[10px] font-black mt-1 uppercase tracking-tight ${isActive ? "text-indigo-200" : "text-slate-300"}`}
      >
        {config.type}
      </span>

      {!isLocked && (
        <span
          className={`text-[10px] font-bold italic ${isAffordable ? "text-scrap" : "text-slate-600"}`}
        >
          {config.cost} SC
        </span>
      )}

      {isActive && (
        <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none" />
      )}
    </button>
  );
}
