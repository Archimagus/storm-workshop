import { Surface } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Edges } from "@react-three/drei";
import { FC, useMemo, useState } from "react";
import {
  componentOrientationToLocal,
  componentPositionToLocal,
} from "../../lib/componentUtils";
import { getSurfaceGeometry } from "../../lib/getSurfaceGeometry";

export interface SurfaceProps {
  surface: Surface;
}
export const SurfaceComponent: FC<SurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, visibility } = useStormworkshop();

  const geometry = useMemo(() => {
    return getSurfaceGeometry(surface);
  }, [surface.shape]);

  if (!visibility.includes(SubPartType.Surface)) return null;
  return (
    <object3D
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredObject({
          name: "Surface",
          content: surface,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        setHoveredObject(null);
      }}
    >
      {/* The plane is offset by 0.126 to prevent z-fighting with the voxel */}
      <mesh position={[0, 0, 0.126]}>
        {geometry}
        <meshStandardMaterial
          color="#84cfe8"
          side={2}
          transparent
          opacity={0.5}
        />
        <Edges
          linewidth={hovered ? 3 : 1}
          scale={1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#3577d9" : "#84cfe8"}
          renderOrder={3}
        />
      </mesh>
    </object3D>
  );
};
