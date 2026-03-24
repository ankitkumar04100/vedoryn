"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ================================================
   Detect Theme (Dark / Light)
=================================================== */
function useIsDarkMode() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/* ================================================
   ROYAL NEBULA PARTICLES (Ultra Unique)
=================================================== */
function RoyalParticles({ count = 300, isDark }: { count: number; isDark: boolean }) {
  const mesh = useRef<THREE.Points>(null);

  const palette = isDark
    ? [
        [0.9, 0.7, 1.0], // neon lavender
        [0.5, 1.0, 0.9], // neon aqua
        [1.0, 0.6, 0.8], // vivid rose
        [1.0, 0.8, 0.5], // golden amber
        [0.65, 1.0, 0.75], // lime glow
      ]
    : [
        [0.55, 0.35, 0.95], // deep purple
        [0.25, 0.75, 0.75], // teal
        [0.95, 0.45, 0.65], // magenta
        [0.95, 0.6, 0.25], // warm orange
        [0.3, 0.75, 0.45], // jade green
      ];

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Vortex distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 12;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      siz[i] = Math.random() * 2.2 + 0.8;
    }

    return [pos, col, siz];
  }, [count, isDark]);

  useFrame((state) => {
    if (!mesh.current) return;

    const t = state.clock.elapsedTime;
    const arr = mesh.current.geometry.attributes.position.array as Float32Array;

    // Spiral flow
    for (let i = 0; i < count; i++) {
      const x = arr[i * 3];
      const z = arr[i * 3 + 2];
      const angle = Math.atan2(z, x) + 0.0006;

      const radius = Math.sqrt(x * x + z * z);

      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 2] = Math.sin(angle) * radius;

      // Gentle vertical float
      arr[i * 3 + 1] += Math.sin(t * 0.6 + i) * 0.002;
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>

      <pointsMaterial
        size={0.07}
        vertexColors
        transparent
        opacity={isDark ? 0.9 : 0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ================================================
   ENERGY ORBS (ROYAL FLOATING SPHERES)
=================================================== */
function EnergyOrb({
  color,
  position,
  index,
  scale,
  speed,
}: {
  color: string;
  position: [number, number, number];
  index: number;
  scale: number;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.elapsedTime * speed;

    ref.current.position.y = position[1] + Math.sin(t + index) * 0.6;
    ref.current.position.x = position[0] + Math.cos(t * 0.8 + index) * 0.5;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.35}
        roughness={0.2}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function EnergyOrbs({ isDark }: { isDark: boolean }) {
  const colors = isDark
    ? ["#c084fc", "#5eead4", "#fb7185", "#fbbf24", "#4ade80"]
    : ["#8b5cf6", "#14b8a6", "#ec4899", "#f97316", "#22c55e"];

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        color: colors[i],
        position: [
          Math.sin(i * 1.3) * 3.5,
          Math.cos(i * 0.9) * 2,
          Math.sin(i * 0.6) * 3 - 2,
        ] as [number, number, number],
        index: i,
        scale: 0.5 + Math.random() * 0.5,
        speed: 0.3 + Math.random() * 0.4,
      })),
    [isDark]
  );

  return (
    <>
      {orbs.map((orb) => (
        <EnergyOrb key={orb.index} {...orb} />
      ))}
    </>
  );
}

/* ================================================
   MAIN EXPORT — ROYAL NEBULA SYSTEM
=================================================== */
export function ParticleField() {
  const isDark = useIsDarkMode();

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Soft ambient fill */}
        <ambientLight intensity={isDark ? 0.3 : 0.15} />

        {/* Royal Nebula Fog */}
        <fog
          attach="fog"
          args={[
            isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.5)",
            6,
            20,
          ]}
        />

        {/* Particles */}
        <RoyalParticles count={300} isDark={isDark} />

        {/* Royal Energy Orbs */}
        <EnergyOrbs isDark={isDark} />

        {/* Background transparent */}
        <color attach="background" args={["transparent"]} />
      </Canvas>
    </div>
  );
}
