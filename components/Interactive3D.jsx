import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float } from '@react-three/drei';

function CenterCore() {
  const meshRef = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time / 4) * 0.2;
    meshRef.current.rotation.y = time * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 1.4, 0.3]} />
        <meshPhysicalMaterial 
          color="#14b8a6"
          roughness={0.2}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={1.2}
          emissive="#0d9488"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingShapes() {
  return (
    <>
      <Float speed={3} floatIntensity={1.5} position={[-2.5, 1.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.5} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2.5} floatIntensity={2} position={[2.2, -1.2, 0]}>
        <mesh rotation={[1, 0.5, 0]}>
          <torusGeometry args={[0.35, 0.12, 16, 100]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={4} floatIntensity={3} position={[2.5, 1.3, 0]}>
        <mesh rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.3, 0.7, 4]} />
          <MeshDistortMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1} distort={0.3} speed={4} />
        </mesh>
      </Float>
    </>
  );
}

export default function Interactive3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#1d4ed8" />
        <directionalLight position={[-5, 5, 2]} intensity={1.2} color="#06b6d4" />
        <spotLight position={[0, -5, 5]} intensity={0.5} color="#14b8a6" angle={0.6} />
        <CenterCore />
        <FloatingShapes />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}