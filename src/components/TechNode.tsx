import { Lock } from "lucide-react";
import type { Upgrade } from "../types/game";
import { useGameStore } from "../store/useGameStore";
import { getProjectedStat } from "../utils/stats";

interface TechNodeProps {
  node: Upgrade;
  level: number;
}

export default function TechNode({ node, level = 0 }: TechNodeProps) {
  const { upgrades, purchaseUpgrade, scrap } = useGameStore();

  const isLocked = node.requires?.some((req) => (upgrades[req] || 0) === 0);
  const isMaxed = level >= node.maxLevel;

  const nextCost = node.cost.scrap * (level + 1);

  let nodeStyle =
    "border-stone-900 bg-stone-900/30 hover:border-stone-800 text-stone-300";
  if (isLocked) {
    nodeStyle =
      "opacity-20 border-transparent bg-transparent pointer-events-none grayscale";
  } else if (isMaxed) {
    nodeStyle = "border-orange-950/60 bg-orange-950/10 text-orange-400";
  }

  const projections = node.modifiers ? getProjectedStat(node.id, upgrades) : [];

  // If it's the last 2 columns, show tooltip on the left
  const isLastColumn = node.tier >= 4;
  const tooltipPlacementClasses = isLastColumn
    ? "right-full mr-3 origin-right"
    : "left-full ml-3 origin-left";

  return (
    <div className="relative group/node select-none">
      <button
        id={`node-${node.id}`}
        onClick={
          isLocked ? undefined : () => purchaseUpgrade(node.id, node.cost)
        }
        className={`w-32 p-3 border rounded-sm text-left flex flex-col justify-between h-16 transition-all duration-150 cursor-pointer hover:-translate-y-0.5
          ${nodeStyle}
        `}
      >
        <div className="flex justify-between items-start w-full gap-2">
          <p className="text-[9px] font-bold tracking-wider uppercase line-clamp-2 leading-tight text-stone-200">
            {node.name}
          </p>
          {isLocked && (
            <Lock size={10} className="text-stone-700 shrink-0 mt-0.5" />
          )}
        </div>

        <div className="flex gap-1 mt-auto w-full pt-2">
          {Array.from({ length: node.maxLevel }).map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-2xs transition-colors duration-200 
                ${
                  i < level
                    ? isMaxed
                      ? "bg-orange-500 shadow-[0_0_4px_#f97316]"
                      : "bg-stone-300"
                    : "bg-stone-800/60"
                }
              `}
            />
          ))}
        </div>
      </button>

      <div
        className={`absolute top-0 w-72 bg-stone-950 border border-stone-900 p-4 rounded-sm shadow-2xl z-50 backdrop-blur-xs flex flex-col pointer-events-none opacity-0 scale-95 transition-all duration-100 ease-out group-hover/node:opacity-100 group-hover/node:scale-100 ${tooltipPlacementClasses}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-[12px] font-bold text-stone-100 uppercase tracking-wider">
            {node.name}
          </h2>
          <div className="text-stone-500 scale-75">
            <node.icon />
          </div>
        </div>

        <p className="text-[9px] font-sans tracking-wide text-stone-400 leading-relaxed mb-4 normal-case">
          {node.description}
        </p>

        {!isLocked && projections.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-3">
            {projections.map((stat) => (
              <div
                key={stat.label}
                className="bg-stone-900/30 p-2 border border-stone-900/40 rounded-sm flex flex-col"
              >
                <p className="text-[8px] font-bold text-stone-500 tracking-widest mb-1 uppercase">
                  {stat.label}
                </p>
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[10px] text-stone-400 font-bold">
                    {stat.label === "FIRERATE"
                      ? `${(1000 / stat.current).toFixed(1)}/s`
                      : stat.current.toFixed(1)}
                  </span>
                  {!isMaxed && (
                    <>
                      <div className="text-stone-600 text-[8px] tracking-tighter">
                        &gt;&gt;
                      </div>
                      <span className="text-[10px] text-orange-400 font-bold">
                        {stat.label === "FIRERATE"
                          ? `${(1000 / stat.projected).toFixed(1)}/s`
                          : stat.projected.toFixed(1)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center border-t border-stone-900/60 pt-3 mt-auto">
          {!isLocked ? (
            <>
              {!isMaxed ? (
                <div>
                  <p className="text-[8px] text-stone-600 font-bold uppercase tracking-wider">
                    Cost
                  </p>
                  {nextCost > scrap ? (
                    <p className="text-[10px] text-rose-500 font-bold font-mono">
                      {nextCost} SC
                    </p>
                  ) : (
                    <p className="text-[10px] text-stone-300 font-bold font-mono">
                      {nextCost} SC
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[9px] text-orange-500/80 font-bold uppercase tracking-wider">
                  Max Level
                </p>
              )}
              <div className="text-right">
                <p className="text-[8px] text-stone-600 font-bold uppercase tracking-wider">
                  Level
                </p>
                <p className="text-[10px] text-orange-500 font-bold font-mono">
                  {level || 0} / {node.maxLevel}
                </p>
              </div>
            </>
          ) : (
            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">
              Locked — Requires dependency node
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
