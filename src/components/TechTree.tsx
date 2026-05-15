import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { REGISTRY } from "../data/registry";
import type { Upgrade } from "../types/game";
import TechConnection from "./TechConnection";
import TechNode from "./TechNode";
import { ArrowLeft } from "lucide-react";
import { getProjectedStat } from "../utils/stats";

interface HoveredNode {
  node: Upgrade;
  pos: { x: number; y: number };
}

export function TechTree() {
  const { setView, scrap, upgrades, purchaseUpgrade } = useGameStore();
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);

  const isMaxed =
    hoveredNode && hoveredNode.node.maxLevel === upgrades[hoveredNode.node.id];

  const categories = ["FORTRESS", "ROBOTICS", "LOGISTICS"];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-8">
        <motion.button
          onClick={() => setView("MAIN")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 px-4 py-2 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-sm overflow-hidden relative"
        >
          <ArrowLeft
            size={16}
            className="text-slate-500 group-hover:text-indigo-400 transition-colors"
          />
          <div>
            <span className="text-xs font-black text-slate-300 group-hover:text-white uppercase">
              Main Menu
            </span>
          </div>
        </motion.button>
        <div>
          <span className=" font-black text-slate-300 uppercase">
            <span className="text-indigo-400">{scrap}</span> SCRAP
          </span>
        </div>
      </div>
      <main className="relative">
        <svg className="absolute pointer-events-none w-full h-full stroke-slate-800 fill-none">
          {Object.values(REGISTRY.UPGRADES).map((node) =>
            node.requires?.map((reqId) => (
              <TechConnection
                key={`${reqId}-${node.id}`}
                fromId={reqId}
                toId={node.id}
              />
            )),
          )}
        </svg>
        <div className="flex gap-32 p-4 justify-center">
          {categories.map((cat) => {
            const categoryNodes = Object.values(REGISTRY.UPGRADES).filter(
              (u) => u.category === cat,
            );

            const tiers = Array.from(
              new Set(categoryNodes.map((n) => n.tier)),
            ).sort((a, b) => a - b);

            return (
              <div key={cat} className="flex flex-col gap-12 w-80 items-center">
                <h4 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] uppercase border-b border-slate-800 pb-4 w-full text-center">
                  {cat} SYSTEM
                </h4>

                {tiers.map((tier) => (
                  <div key={tier} className="flex gap-6 justify-center w-full">
                    {categoryNodes
                      .filter((n) => n.tier === tier)
                      .map((node) => (
                        <TechNode
                          key={node.id}
                          node={node}
                          level={upgrades[node.id] || 0}
                          onHover={(node, pos) => setHoveredNode({ node, pos })}
                          onLeave={() => setHoveredNode(null)}
                          onClick={() => purchaseUpgrade(node.id, node.cost)}
                        />
                      ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>

      <AnimatePresence>
        <Tooltip />
      </AnimatePresence>
    </div>
  );

  function Tooltip() {
    if (!hoveredNode) return null;

    const isNodeLocked = hoveredNode.node.requires?.some(
      (reqId) => (upgrades[reqId] || 0) === 0,
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: 0,
          left: hoveredNode.pos.x + 10,
          top: hoveredNode.pos.y,
        }}
        exit={{ opacity: 0, x: -10 }}
        className="fixed  right-12 w-80 bg-slate-900/95 border-2 border-indigo-500/50 p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50 backdrop-blur-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-white italic">
            {hoveredNode.node.name}
          </h2>
          <hoveredNode.node.icon className="text-indigo-400" size={24} />
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {hoveredNode.node.description}
        </p>

        {!isNodeLocked && <Projection />}

        {!isNodeLocked ? (
          <>
            <div className="flex justify-between items-center border-t border-slate-800 pt-4">
              {!isMaxed ? (
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">
                    Cost
                  </p>
                  <p className="text-emerald-400 font-black">
                    {hoveredNode.node.cost.scrap} SC
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-emerald-400 font-bold uppercase">
                    Upgrade already Maxed
                  </p>
                </div>
              )}
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">
                  Level
                </p>
                <p className="text-indigo-400 font-black">
                  {upgrades[hoveredNode.node.id] || 0} /{" "}
                  {hoveredNode.node.maxLevel}
                </p>
              </div>
            </div>

            {!isMaxed && (
              <p className="mt-4 text-xs text-center text-slate-500 animate-pulse">
                CLICK TO RESEARCH
              </p>
            )}
          </>
        ) : (
          <div className="flex justify-between items-end border-t border-slate-800 pt-4">
            <div>
              <p className="text-xs text-red-500 font-bold uppercase">
                Needs {hoveredNode.node.requires} to unlock
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  function Projection() {
    if (!hoveredNode || !hoveredNode.node.modifiers) return null;

    const projections = getProjectedStat(hoveredNode.node.id, upgrades);

    return (
      <motion.div>
        {projections.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-950/50 p-3 border border-indigo-500/20 rounded-md"
          >
            <p className="text-[9px] font-black text-indigo-400 tracking-widest mb-1">
              {stat.label}
            </p>

            {!isMaxed ? (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-black">
                  {stat.label === "FIRERATE"
                    ? `${(1000 / stat.current).toFixed(1)}x`
                    : stat.current.toFixed(1)}
                </span>

                <div className="text-indigo-500 text-[10px]">{">>"}</div>

                <span className="text-xs text-emerald-400 font-black">
                  {stat.label === "FIRERATE"
                    ? `${(1000 / stat.projected).toFixed(1)}x`
                    : stat.projected.toFixed(1)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-black">
                  {stat.label === "FIRERATE"
                    ? `${(1000 / stat.current).toFixed(1)}x`
                    : stat.current.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        ))}
      </motion.div>
    );
  }
}
