import React, { useRef, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

export const BulletCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to window size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    // Canvas render loop
    const renderLoop = () => {
      // Clear last frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { bullets, selectedTurretType } = useGameStore.getState();

      bullets.forEach((bullet) => {
        const pixelX = (bullet.x / 100) * canvas.width;
        const pixelY = (bullet.y / 100) * canvas.height;

        ctx.save();

        // Bullet Styling (Standard Bullet)
        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
        ctx.shadowBlur = 3;
        ctx.shadowOffsetY = 2;

        let bulletWidth = 4;
        let bulletHeight = 8;
        let colorStart = "#d97706";
        let colorEnd = "#78350f";

        if (selectedTurretType === "ROCKET") {
          bulletWidth = 6;
          bulletHeight = 14;
          colorStart = "#64748b";
          colorEnd = "#334155";
        } else if (selectedTurretType === "SNIPER") {
          bulletWidth = 3;
          bulletHeight = 16;
          colorStart = "#f59e0b";
          colorEnd = "#b45309";
        }

        // Bullet gradient for metalic look
        const gradient = ctx.createLinearGradient(
          pixelX - bulletWidth / 2,
          pixelY,
          pixelX + bulletWidth / 2,
          pixelY,
        );
        gradient.addColorStop(0, colorEnd);
        gradient.addColorStop(0.3, colorStart);
        gradient.addColorStop(1, colorEnd);
        ctx.fillStyle = gradient;

        // Draw bullet
        ctx.beginPath();
        ctx.moveTo(pixelX - bulletWidth / 2, pixelY + bulletHeight / 2);
        ctx.lineTo(pixelX - bulletWidth / 2, pixelY - bulletHeight / 4);
        ctx.quadraticCurveTo(
          pixelX - bulletWidth / 2,
          pixelY - bulletHeight / 2,
          pixelX,
          pixelY - bulletHeight / 2,
        );
        ctx.quadraticCurveTo(
          pixelX + bulletWidth / 2,
          pixelY - bulletHeight / 4,
          pixelX + bulletWidth / 2,
          pixelY - bulletHeight / 4,
        );
        ctx.lineTo(pixelX + bulletWidth / 2, pixelY + bulletHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
};
