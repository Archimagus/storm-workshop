import { useModStorm } from "@/ModStormProvider";
import {
  Bounds,
  Center,
  Environment,
  Grid,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { PartComponent } from "./ThreeD/Part";

export const Viewer: React.FC = () => {
  const { parts } = useModStorm();
  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [3, 3, 3], fov: 40 }}
    >
      <color attach="background" args={["skyblue"]} />

      <Environment background near={0.1} far={1000} files={["sky.exr"]} />
      <Bounds fit clip observe margin={5}>
        <group position={[0.125, 0, 0.125]}>
          <Center top>
            {parts.map((part) => (
              <PartComponent key={part.name} part={part} />
            ))}
          </Center>
        </group>
      </Bounds>
      <axesHelper args={[2]} position={[0.125, 0, 0.125]} />
      <Grid infiniteGrid cellSize={0.25} sectionSize={1} />
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.9}
        makeDefault
      />
    </Canvas>
  );
};
