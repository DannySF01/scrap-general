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
  const Icon = config.icon;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

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

    // Dead animation
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
          "transform 500ms cubic-bezier(0.1, 0.8, 0.3, 1), opacity 500ms ease-out";
        spark.style.transform = "translate3d(-50%, -50%, 0) scale(1)";

        el.appendChild(spark);

        requestAnimationFrame(() => {
          spark.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) scale(0.1)`;
          spark.style.opacity = "0";
        });
      }
    }
  }, [enemy.hp, enemy.maxHp]);

  return (
    <div
      ref={containerRef}
      className="absolute will-change-[left,top] flex flex-col items-center select-none pointer-events-none z-10 transition-[left,top] duration-75"
      style={{
        left: `${enemy.position.x}%`,
        top: `${enemy.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        ref={hpBarContainerRef}
        className="w-4 h-[1.5px] bg-slate-950/60 mb-0.5 rounded-full overflow-hidden opacity-0 transition-opacity duration-150"
      >
        <div
          ref={hpBarRef}
          className="bg-red-500 h-full"
          style={{ width: "100%" }}
        />
      </div>

      <div
        ref={iconWrapperRef}
        style={{ color: config.color }}
        className="transition-opacity duration-100"
      >
        <Icon size={config.size} className="opacity-90" />
      </div>
    </div>
  );
}
