import { useEffect, useRef } from "react";
import { useGameStore } from "../store/useGameStore";

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const status = useGameStore((state) => state.status);

  const animationFrameId = useRef<number | null>(null);
  const lastTimestamp = useRef<number>(performance.now());

  useEffect(() => {
    if (status !== "PLAYING") {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      return;
    }

    lastTimestamp.current = performance.now();

    const loop = (timestamp: number) => {
      // Calculate delta time
      const dtMs = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      // Protect against large delta times caused by lag
      const safeDtMs = Math.min(100, dtMs);

      tick(safeDtMs);

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [tick, status]);
}
