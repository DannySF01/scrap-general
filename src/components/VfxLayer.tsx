import { motion } from "framer-motion";

export function VfxLayer({
  vfx,
  onComplete,
}: {
  vfx: {
    id: number;
    type: string;
    pos: { x: number; y: number };
    radius?: number;
  };
  onComplete: () => void;
}) {
  if (vfx.type === "EXPLOSION") {
    const size = (vfx.radius || 10) * 2;
    return (
      <motion.div
        initial={{ opacity: 0.8, scale: 0, x: "-50%", y: "-50%" }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onAnimationComplete={onComplete}
        className="absolute rounded-full border-2 border-orange-400 bg-orange-500/30 shadow-[0_0_20px_rgba(251,146,60,0.6)]"
        style={{
          left: `${vfx.pos.x}%`,
          top: `${vfx.pos.y}%`,
          width: `${size}%`,
          height: `${size}%`,
        }}
      />
    );
  }

  const randomOffsetX = (Math.random() - 0.5) * 4;
  const isCrit = vfx.type === "CRIT";

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [1, 1.5, 1],
        y: ["-50%", "-150%"],
        x: [`calc(-50% + ${randomOffsetX}%)`],
      }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={onComplete}
      className={`absolute font-black italic text-sm pointer-events-none drop-shadow-md ${
        isCrit ? "text-yellow-400 text-lg" : "text-slate-400"
      }`}
      style={{
        left: `${vfx.pos.x}%`,
        top: `${vfx.pos.y}%`,
      }}
    >
      {vfx.type}
    </motion.div>
  );
}
