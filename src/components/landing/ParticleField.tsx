"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/components/ThemeToggle"; // OPTIONAL — if you have theme context

/* -----------------------------------------------------------
   PREMIUM PARTICLES WITH THEME-AWARE COLORS & GLOW EFFECT
----------------------------------------------------------- */

function Particles({ count = 260, darkMode = false }) {
  const mesh = useRef<THREE.Points>(null);

  const paletteLight = [
    new THREE.Color("#7c3aed"), // purple
    new THREE.Color("#14b8a6"), // cyan
    new THREE.Color("#ec4899"), // pink
    new THREE.Color("#f97316"), // orange
    new THREE.Color("#22c55e"), // green
  ];

  const paletteDark = [
    new THREE.Color("#c084fc"), // brighter purple
    new THREE.Color("#5eead4"), // bright cyan
    new THREE.Color("#fb7185"), // bright rose
    new THREE.Color("#fb923c"), // neon orange
    new THREE.Color("#4ade80"), // neon green
  ];

  const palette = darkMode ? paletteDark : paletteLight;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = Math.random() * 2 + 0.7;
    }
    return [pos, col, siz];
  }, [count, darkMode]);

  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.elapsedTime;
    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(time * 0.35 + i * 0.2) * 0.003;
      arr[i * 3] += Math.cos(time * 0.25 + i * 0.15) * 0.002;
    }
    posAttr.needsUpdate = true;

    mesh.current.rotation.y = time * 0.03;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -----------------------------------------------------------
   FLOATING ORBS (NEON GLOW + PARALLAX MOTION)
----------------------------------------------------------- */

function FloatingOrbs({ darkMode }: { darkMode: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  const glowColorsLight = ["#7c3aed40", "#14b8a640", "#ec489940", "#f9731640", "#22c55e40"];
  const glowColorsDark = ["#a855f740", "#2dd4bf40", "#fb718540", "#fb923c40", "#4ade8040"];
  const chosenColors = darkMode ? glowColorsDark : glowColorsLight;

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          Math.sin(i * 1.4) * 4,
          Math.cos(i * 0.9) * 2,
          Math.sin(i * 0.7) * 3 - 2,
        ] as [number, number, number],
        color: chosenColors[i],
        scale: 0.4 + Math.random() * 0.35,
        speed: 0.25 + Math.random() * 0.35,
      })),
    [darkMode]
  );

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <GlowOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function GlowOrb({
  position,
  color,
  scale,
  speed,
  index,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(t + index) * 0.45;
    ref.current.position.x = position[0] + Math.cos(t * 0.7 + index) * 0.35;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

/* -----------------------------------------------------------
   MAIN EXPORT — FULL THEME-AWARE PARTICLE SYSTEM
----------------------------------------------------------- */

export function ParticleField() {
  // If you have theme toggle context:
  let theme = document.documentElement.classList.contains("dark");
  const isDark = theme === true;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 62 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        {/* BEAUTIFUL FOG DEPTH */}
        <fog attach="fog" args={[isDark ? "#0b0b0d" : "#ffffff", 6, 18]} />

        {/* PARTICLES */}
        <Particles count={260} darkMode={isDark} />

        {/* FLOATING NEON ORBS */}
        <FloatingOrbs darkMode={isDark} />

        {/* SOFT DARK/LIGHT BACKGROUND TINT */}
        <color
          attach="background"
          args={[isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)"]}
        />
      </Canvas>
    </div>
  );
}
