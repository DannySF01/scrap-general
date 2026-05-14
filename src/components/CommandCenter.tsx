import { REGISTRY } from "../data/registry";
import { useGameStore } from "../store/useGameStore";
import ActionSlot from "./ActionSlot";
import { StatPanel } from "./StatPanel";

export default function CommandCenter() {
  const { unlocks } = useGameStore();

  const unlockedAbilities = Object.entries(REGISTRY.ABILITIES).filter(
    ([key]) => unlocks[`ABILITY_${key}`],
  );

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center">
      <StatPanel />
      <div className="relative bg-slate-950/90 border-2 border-slate-800 p-2 flex gap-2 items-center rounded-xl shadow-2xl backdrop-blur-xl">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => {
            const targetAbility = unlockedAbilities[i]?.[1];
            return (
              <ActionSlot
                key={i}
                abilityId={targetAbility ? targetAbility.type : undefined}
                hotkey={i + 1}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
