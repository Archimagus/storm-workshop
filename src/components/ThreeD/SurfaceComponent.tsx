import { getSurfaceGeometry } from "@/lib/getSurfaceGeometry";
import { Surface } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/provider/useStormworkshop";
import { Edges } from "@react-three/drei";
import { FC, useState } from "react";
import {
  componentOrientationToLocal,
  componentPositionToLocal,
} from "../../lib/componentUtils";

export interface SurfaceProps {
  surface: Surface;
}

const hiddenSurfaceShapes = [0];
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
      <mesh position={[0, 0, 0.125]}>
        {getSurfaceGeometry(surface)}
        {!isHiddenSurface && (
          <meshStandardMaterial color={"white"} vertexColors />
        )}
        {isHiddenSurface && (
          <meshStandardMaterial color="#fd8888" transparent opacity={0.25} />
        )}
        <Edges
          linewidth={hovered ? 3 : 1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#000206" : "#2c2c2c"}
          renderOrder={3}
        />
      </mesh>
    </object3D>
  );
};
