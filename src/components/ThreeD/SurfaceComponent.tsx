import { getSurfaceGeometry } from "@/lib/getSurfaceGeometry";
import { Surface } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Edges } from "@react-three/drei";
import { FC, useState } from "react";
import { DoubleSide } from "three";
import {
  componentOrientationToLocal,
  componentPositionToLocal,
} from "../../lib/componentUtils";

export interface SurfaceProps {
  surface: Surface;
}
const hiddenSurfaceShapes = [0, 3];
export const SurfaceComponent: FC<SurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, visibility } = useStormworkshop();

  const isHiddenSurface = hiddenSurfaceShapes.includes(surface.shape);

  if (isHiddenSurface && !visibility.includes(SubPartType.HiddenSurface))
    return null;
  if (!isHiddenSurface && !visibility.includes(SubPartType.VisibleSurface))
    return null;

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
        {getSurfaceGeometry(surface)}
        {!isHiddenSurface && (
          <meshStandardMaterial color="#ffffff" side={DoubleSide} />
        )}
        {isHiddenSurface && (
          <meshStandardMaterial
            color="#fd8888"
            side={DoubleSide}
            transparent
            opacity={0.25}
          />
        )}
        <Edges
          linewidth={hovered ? 3 : 1}
          scale={1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#000206" : "#2c2c2c"}
          renderOrder={3}
        />
      </mesh>
    </object3D>
  );
};
