import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import { io } from 'socket.io-client';

function StorageRack3D({ position, stockLevel, label }) {
  const isClipped = !stockLevel || stockLevel === 0;
  const statusColor = stockLevel < 10 ? '#f43f5e' : stockLevel < 40 ? '#f59e0b' : '#10b981';
  
  // Normalized visual box volume sizing based on your actual data counts
  const itemHeight = isClipped ? 0.05 : Math.min((stockLevel / 120) * 1.5, 1.5);

  return (
    <group position={position}>
      {/* 🏷️ 3D Floating Bay Label - Replaced custom URL with standard fallback fonts */}
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.35}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font={undefined} // Uses standard default system font mapping to prevent network canvas drops
      >
        {label}
      </Text>

      {/* 🏗️ Permanent Structural Warehouse Rack Frame */}
      {/* Left Vertical Pillar */}
      <mesh position={[-0.75, 1, 0]}>
        <boxGeometry args={[0.08, 2, 0.6]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Right Vertical Pillar */}
      <mesh position={[0.75, 1, 0]}>
        <boxGeometry args={[0.08, 2, 0.6]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Top Connecting Crossbeam */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.58, 0.06, 0.6]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.3} />
      </mesh>
      
      {/* Bottom Base Shelf Platform */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.58, 0.06, 0.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 📦 Volumetric Inventory Load Block */}
      {!isClipped ? (
        <mesh position={[0, itemHeight / 2 + 0.06, 0]}>
          <boxGeometry args={[1.3, itemHeight, 0.5]} />
          <meshStandardMaterial 
            color={statusColor} 
            roughness={0.4} 
            metalness={0.1}
          />
        </mesh>
      ) : (
        /* Semi-transparent structure to visually identify empty bays */
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.3, 0.1, 0.5]} />
          <meshStandardMaterial color="#ef4444" wireframe={true} opacity={0.15} transparent={true} />
        </mesh>
      )}
    </group>
  );
}

const Warehouse3D = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const socketUrl = apiUrl.replace('/api', '');
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.emit('get_heatmap_init', 'Warehouse Alpha');
    socket.on('warehouse_update', (data) => {
      if (data && data.sections) {
        setSections(data.sections);
      }
    });

    return () => socket.disconnect();
  }, []);

  // Spatial alignment configurations mapping keys to specific geometry vertices
  const coordinatesMapping = {
    "A1": [-4.5, 0, -1.5], "A2": [-1.5, 0, -1.5], "A3": [1.5, 0, -1.5], "A4": [4.5, 0, -1.5],
    "B1": [-4.5, 0, 1.5],  "B2": [-1.5, 0, 1.5],  "B3": [1.5, 0, 1.5],  "B4": [4.5, 0, 1.5]
  };

  return (
    <div className="w-full h-[450px] rounded-3xl border border-white/30 bg-[#0b0f19] overflow-hidden relative shadow-2xl">
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          Digital Twin Interactive 3D Architecture
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-0.5">
          Left-click drag to rotate | Scroll to zoom | Displays real-time volumetric shelf scales
        </p>
      </div>

      <Canvas camera={{ position: [0, 6, 9], fov: 45 }}>
        <color attach="background" args={['#0b0f1a']} />
        
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[0, 8, 4]} intensity={0.6} />
        
        {sections.map((section) => {
          const position = coordinatesMapping[section.sectionId] || [0, 0, 0];
          return (
            <StorageRack3D 
              key={section.sectionId} 
              position={position} 
              stockLevel={section.stockLevel} 
              label={section.sectionId} 
            />
          );
        })}

        <Grid cellSize={1} cellThickness={0.8} sectionSize={3} infiniteGrid fadeDistance={22} grayColor="#1e293b" />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={14} />
      </Canvas>
    </div>
  );
};

export default Warehouse3D;