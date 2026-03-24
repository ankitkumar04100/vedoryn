"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -----------------------------------------------------------
   HELPER: DETECT TAILWIND DARK MODE
----------------------------------------------------------- */
function useIsDarkMode() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/* -----------------------------------------------------------
   PARTICLES (THEME-AWARE COLORS)
----------------------------------------------------------- */
function Particles({ count = 260, isDark }: { count: number; isDark: boolean }) {
  const mesh = useRef<THREE.Points>(null);

  const palette = isDark
    ? [
        [0.75, 0.52, 1.0], // bright purple
        [0.36, 0.95, 0.88], // bright cyan
        [1.0, 0.55, 0.7], // pink
        [1.0, 0.65, 0.35], // neon orange
        [0.45, 1.0, 0.6], // neon green
      ]
    : [
        [0.6, 0.4, 1.0], // primary purple
        [0.2, 0.8, 0.7], // cyan
        [1.0, 0.4, 0.6], // pink
        [1.0, 0.6, 0.2], // orange
        [0.3, 0.8, 0.4], // green
      ];

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      siz[i] = Math.random() * 3 + 0.7;
    }

    return [pos, col, siz];
  }, [count, isDark]);

  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.elapsedTime;
    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(time * 0.3 + i * 0.2) * 0.002;
      arr[i * 3] += Math.cos(time * 0.25 + i * 0.1) * 0.0015;
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
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* -----------------------------------------------------------
   FLOATING NEON ORBS (ADAPT TO THEME)
----------------------------------------------------------- */
function FloatingOrb({
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

    ref.current.position.y = position[1] + Math.sin(t + index) * 0.5;
    ref.current.position.x = position[0] + Math.cos(t * 0.8 + index) * 0.35;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} />
    </mesh>
  );
}

function FloatingOrbs({ isDark }: { isDark: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const colors = isDark
    ? ["#a855f740", "#2dd4bf40", "#fb718540", "#fb923c40", "#4ade8040"]
    : ["#7c3aed30", "#14b8a630", "#ec489930", "#f9731630", "#22c55e30"];

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          Math.sin(i * 1.2) * 4,
          Math.cos(i * 0.8) * 2,
          Math.sin(i * 0.5) * 3 - 2,
        ] as [number, number, number],
        color: colors[i],
        scale: 0.35 + Math.random() * 0.35,
        speed: 0.3 + Math.random() * 0.4,
        index: i,
      })),
    [isDark]
  );

  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <FloatingOrb key={orb.index} {...orb} />
      ))}
    </group>
  );
}

/* -----------------------------------------------------------
   MAIN EXPORT — FULL PREMIUM BACKGROUND
   (THEME AWARE + NO BUGS + NO FLASH)
----------------------------------------------------------- */
export function ParticleField() {
  const isDark = useIsDarkMode();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        {/* Depth fog theme-adaptive */}
        <fog
          attach="fog"
          args={[isDark ? "#000000" : "#ffffff", 6, 18]}
        />

        {/* Particles */}
        <Particles count={260} isDark={isDark} />

        {/* Floating Orbs */}
        <FloatingOrbs isDark={isDark} />

        {/* Transparent BG (Canvas inherits page color) */}
        <color attach="background" args={["transparent"]} />
      </Canvas>
    </div>
  );
}
