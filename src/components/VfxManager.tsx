import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { VfxLayer } from "./VfxLayer";

export function VfxManager() {
  const vfxEvents = useGameStore((state) => state.vfxEvents);
  const removeVfx = useGameStore((state) => state.removeVfx);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {vfxEvents.map((vfx) => (
          <VfxLayer
            key={vfx.id}
            vfx={vfx}
            onComplete={() => removeVfx(vfx.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
