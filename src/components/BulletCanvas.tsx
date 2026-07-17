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

        // Bullet rotation
        const angle = bullet.dirX
          ? Math.atan2(bullet.dirY, bullet.dirX) + Math.PI / 2
          : 0;
        ctx.translate(pixelX, pixelY);
        ctx.rotate(angle);

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

        // Bullet muzzle flash
        if (bullet.y >= 77) {
          ctx.save();

          ctx.beginPath();
          ctx.arc(0, bulletHeight / 2, bulletWidth * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#f59e0b";
          ctx.filter = "blur(3px)";
          ctx.fill();

          // Bullet sparks
          ctx.strokeStyle = "#fed7aa";
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, bulletHeight / 2);
            // Spits sparks slightly forward and out
            ctx.lineTo((i - 1) * 8, -bulletHeight);
            ctx.stroke();
          }
          ctx.restore();
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
        ctx.moveTo(-bulletWidth / 2, bulletHeight / 2);
        ctx.lineTo(-bulletWidth / 2, -bulletHeight / 4);
        ctx.quadraticCurveTo(
          -bulletWidth / 2,
          -bulletHeight / 2,
          0,
          -bulletHeight / 2,
        );
        ctx.quadraticCurveTo(
          bulletWidth / 2,
          -bulletHeight / 4,
          bulletWidth / 2,
          -bulletHeight / 4,
        );
        ctx.lineTo(bulletWidth / 2, bulletHeight / 2);
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
