import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);

  useEffect(() => {
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [tick]);
}
