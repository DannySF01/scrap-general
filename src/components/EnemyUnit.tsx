import { useEffect, useRef } from "react";
import { REGISTRY } from "../data/registry";
import type { Enemy } from "../types/game";

export function EnemyUnit({ enemy }: { enemy: Enemy }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hpBarContainerRef = useRef<HTMLDivElement>(null);
  const hpBarRef = useRef<HTMLDivElement>(null);
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const isDying = useRef<boolean>(false);

  const config = REGISTRY.ENEMIES[enemy.type];

  const now = Date.now();
  const isStunned = enemy.stunnedAt && now < enemy.stunnedAt + 5000; // 5 seconds stun duration
  const isCorroded = enemy.meltedAt && now < enemy.meltedAt + 4000; // 4 seconds acid duration

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const parentArena = el.parentElement;
    if (parentArena && !isDying.current) {
      const pixelX = (enemy.position.x / 100) * parentArena.clientWidth;
      const pixelY = (enemy.position.y / 100) * parentArena.clientHeight;

      el.style.transform = `translate3d(${pixelX}px, ${pixelY}px, 0) translate(-50%, -50%)`;
    }

    // Show the unit's health bar when damaged
    if (hpBarRef.current && hpBarContainerRef.current && !isDying.current) {
      const hpPercent = Math.max(
        0,
        Math.min(100, (enemy.hp / enemy.maxHp) * 100),
      );
      hpBarRef.current.style.width = `${hpPercent}%`;
      hpBarContainerRef.current.style.opacity =
        enemy.hp < enemy.maxHp ? "1" : "0";
    }

    // Apply damaging visual effects
    if (iconWrapperRef.current && !isDying.current) {
      if (isStunned) {
        iconWrapperRef.current.className =
          "transition-all duration-200 flex items-center justify-center w-full h-auto shrink-0 brightness-[1.3] contrast-[1.1] saturate-[0.2] text-cyan-500 animate-pulse";
      } else if (isCorroded) {
        iconWrapperRef.current.className =
          "transition-all duration-200 flex items-center justify-center w-full h-auto shrink-0 brightness-[1.15] contrast-[1.3] saturate-[1.3] text-emerald-300 hue-rotate-180";
      } else {
        iconWrapperRef.current.className =
          "transition-all duration-200 flex items-center justify-center w-full h-auto shrink-0 brightness-[1] contrast-[1] saturate-[1]";
      }
    }

    // Death animation
    if (enemy.hp <= 0 && !isDying.current) {
      isDying.current = true;

      if (hpBarContainerRef.current)
        hpBarContainerRef.current.style.opacity = "0";
      if (iconWrapperRef.current) iconWrapperRef.current.style.opacity = "0";

      for (let i = 0; i < 5; i++) {
        const spark = document.createElement("div");
        const angle = (i / 5) * Math.PI * 2;
        const velocity = Math.random() * 30 + 20;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const size = Math.random() * 2.5 + 1.5;

        spark.className =
          "absolute bg-amber-500 rounded-full pointer-events-none z-30";
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.boxShadow = "0 0 3px #f59e0b";
        spark.style.left = "50%";
        spark.style.top = "50%";

        spark.style.transition =
          "transform 1.5s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 1.5s ease-out";
        spark.style.transform = "translate3d(-50%, -50%, 0) scale(1)";

        el.appendChild(spark);

        requestAnimationFrame(() => {
          spark.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) scale(0.1)`;
          spark.style.opacity = "0";
        });
      }
    }
  }, [enemy.position.x, enemy.position.y, enemy.hp, enemy.maxHp]);

  return (
    <div
      ref={containerRef}
      className="absolute will-change-transform flex flex-col items-center justify-center select-none pointer-events-none z-10"
      style={{
        left: "0px",
        top: "0px",
        transform: "translate3d(0px, 0px, 0) translate(-50%, -50%)",
      }}
    >
      <div
        ref={hpBarContainerRef}
        className="w-4 h-[1.5px] bg-slate-950/60 mb-1 rounded-full overflow-hidden opacity-0 transition-opacity duration-150 shrink-0"
      >
        <div
          ref={hpBarRef}
          className="bg-red-500 h-full"
          style={{ width: "100%" }}
        />
      </div>

      <div
        ref={iconWrapperRef}
        className="transition-all duration-200 flex items-center justify-center w-full h-auto shrink-0 relative"
      >
        <img
          src={enemy.icon}
          alt={enemy.type}
          style={{ width: `${config.size}px`, height: "auto" }}
          className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] object-contain"
        />

        {isStunned && (
          <div className="absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] border border-white z-20" />
        )}
      </div>
    </div>
  );
}
