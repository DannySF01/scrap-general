import { AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { EnemyUnit } from "./EnemyUnit";
import { BaseWall } from "./BaseWall";
import CommandCenter from "./CommandCenter";
import { WaveAlert } from "./WaveAlert";
import UpperTerminal from "./UpperTerminal";
import { useEffect, useRef } from "react";
import Player from "./Player";
import { BulletCanvas } from "./BulletCanvas";
import { useTurretHotkeys } from "../hooks/useTurretHotkeys";
import desertBackground from "../assets/Fields/Desert/desert.png";

export function Arena() {
  const { enemies, abilityActive, status } = useGameStore();
  const updatePlayerPosition = useGameStore((state) => state.updatePlayerPos);

  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useTurretHotkeys();

  const mousePos = useRef({ x: 50, y: 80 });
  const currentPos = useRef({ x: 50, y: 80 });

  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = arena.getBoundingClientRect();
      let xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      let yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      // Limits player position within arena
      mousePos.current.x = Math.max(3, Math.min(97, xPercent));
      mousePos.current.y = Math.max(79, Math.min(85, yPercent));
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        useGameStore.getState().setFiring(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        useGameStore.getState().setFiring(false);
      }
    };

    const handleMouseLeave = () => {
      useGameStore.getState().setFiring(false);
    };

    // Smooth player movement
    let animationFrameId: number;

    const updateLoop = () => {
      if (playerRef.current) {
        // The lower the ease value, the faster the player moves
        const ease = 0.18;

        currentPos.current.x +=
          (mousePos.current.x - currentPos.current.x) * ease;
        currentPos.current.y +=
          (mousePos.current.y - currentPos.current.y) * ease;

        // Apply raw 3D hardware translation (Forces GPU execution, zero lag)
        playerRef.current.style.transform = `translate3d(${currentPos.current.x}vw, ${currentPos.current.y}h, 0) translate(-50%, -50%)`;

        // Alternative percentage fallback
        playerRef.current.style.left = `${currentPos.current.x}%`;
        playerRef.current.style.top = `${currentPos.current.y}%`;

        updatePlayerPosition(currentPos.current.x, currentPos.current.y);
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    arena.addEventListener("mousemove", handleMouseMove, { passive: true });
    arena.addEventListener("mousedown", handleMouseDown, { passive: true });
    arena.addEventListener("mouseup", handleMouseUp, { passive: true });
    arena.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => {
      arena.removeEventListener("mousemove", handleMouseMove);
      arena.removeEventListener("mousedown", handleMouseDown);
      arena.removeEventListener("mouseup", handleMouseUp);
      arena.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [updatePlayerPosition]);

  return (
    <div
      ref={arenaRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden"
      style={status === "PLAYING" ? { cursor: "none" } : { cursor: "default" }}
    >
      <Battlefield />

      <UpperTerminal />

      <WaveAlert />

      <BulletCanvas />

      <AnimatePresence>
        {enemies.map((enemy) => (
          <EnemyUnit key={enemy.id} enemy={enemy} />
        ))}
      </AnimatePresence>
      {abilityActive.find((a) => a === "NAPALM") && (
        <div className="napalm-overlay">
          <div className="fire-glow" />
        </div>
      )}

      <div
        ref={playerRef}
        className="absolute w-30 h-30 z-30 pointer-events-none will-change-[left,top]"
        style={{ left: "50%", top: "80%", transform: "translate(-50%, -50%)" }}
      >
        <Player />
      </div>

      <BaseWall />
      <CommandCenter />
    </div>
  );
}

const Battlefield = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${desertBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.4) saturate(0.85) contrast(1.15)",
          transform: "scale(1.05)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(40,18,6,.12), rgba(15,8,2,.45))",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="absolute top-[68%] inset-x-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
          height: "90px",
          transform: "translateY(16px)",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 30%,
              rgba(0,0,0,0.3) 60%,
              rgba(0,0,0,0.9) 100%
            )
          `,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};
