import { Voxel } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/provider/useStormworkshop";
import { Edges } from "@react-three/drei";
import { FC, useState } from "react";
import { componentPositionToLocal } from "../../lib/componentUtils";

interface VoxelProps {
  voxel: Voxel;
}
export const VoxelComponent: FC<VoxelProps> = ({ voxel }) => {
  const position = componentPositionToLocal(voxel.position);
  const [hovered, setHovered] = useState(false);
  const { visibility, setHoveredObject } = useStormworkshop();

  if (voxel.flags === 1 && !visibility.includes(SubPartType.Voxel)) return null;

  if (voxel.flags !== 1 && !visibility.includes(SubPartType.ReserveVoxel))
    return null;
  return (
    <mesh
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredObject({
          name: "Voxel",
          content: voxel,
        });
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        setHoveredObject(null);
      }}
      position={position}
      rotation={
        voxel.physicsShapeRotation
          ? [
              Math.atan2(
                voxel.physicsShapeRotation["10"],
                voxel.physicsShapeRotation["00"]
              ),
              Math.asin(-voxel.physicsShapeRotation["20"]),
              Math.atan2(
                voxel.physicsShapeRotation["21"],
                voxel.physicsShapeRotation["22"]
              ),
            ]
          : [0, 0, 0]
      }
    >
      <boxGeometry args={[0.25, 0.25, 0.25]} />
      <meshStandardMaterial
        color={voxel.flags === 1 ? "gray" : "#ff7c7c"}
        transparent
        opacity={voxel.flags === 1 ? 0.5 : 0.25}
      />
      <Edges
        linewidth={hovered ? 3 : 1}
        scale={1}
        threshold={80}
        color={hovered ? "#393939" : "#353535"}
        renderOrder={3}
      />
    </mesh>
  );
};
