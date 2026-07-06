import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { REGISTRY } from "../data/registry";
import TechConnection from "./TechConnection";
import TechNode from "./TechNode";
import { ArrowLeft } from "lucide-react";

export function TechTree() {
  const { setView, scrap, upgrades } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<string>("FORTRESS");

  const categories = ["FORTRESS", "ROBOTICS", "LOGISTICS"];

  const categoryNodes = Object.values(REGISTRY.UPGRADES).filter(
    (u) => u.category === activeCategory,
  );

  const tiers = Array.from(new Set(categoryNodes.map((n) => n.tier))).sort(
    (a, b) => a - b,
  );

  const activeNodeIds = new Set(categoryNodes.map((n) => n.id));

  return (
    <div className="h-full w-full bg-[#0c0a09] font-mono p-12 flex flex-col relative select-none overflow-hidden">
      <div className="flex items-center justify-between border-b border-stone-900/60 pb-6 mb-8 shrink-0">
        <button
          onClick={() => setView("MAIN")}
          className="p-2.5 bg-stone-900/40 border border-stone-900 hover:border-stone-800 text-stone-400 hover:text-white rounded-sm cursor-pointer transition-colors duration-150"
        >
          <ArrowLeft size={14} />
        </button>

        <div className="flex gap-1 bg-stone-950/40 p-1 border border-stone-900/50 rounded-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-sm transition-all duration-150 cursor-pointer
                ${
                  activeCategory === cat
                    ? "bg-orange-500/10 border border-orange-900/50 text-orange-400 shadow-sm"
                    : "bg-transparent border border-transparent text-stone-500 hover:text-stone-300"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-0.5">
            Available Funds
          </span>
          <span className="text-lg font-bold text-orange-500 tracking-wider">
            {scrap}{" "}
            <span className="text-[10px] text-stone-400 font-bold tracking-normal ml-0.5">
              SCRAP
            </span>
          </span>
        </div>
      </div>

      <main className="relative flex-1 overflow-hidden flex items-center py-4 custom-horizontal-scrollbar">
        <svg className="absolute pointer-events-none inset-0 w-full h-full stroke-stone-900 fill-none z-0">
          {categoryNodes.map((node) =>
            node.requires?.map((reqId) => {
              if (!activeNodeIds.has(reqId)) return null;
              return (
                <TechConnection
                  key={`${reqId}-${node.id}`}
                  fromId={reqId}
                  toId={node.id}
                />
              );
            }),
          )}
        </svg>

        <div className="flex gap-8 items-center relative z-10 mx-auto min-w-max">
          {tiers.map((tier) => (
            <div className="flex flex-col gap-6" key={tier}>
              {categoryNodes
                .filter((n) => n.tier === tier)
                .map((node) => (
                  <TechNode
                    key={node.id}
                    node={node}
                    level={upgrades[node.id]}
                  />
                ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
