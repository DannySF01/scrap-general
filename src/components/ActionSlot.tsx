import type { AbilityType } from "../types/game";
import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import { Lock } from "lucide-react";

interface ActionSlotProps {
  abilityId?: AbilityType;
  hotkey: number;
}

export default function ActionSlot({ abilityId, hotkey }: ActionSlotProps) {
  const { scrap, cooldowns, triggerAbility, abilityActive } = useGameStore();

  if (!abilityId) {
    return (
      <div className="relative flex flex-col items-center justify-center w-14 h-14 rounded-sm border border-stone-900/40 bg-stone-950/20 opacity-30 select-none pointer-events-none">
        <span className="absolute top-1 left-1.5 text-[8px] text-stone-600 font-bold font-mono">
          {hotkey}
        </span>
        <Lock size={12} className="text-stone-700 shrink-0" />
        <span className="text-[7.5px] font-bold mt-1 text-stone-600 uppercase tracking-widest leading-none scale-90">
          LOCKED
        </span>
      </div>
    );
  }

  const config = REGISTRY.ABILITIES[abilityId];
  const Icon = config.icon;
  const cooldownEnd = cooldowns[abilityId] || 0;
  const isAffordable = scrap >= config.cost;
  const isActive = abilityActive.find((a) => a === abilityId);
  const isLocked = !abilityId || cooldownEnd > 0 || !isAffordable;

  const remainingTime = cooldowns[abilityId] || 0;
  const cooldownPercent = (remainingTime / config.cooldown) * 100;
  const isOnCooldown = cooldownPercent > 0;

  // Dynamic status styling
  let statusStyle =
    "border-stone-900 bg-stone-950/40 hover:border-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer active:translate-y-0.5 group";
  if (isActive) {
    statusStyle = "border-orange-500/60 bg-orange-500/10 text-orange-400";
  } else if (!isAffordable) {
    statusStyle =
      "bg-stone-950/20 border-stone-950 text-stone-600 cursor-not-allowed opacity-50 grayscale";
  } else if (isLocked) {
    statusStyle =
      "bg-stone-950/30 border-stone-950 opacity-40 cursor-not-allowed";
  }

  return (
    <button
      disabled={isLocked}
      onClick={() => triggerAbility(abilityId)}
      className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-sm border transition-all overflow-hidden font-mono select-none pt-2
        ${statusStyle}
      `}
    >
      {/* COOLDOWN BAR */}
      {isOnCooldown && (
        <div
          className="absolute bottom-0 left-0 w-full bg-orange-500/10 pointer-events-none transition-all duration-100"
          style={{ height: `${cooldownPercent}%` }}
        />
      )}

      {/* COOLDOWN TIMER */}
      {isOnCooldown && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold font-mono text-orange-400 bg-stone-950/70 z-20">
          {(remainingTime / 1000).toFixed(0)}s
        </span>
      )}

      {/* HOTKEY NUMBER */}
      <span
        className={`absolute top-0.5 left-1 text-[8px] font-bold font-mono transition-colors rounded-2xs px-0.5 leading-none scale-90 z-20
        ${isActive ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "bg-stone-900 text-stone-500 group-hover:text-stone-400"}
      `}
      >
        {hotkey}
      </span>

      {/* ABILITY ICON */}
      <div
        className={`transition-colors shrink-0 z-10 filter brightness-[0.85] contrast-[1.2] ${
          isActive
            ? "text-orange-400"
            : isLocked
              ? "text-stone-700"
              : "text-stone-400 group-hover:text-orange-500/80"
        }`}
      >
        <Icon size={13} />
      </div>

      {/* ABILITY TYPE */}
      <span
        className={`text-[7.5px] font-bold uppercase tracking-widest mt-1 scale-90 leading-none z-10 max-w-12.5 truncate ${
          isActive ? "text-orange-300" : "text-stone-400"
        }`}
      >
        {config.type}
      </span>

      {/* SCRAP COST */}
      <span
        className={`text-[7.5px] font-mono tracking-tight mt-0.5 leading-none z-10 ${
          isActive
            ? "text-orange-600/70"
            : !isAffordable
              ? "text-rose-500/70 font-bold"
              : "text-stone-600 font-medium group-hover:text-stone-500"
        }`}
      >
        {config.cost}SC
      </span>

      {/* PULSE ANIMATION WHEN ACTIVE */}
      {isActive && (
        <div className="absolute inset-0 bg-orange-500/5 animate-pulse pointer-events-none z-0" />
      )}
    </button>
  );
}
