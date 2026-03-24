import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 200 }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    const palette = [
      [0.6, 0.4, 1.0],   // primary purple
      [0.2, 0.8, 0.7],   // cyan
      [1.0, 0.4, 0.6],   // pink
      [1.0, 0.6, 0.2],   // orange
      [0.3, 0.8, 0.4],   // green
    ];
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
      
      siz[i] = Math.random() * 3 + 1;
    }
    return [pos, col, siz];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const posAttr = mesh.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(time * 0.3 + i * 0.1) * 0.002;
      arr[i * 3] += Math.cos(time * 0.2 + i * 0.05) * 0.001;
    }
    posAttr.needsUpdate = true;
    mesh.current.rotation.y = time * 0.02;
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
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const orbs = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      position: [
        Math.sin(i * 1.2) * 4,
        Math.cos(i * 0.8) * 2,
        Math.sin(i * 0.5) * 3 - 2,
      ] as [number, number, number],
      color: ["#7c3aed", "#14b8a6", "#ec4899", "#f97316", "#22c55e"][i],
      scale: 0.3 + Math.random() * 0.4,
      speed: 0.3 + Math.random() * 0.5,
    })),
  []);

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}
