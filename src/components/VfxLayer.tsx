import { motion } from "framer-motion";

export function VfxLayer({
  vfx,
  onComplete,
}: {
  vfx: {
    id: number;
    type: string;
    pos: { x: number; y: number };
  };
  onComplete: () => void;
}) {
  const randomOffsetX = (Math.random() - 0.5) * 4;

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.2,
        x: `${vfx.pos.x + randomOffsetX}%`,
        y: `${vfx.pos.y}%`,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.5, 1],
        y: `${vfx.pos.y - 10}%`,
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onAnimationComplete={onComplete}
      className="absolute text-yellow-400 font-black italic text-xs drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
      style={{
        left: `${vfx.pos.x}%`,
        top: `${vfx.pos.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {vfx.type}
    </motion.div>
  );
}
