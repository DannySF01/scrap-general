import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Upgrade } from "../types/game";
import { useGameStore } from "../store/useGameStore";

interface TechNodeProps {
  node: Upgrade;
  level: number;
  onHover: (node: Upgrade, pos: { x: number; y: number }) => void;
  onLeave: () => void;
  onClick: () => void;
}

export default function TechNode({
  node,
  level,
  onHover,
  onLeave,
  onClick,
}: TechNodeProps) {
  const { upgrades } = useGameStore();

  const isLocked = node.requires?.some((reqId) => (upgrades[reqId] || 0) === 0);
  const isMaxed = level >= node.maxLevel;

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover(node, {
      x: rect.right + 10,
      y: rect.top,
    });
  };

  return (
    <motion.button
      id={`node-${node.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onClick={isLocked ? undefined : onClick}
      whileHover={{ scale: 1.1 }}
      className={`w-32 p-4 rounded-xl border-2 text-left transition-all ${
        isLocked
          ? "opacity-40 grayscale border-slate-900 bg-slate-950"
          : isMaxed
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-slate-800 bg-slate-900/80 hover:border-slate-600"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-[10px] font-black text-white uppercase">
          {node.name}
        </p>
        {isLocked && <Lock size={12} className="text-slate-500" />}
      </div>

      <div className="flex gap-1 mt-2">
        {Array.from({ length: node.maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < level ? "bg-indigo-400" : "bg-slate-800"
            }`}
          />
        ))}
      </div>
    </motion.button>
  );
}
