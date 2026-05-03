import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export function useGameLoop() {
  const updatePositions = useGameStore((state) => state.updatePositions);

  useEffect(() => {
    let frameId: number;

    const loop = () => {
      updatePositions();

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [updatePositions]);
}
