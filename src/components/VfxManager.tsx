import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { CritPopup } from "./VfxLayer";

export function VfxManager() {
  const vfxEvents = useGameStore((state) => state.vfxEvents);
  const removeVfx = useGameStore((state) => state.removeVfx);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {vfxEvents.map((vfx) => (
          <CritPopup
            key={vfx.id}
            x={vfx.pos.x}
            y={vfx.pos.y}
            onComplete={() => removeVfx(vfx.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
