
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Text } from "@react-three/drei";
import { Group } from "three";

// This is a simplified representation since we don't have actual 3D models
const HeroScene = () => {
  const group = useRef<Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={group}>
      {/* Pickles Jar */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.8}>
        <mesh position={[-1.5, 0, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color="#b36214" 
            transparent 
            opacity={0.7} 
            metalness={0.3}
            roughness={0.2}
          />
          
          {/* Lid */}
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
            <meshStandardMaterial color="#6d4d32" />
          </mesh>
          
          {/* Pickles inside */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
            <meshStandardMaterial color="#92a332" />
          </mesh>
          
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Mango Pickle
          </Text>
        </mesh>
      </Float>

      {/* Papad */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[1.5, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.05, 32]} />
          <meshStandardMaterial 
            color="#e2d1ad" 
            metalness={0.1}
            roughness={0.8}
          />
          
          {/* Spice specks */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[
                (Math.random() - 0.5) * 2, 
                0.03, 
                (Math.random() - 0.5) * 2
              ]}
              scale={[0.05, 0.01, 0.05]}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial 
                color={Math.random() > 0.5 ? "#b22222" : "#32551f"} 
              />
            </mesh>
          ))}
          
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.2}
            color="#603813"
            anchorX="center"
            anchorY="middle"
            rotation={[Math.PI / 2, Math.PI, 0]}
          >
            Special Papad
          </Text>
        </mesh>
      </Float>

      {/* Spices */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Float 
          key={i}
          speed={3 + Math.random() * 2} 
          rotationIntensity={Math.random() * 2}
          floatIntensity={Math.random() * 2}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8]} />
            <meshStandardMaterial 
              color={
                ['#e75c10', '#ffb805', '#8b0000', '#d6691a', '#e3a82b'][
                  Math.floor(Math.random() * 5)
                ]
              } 
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export default HeroScene;
