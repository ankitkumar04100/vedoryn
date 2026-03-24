"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ===========================================================
   Detect Tailwind Dark Mode
=========================================================== */
function useIsDark() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

/* ===========================================================
   Aurora Shader Material
=========================================================== */

const AuroraShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#ffffff") },
    uColor2: { value: new THREE.Color("#ffffff") },
    uBrightness: { value: 1 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 newPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uBrightness;
    varying vec2 vUv;

    void main() {
      float wave = sin(vUv.x * 6.0 + uTime * 0.8) * 0.25 +
                   cos(vUv.y * 4.0 + uTime * 1.2) * 0.25;

      float mask = smoothstep(0.15, 1.0, vUv.y + wave);

      vec3 color = mix(uColor1, uColor2, mask);

      gl_FragColor = vec4(color * uBrightness, mask);
    }
  `,
};

/* ===========================================================
   Aurora Plane Component
=========================================================== */
function AuroraPlane({ isDark }: { isDark: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  const shader = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(AuroraShader.uniforms),
      vertexShader: AuroraShader.vertexShader,
      fragmentShader: AuroraShader.fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    // Day/Night Aurora Colors
    if (isDark) {
      mat.uniforms.uColor1.value = new THREE.Color("#7c3aed");   // Royal purple
      mat.uniforms.uColor2.value = new THREE.Color("#fbbf24");   // Gold
      mat.uniforms.uBrightness.value = 1.4;
    } else {
      mat.uniforms.uColor1.value = new THREE.Color("#6d28d9");   // Deep purple
      mat.uniforms.uColor2.value = new THREE.Color("#fb923c");   // Warm gold-orange
      mat.uniforms.uBrightness.value = 0.85;
    }

    return mat;
  }, [isDark]);

  useFrame(({ clock }) => {
    if (shader) shader.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh ref={ref} scale={[18, 10, 1]} position={[0, 0, -5]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive attach="material" object={shader} />
    </mesh>
  );
}

/* ===========================================================
   MAIN BACKGROUND EXPORT — Royal Aurora Engine
=========================================================== */

export function ParticleField() {
  const isDark = useIsDark();

  return (
    <div className="absolute inset-0 pointer-events-none -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <AuroraPlane isDark={isDark} />
        {/* Subtle ambient */}
        <ambientLight intensity={isDark ? 0.4 : 0.2} />
        <color attach="background" args={["transparent"]} />
      </Canvas>
    </div>
  );
}
