import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { VfxLayer } from "./VfxLayer";

interface VfxEvent {
  id: number;
  type: string;
  pos: { x: number; y: number };
  radius?: number;
}

export function VfxManager() {
  const [localVfx, setLocalVfx] = useState<VfxEvent[]>([]);

  useEffect(() => {
    // Listen for VFX events
    const handleSpawnVfx = (e: Event) => {
      const customEvent = e as CustomEvent<VfxEvent>;
      if (!customEvent.detail) return;

      setLocalVfx((prev) => [...prev, customEvent.detail]);
    };

    window.addEventListener("spawnVfx", handleSpawnVfx);
    return () => window.removeEventListener("spawnVfx", handleSpawnVfx);
  }, []);

  const handleRemove = (id: number) => {
    setLocalVfx((prev) => prev.filter((vfx) => vfx.id !== id));
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {localVfx.map((vfx) => (
          <VfxLayer
            key={vfx.id}
            vfx={vfx}
            onComplete={() => handleRemove(vfx.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
