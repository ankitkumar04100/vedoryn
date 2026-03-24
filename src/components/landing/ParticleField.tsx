"use client";
import { useEffect, useRef } from "react";

/* -----------------------------------------------------------
   0. Helper — Detect Tailwind Dark Mode Live
----------------------------------------------------------- */
function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

/* -----------------------------------------------------------
   1. Utility Functions for Math / Randomness
----------------------------------------------------------- */

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randFloat() {
  return Math.random();
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/*  
=====================================================================
                2. MAIN PARTICLE FIELD COMPONENT
=====================================================================
*/

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    /* -----------------------------------------------------------
       CANVAS SETUP
    ----------------------------------------------------------- */
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true })!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    /* -----------------------------------------------------------
       THEME COLORS (Gold Royal System)
    ----------------------------------------------------------- */

    const colors = {
      goldBright: "#FFD700",
      goldSoft: "#FFC857",
      amberGlow: "rgba(255,186,73,0.4)",
      sparkWhite: "rgba(255,255,255,0.9)",

      bgDark: "rgb(0,0,0)",
      bgLight: "rgb(245,245,245)",

      vignetteDark: "rgba(0,0,0,0.9)",
      vignetteLight: "rgba(255,255,255,0.5)",
    };

    /* -----------------------------------------------------------
       PARTICLE COUNTS (responsive)
    ----------------------------------------------------------- */

    const isMobile = width < 768;

    const PARTICLES = isMobile ? 45 : 110;
    const ORBS = isMobile ? 2 : 5;
    const SPARK_LINES = isMobile ? 1 : 3;

    /* -----------------------------------------------------------
       MOUSE STATE
    ----------------------------------------------------------- */
    const mouse = {
      x: width / 2,
      y: height / 2,
      active: false,
    };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    /* -----------------------------------------------------------
       PARALLAX SCROLL STATE
    ----------------------------------------------------------- */
    let scrollY = 0;
    window.addEventListener("scroll", () => {
      scrollY = window.scrollY;
    });

    /* -----------------------------------------------------------
       CREATE PARTICLES (Layer 1 — Ambient Gold Dust)
    ----------------------------------------------------------- */
    class GoldParticle {
      x: number;
      y: number;
      z: number;
      speed: number;
      size: number;
      opacity: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = rand(0, width);
        this.y = rand(0, height);
        this.z = rand(0.3, 1.8); // depth layer
        this.speed = rand(0.2, 0.7) * this.z;
        this.size = rand(0.8, 2.3) * this.z;
        this.opacity = rand(0.2, 0.7);
      }

      move() {
        this.y -= this.speed;

        if (this.y < -20) {
          this.x = rand(0, width);
          this.y = height + rand(5, 20);
        }

        // Soft mouse repulsion
        if (mouse.active) {
          const dist = distance(this.x, this.y, mouse.x, mouse.y);
          if (dist < 120) {
            this.x += (this.x - mouse.x) * 0.02;
            this.y += (this.y - mouse.y) * 0.02;
          }
        }

        // Parallax on scroll
        this.x += (scrollY * this.z * 0.00005);
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle =
          Math.random() < 0.002
            ? colors.sparkWhite // rare shimmer
            : isDarkMode()
            ? `rgba(255,215,0,${this.opacity})`
            : `rgba(230,170,50,${this.opacity})`;

        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: GoldParticle[] = [];
    for (let i = 0; i < PARTICLES; i++) {
      particles.push(new GoldParticle());
    }

    /* -----------------------------------------------------------
       GLOW ORBS (Layer 2)
    ----------------------------------------------------------- */
    class GlowOrb {
      x: number;
      y: number;
      radius: number;
      speed: number;
      phase: number;

      constructor() {
        this.x = rand(0, width);
        this.y = rand(0, height);
        this.radius = rand(50, 120);
        this.speed = rand(0.05, 0.15);
        this.phase = rand(0, Math.PI * 2);
      }

      move() {
        this.phase += this.speed / 20;
        this.x += Math.cos(this.phase) * 0.3;
        this.y += Math.sin(this.phase) * 0.3;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );

        const color = isDarkMode()
          ? "rgba(255,215,0,0.2)"
          : "rgba(255,180,50,0.25)";

        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const orbs: GlowOrb[] = [];
    for (let i = 0; i < ORBS; i++) orbs.push(new GlowOrb());

    /* -----------------------------------------------------------
       ENERGY LINES (Layer 3 — rare AI network lines)
    ----------------------------------------------------------- */

    class EnergyLine {
      start: { x: number; y: number };
      end: { x: number; y: number };
      alpha: number;
      decay: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.start = {
          x: rand(0, width),
          y: rand(0, height),
        };
        this.end = {
          x: rand(0, width),
          y: rand(0, height),
        };
        this.alpha = rand(0.3, 0.8);
        this.decay = rand(0.005, 0.01);
      }

      draw() {
        this.alpha -= this.decay;
        if (this.alpha <= 0) this.reset();

        ctx.strokeStyle = isDarkMode()
          ? `rgba(255,215,0,${this.alpha})`
          : `rgba(200,150,40,${this.alpha})`;

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
      }
    }

    const energyLines: EnergyLine[] = [];
    for (let i = 0; i < SPARK_LINES; i++) energyLines.push(new EnergyLine());

    /* -----------------------------------------------------------
       GOLD LIGHT STREAK (rare reflection)
    ----------------------------------------------------------- */
    let streakX = -200;
    let streakVisible = false;
    let streakTimer = 0;

    function drawGoldStreak() {
      if (!streakVisible && Math.random() < 0.0005) {
        streakVisible = true;
        streakX = -200;
        streakTimer = 120;
      }

      if (streakVisible) {
        streakX += 6;

        const gradient = ctx.createLinearGradient(
          streakX - 80,
          height * 0.4,
          streakX + 80,
          height * 0.6
        );

        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, isDarkMode() ? "#FFD70088" : "#F2B54499");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(streakX - 100, 0, 200, height);

        streakTimer--;
        if (streakTimer <= 0) streakVisible = false;
      }
    }

    /* -----------------------------------------------------------
       BACKGROUND EFFECTS — VIGNETTE + CENTER GLOW
    ----------------------------------------------------------- */

    function drawVignette() {
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.1,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );

      vignette.addColorStop(
        0,
        isDarkMode()
          ? "rgba(255,215,0,0.10)"
          : "rgba(255,180,60,0.07)"
      );

      vignette.addColorStop(
        1,
        isDarkMode()
          ? "rgba(0,0,0,0.95)"
          : "rgba(255,255,255,0.5)"
      );

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    }

    /* -----------------------------------------------------------
       MAIN ANIMATION LOOP — 60 FPS
    ----------------------------------------------------------- */

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Background
      drawVignette();

      // Glow orbs
      orbs.forEach((o) => {
        o.move();
        o.draw();
      });

      // Gold particles
      particles.forEach((p) => {
        p.move();
        p.draw();
      });

      // Rare AI energy lines
      energyLines.forEach((line) => line.draw());

      // Rare gold streak
      drawGoldStreak();

      requestAnimationFrame(animate);
    }

    animate();

    /* -----------------------------------------------------------
       RESIZE HANDLER
    ----------------------------------------------------------- */
    function onResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* -----------------------------------------------------------
     CANVAS RETURN
  ----------------------------------------------------------- */
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
