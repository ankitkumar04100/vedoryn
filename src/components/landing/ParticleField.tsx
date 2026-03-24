"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";

/* =========================================================================
   1. Detect Tailwind Dark Mode (Real-time reactive)
=========================================================================== */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* =========================================================================
   2. Royal Aurora Shader Material (GLSL)
=========================================================================== */

class AuroraMaterial extends THREE.ShaderMaterial {
  constructor(isDark: boolean) {
    const darkColor1 = new THREE.Color("#8b5cf6"); // purple
    const darkColor2 = new THREE.Color("#fbbf24"); // gold

    const lightColor1 = new THREE.Color("#6d28d9");
    const lightColor2 = new THREE.Color("#fb923c");

    super({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: isDark ? darkColor1 : lightColor1 },
        uColor2: { value: isDark ? darkColor2 : lightColor2 },
        uStrength: { value: isDark ? 1.25 : 0.85 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 transformed = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uStrength;

        varying vec2 vUv;

        void main() {
          float wave = sin(vUv.x * 8.0 + uTime * 0.9) * 0.25 +
                       cos(vUv.y * 5.0 + uTime * 1.5) * 0.25;

          float blend = smoothstep(0.0, 1.0, vUv.y + wave);

          vec3 color = mix(uColor1, uColor2, blend) * uStrength;

          float alpha = blend * 0.85;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false
    });
  }
}

extend({ AuroraMaterial });

/* =========================================================================
   3. Aurora Background Plane
=========================================================================== */
function AuroraPlane({ isDark }: { isDark: boolean }) {
  const mat = useRef<any>();

  useFrame(({ clock }) => {
    if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -6]} scale={[18, 10, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      {/* @ts-ignore */}
      <auroraMaterial ref={mat} args={[isDark]} />
    </mesh>
  );
}

/* =========================================================================
   4. Royal Dust Particles (Gold ambient layer)
=========================================================================== */
function GoldDust({ isDark }: { isDark: boolean }) {
  const count = typeof window !== "undefined" && window.innerWidth < 768 ? 50 : 110;

  const mesh = useRef<THREE.Points>(null);

  const { positions, speeds, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const size = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      spd[i] = Math.random() * 0.002 + 0.001;
      size[i] = Math.random() * 1.2 + 0.4;
    }

    return { positions: pos, speeds: spd, sizes: size };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!mesh.current) return;
    const arr = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5 - Math.random() * 2;

      // Soft mouse repulsion
      const dx = arr[i * 3] - state.pointer.x * 5;
      const dy = arr[i * 3 + 1] - state.pointer.y * 3;
      const dist = dx * dx + dy * dy;

      if (dist < 1.2) {
        arr[i * 3] += dx * 0.02;
        arr[i * 3 + 1] += dy * 0.02;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={isDark ? "#fcd34d" : "#fbbf24"}
        transparent
        opacity={isDark ? 0.9 : 0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* =========================================================================
   5. Royal Glow Orbs (Medium layer)
=========================================================================== */
function GlowOrbs({ isDark }: { isDark: boolean }) {
  const orbCount = 5;
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = clock.elapsedTime * (0.25 + i * 0.05);
      m.position.y = Math.sin(t + i) * 1.2;
      m.position.x = Math.cos(t * 0.6 + i) * 1.5;
      m.material.opacity = (Math.sin(t * 0.8 + i) + 1) / 4 + 0.2;
    });
  });

  const colors = isDark
    ? ["#facc15", "#fbbf24", "#fde047", "#fef08a", "#eab308"]
    : ["#f59e0b", "#fbbf24", "#fcd34d", "#fef08a", "#f97316"];

  return (
    <>
      {Array.from({ length: orbCount }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el!)}
          position={[Math.sin(i) * 3, Math.cos(i) * 2, -2]}
          scale={[0.9, 0.9, 0.9]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            transparent
            color={colors[i]}
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

/* =========================================================================
   6. AI Gold Connection Lines (rare, intelligent movement)
=========================================================================== */
function AIConnectionLines({ isDark }: { isDark: boolean }) {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    let pts = [];
    for (let i = 0; i < 5; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3,
        -1.5
      ));
    }
    return pts;
  }, []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = Math.sin(clock.elapsedTime * 0.6) * 0.5 + 0.5;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={isDark ? "#fcd34d" : "#d97706"}
        transparent
        linewidth={1}
        opacity={0.6}
      />
    </line>
  );
}

/* =========================================================================
   7. MAIN EXPORT — FULL ROYAL FIELD
=========================================================================== */
export function ParticleField() {
  const isDark = useIsDarkMode();

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={isDark ? 0.4 : 0.2} />

        {/* ROYAL BACKGROUND */}
        <AuroraPlane isDark={isDark} />

        {/* GOLD DUST */}
        <GoldDust isDark={isDark} />

        {/* ROYAL ORBS */}
        <GlowOrbs isDark={isDark} />

        {/* AI CONNECTION LINES */}
        <AIConnectionLines isDark={isDark} />

        <color attach="background" args={["transparent"]} />
      </Canvas>
    </div>
  );
}
