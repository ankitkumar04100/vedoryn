"use client";

import { useEffect, useRef } from "react";

/* ===========================================================
   Detect Tailwind Dark Mode (auto-reactive)
=========================================================== */
function useIsDarkMode() {
  return document.documentElement.classList.contains("dark");
}

/* ===========================================================
   MAIN EXPORT
=========================================================== */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isDark = useIsDarkMode();
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    /* ===========================================================
       PARTICLE SYSTEM CONFIG
    ============================================================ */
    const particleCount = width < 768 ? 45 : 110; // mobile optimized
    const orbsCount = 4;

    const goldLight = isDark ? "#fef3c7" : "#fbbf24"; // soft gold
    const goldDark = isDark ? "#facc15" : "#d97706"; // deep royal gold
    const shimmerColor = isDark ? "#fff7c2" : "#ffebb6"; // rare shimmer

    const particles = [];
    const orbs = [];

    /* ===========================================================
       CREATE PARTICLES
    ============================================================ */
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 3, // depth layer
        size: Math.random() * 2.2 + 0.4,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.6 + 0.25,
      });
    }

    /* ===========================================================
       CREATE ORBS (soft glowing circles)
    ============================================================ */
    for (let i = 0; i < orbsCount; i++) {
      orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 80 + 40,
        speed: Math.random() * 0.3 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    /* ===========================================================
       MOUSE INTERACTION
    ============================================================ */
    const mouse = { x: width / 2, y: height / 2 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    /* ===========================================================
       MAIN ANIMATION LOOP
    ============================================================ */
    function animate() {
      ctx.clearRect(0, 0, width, height);

      /* ==== VIGNETTE BACKDROP ==== */
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.7
      );
      gradient.addColorStop(0, isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)");
      gradient.addColorStop(1, isDark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      /* ==== SOFT BREATHING AURORA GLOW ==== */
      const pulse = (Math.sin(Date.now() / 6000) + 1) / 10 + 0.15;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = isDark ? "#facc15" : "#fbbf24";
      ctx.fillRect(0, 0, width, height * 0.15);
      ctx.globalAlpha = 1;

      /* ==== DRAW ORBS ==== */
      orbs.forEach((o, i) => {
        o.phase += o.speed / 30;
        o.x += Math.cos(o.phase) * 0.4;
        o.y += Math.sin(o.phase) * 0.4;

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? "rgba(250, 204, 21, 0.05)" 
          : "rgba(251, 191, 36, 0.06)";
        ctx.fill();
      });

      /* ==== PARTICLES ==== */
      particles.forEach((p) => {
        p.y -= p.speed * (p.z + 0.5);

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx / dist;
          p.y += dy / dist;
        }

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() < 0.002 
          ? shimmerColor 
          : (p.z > 2 ? goldDark : goldLight);
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    animate();

    /* ===========================================================
       HANDLE RESIZE
    ============================================================ */
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="
        absolute inset-0 
        w-full h-full
        pointer-events-none 
        -z-10
      "
    />
  );
}
