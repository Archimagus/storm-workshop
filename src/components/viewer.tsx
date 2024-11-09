import { useStormworkshop } from "@/StormworkshopProvider";
import { Bounds, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

import { PartComponent } from "./ThreeD/Part";

export const Viewer: React.FC = () => {
  const { parts } = useStormworkshop();

  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      dpr={[1, 2]}
      camera={{ position: [3, 3, 3], fov: 40 }}
    >
      <color attach="background" args={["skyblue"]} />
      <Environment
        background
        near={0.1}
        far={1000}
        files={["sky.webp", "sky-gainmap.webp", "sky.json"]}
      />
      <Bounds fit clip observe margin={5}>
        {parts.map((part) => (
          <PartComponent key={part.name} part={part} />
        ))}
      </Bounds>
      <axesHelper args={[2]} position={[0, 0, 0]} />
      <Grid
        infiniteGrid
        cellSize={0.25}
        sectionSize={1.25}
        position={[-0.625, -0.125, -0.625]}
      />
      <OrbitControls makeDefault />
    </Canvas>
  );
};
