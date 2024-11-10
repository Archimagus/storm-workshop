import {
  componentOrientationToLocal,
  componentPositionToLocal,
} from "@/lib/componentUtils";
import { getSurfaceGeometry } from "@/lib/getSurfaceGeometry";
import { Surface } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Edges } from "@react-three/drei";
import { FC, useState } from "react";

interface BuoyancySurfaceProps {
  surface: Surface;
}
export const BuoyancySurfaceComponent: FC<BuoyancySurfaceProps> = ({
  surface,
}) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, visibility } = useStormworkshop();

  if (!visibility.includes(SubPartType.BouancySurface)) return null;
  return (
    <object3D
      position={position}
      rotation={rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredObject({
          name: "Bouancy Surface",
          content: surface,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        setHoveredObject(null);
      }}
    >
      {/* The plane is offset by 0.126 to prevent z-fighting with the voxel and the surface */}
      <mesh position={[0, 0, 0.126]}>
        {getSurfaceGeometry(surface)}
        <meshStandardMaterial
          color="#e8df75"
          side={2}
          transparent
          opacity={0.25}
        />
        <Edges
          linewidth={hovered ? 3 : 1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#e8df75" : "#97914d"}
          renderOrder={3}
        />
      </mesh>
    </object3D>
  );
};
