"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -----------------------------------------------------------
   DETECT TAILWIND DARK MODE SAFELY
----------------------------------------------------------- */
function useIsDarkMode() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/* -----------------------------------------------------------
   PARTICLES — THEME AWARE & ALWAYS CLEAR
----------------------------------------------------------- */
function Particles({ count = 260, isDark }: { count: number; isDark: boolean }) {
  const mesh = useRef<THREE.Points>(null);

  const palette = isDark
    ? [
        [0.85, 0.65, 1.0], // brighter purple
        [0.45, 1.0, 0.92], // bright cyan
        [1.0, 0.60, 0.78], // bright pink
        [1.0, 0.70, 0.40], // neon orange
        [0.55, 1.0, 0.70], // neon green
      ]
    : [
        [0.45, 0.30, 0.95], // deeper purple (avoids white fade)
        [0.15, 0.70, 0.65], // deep cyan
        [0.90, 0.35, 0.55], // deep pink
        [0.95, 0.55, 0.10], // orange (visible on white)
        [0.25, 0.70, 0.35], // green (visible on white)
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

      siz[i] = Math.random() * 2.4 + 0.8;
    }

    return [pos, col, siz];
  }, [count, isDark]);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime;
    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.2) * 0.0025;
      arr[i * 3] += Math.cos(t * 0.25 + i * 0.1) * 0.0012;
    }

    posAttr.needsUpdate = true;

    mesh.current.rotation.y = t * 0.035;
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
        opacity={isDark ? 0.9 : 0.75} // Dark mode brighter, light mode softer
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* -----------------------------------------------------------
   FLOATING ORBS — NOW CLEAR IN BOTH THEMES
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

    ref.current.position.y = position[1] + Math.sin(t + index) * 0.45;
    ref.current.position.x = position[0] + Math.cos(t * 0.75 + index) * 0.35;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.30} />
    </mesh>
  );
}

function FloatingOrbs({ isDark }: { isDark: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const orbColors = isDark
    ? [
        "#c084fc40", // brighter purple
        "#5eead440", // teal
        "#fb718540", // rose
        "#fb923c40", // orange
        "#4ade8040", // lime
      ]
    : [
        "#7c3aed25", // purple soft
        "#14b8a625", // cyan soft
        "#ec489925", // pink soft
        "#f9731625", // orange soft
        "#22c55e25", // green soft
      ];

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          Math.sin(i * 1.2) * 4,
          Math.cos(i * 0.8) * 2,
          Math.sin(i * 0.5) * 3 - 2,
        ] as [number, number, number],
        color: orbColors[i],
        scale: 0.38 + Math.random() * 0.32,
        speed: 0.28 + Math.random() * 0.42,
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
   FINAL EXPORT — PERFECT DAY/NIGHT MODE BACKGROUND
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
        {/* Fog — now subtle and theme-correct */}
        <fog
          attach="fog"
          args={[
            isDark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.4)",
            7,
            18,
          ]}
        />

        <Particles count={260} isDark={isDark} />

        <FloatingOrbs isDark={isDark} />

        <color attach="background" args={["transparent"]} />
      </Canvas>
    </div>
  );
}
