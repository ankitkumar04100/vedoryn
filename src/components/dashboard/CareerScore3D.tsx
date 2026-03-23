import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function ScoreRing({ score, radius = 2, thickness = 0.15 }: { score: number; radius?: number; thickness?: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const ringGeometry = useMemo(() => {
    const arc = (score / 100) * Math.PI * 2;
    const shape = new THREE.Shape();
    const outerR = radius;
    const innerR = radius - thickness;
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * arc - Math.PI / 2;
      const x = Math.cos(angle) * outerR;
      const y = Math.sin(angle) * outerR;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    for (let i = segments; i >= 0; i--) {
      const angle = (i / segments) * arc - Math.PI / 2;
      shape.lineTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
    }
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 });
  }, [score, radius, thickness]);

  const bgGeometry = useMemo(() => new THREE.TorusGeometry(radius - thickness / 2, thickness / 2, 16, 64), [radius, thickness]);

  useFrame((state) => {
    if (ringRef.current) ringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      glowRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group>
      <mesh geometry={bgGeometry}>
        <meshStandardMaterial color="#1a1a0e" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef} geometry={ringGeometry} position={[0, 0, -0.04]}>
        <meshStandardMaterial color="#c8860a" emissive="#c8860a" emissiveIntensity={0.5} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh ref={glowRef}>
        <torusGeometry args={[radius - thickness / 2, thickness * 1.5, 8, 64]} />
        <meshBasicMaterial color="#c8860a" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function ScoreParticles({ count = 30, radius = 2 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.8;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return pos;
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) arr[i * 3 + 2] = Math.sin(state.clock.elapsedTime + i) * 0.15;
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.04} color="#daa520" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ScoreText({ score }: { score: number }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <Text fontSize={1.2} color="#f5e6c8" anchorX="center" anchorY="middle" position={[0, 0.15, 0.1]}>
        {score}
      </Text>
      <Text fontSize={0.25} color="#a08060" anchorX="center" anchorY="middle" position={[0, -0.6, 0.1]}>
        Career Score
      </Text>
    </Float>
  );
}

function CoreSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref} scale={0.6}>
      <icosahedronGeometry args={[1, 1]} />
      <MeshDistortMaterial color="#8b1a1a" emissive="#c8860a" emissiveIntensity={0.15} roughness={0.3} metalness={0.9} distort={0.3} speed={2} transparent opacity={0.2} />
    </mesh>
  );
}

export function CareerScore3D({ score = 72, className = "" }: { score?: number; className?: string }) {
  return (
    <div className={`w-full aspect-square max-w-[320px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.9} color="#daa520" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#8b1a1a" />
        <ScoreRing score={score} />
        <ScoreParticles />
        <ScoreText score={score} />
        <CoreSphere />
      </Canvas>
    </div>
  );
}
