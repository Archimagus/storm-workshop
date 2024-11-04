import { Part, Position, Surface, Voxel } from "@/lib/parse_part_definition";
import { useModStorm } from "@/ModStormProvider";
import { Edges } from "@react-three/drei";
import { FC, useMemo, useState } from "react";
import { EulerTuple } from "three";

interface PartComponentProps {
  part: Part;
}

const defaultPosition = { x: 0, y: 0, z: 0 };

const defaultRotation = { x: 0, y: 0, z: 0 };

const componentPositionToLocal = (position: Position | null) => {
  if (!position) return defaultPosition;
  return {
    x: position.x * 0.25,
    y: position.y * 0.25,
    z: position.z * 0.25,
  };
};
/**
 * Converts the orientation of a component to the local coordinate system.
 * 0 -> +X
 * 1 -> -X
 * 2 -> +Y
 * 3 -> -Y
 * 4 -> +Z
 * 5 -> -Z
 * @param orientation The orientation of the component.
 * @returns The orientation of the component in the local coordinate system.
 */
const componentOrientationToLocal = (orientation: number): EulerTuple => {
  switch (orientation) {
    case 0:
      return [0, Math.PI / 2, 0];
    case 1:
      return [0, -Math.PI / 2, 0];
    case 2:
      return [-Math.PI / 2, 0, 0];
    case 3:
      return [Math.PI / 2, 0, 0];
    case 4:
      return [0, 0, 0];
    case 5:
      return [0, Math.PI, 0];
    default:
      return [0, 0, 0];
  }
};

export const PartComponent: FC<PartComponentProps> = ({ part }) => {
  // Create geometries for each voxel
  const voxels = useMemo(() => {
    return part.voxels.map((voxel, index) => {
      return <VoxelComponent key={index} voxel={voxel} />;
    });
  }, [part.voxels]);

  // Create geometries for each surface
  const surfaces = useMemo(() => {
    return part.surfaces.map((surface, index) => {
      return <SurfaceComponent key={index} surface={surface} />;
    });
  }, [part.surfaces]);

  // Create geometries for each logic node
  const logicNodes = useMemo(() => {
    return part.logicNodes.map((node, index) => {
      const position = componentPositionToLocal(node.position);

      return (
        <mesh key={index} position={[position.x, position.y, position.z]}>
          <sphereGeometry args={[0.125]} />
          <meshStandardMaterial color="green" />
        </mesh>
      );
    });
  }, [part.logicNodes]);

  return (
    <group>
      {voxels}
      {surfaces}
      {logicNodes}
    </group>
  );
};

interface SurfaceProps {
  surface: Surface;
}

interface VoxelProps {
  voxel: Voxel;
}

const VoxelComponent: FC<VoxelProps> = ({ voxel }) => {
  const position = componentPositionToLocal(voxel.position);

  return (
    <mesh
      position={[position.x, position.y, position.z]}
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
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

const SurfaceComponent: FC<SurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject } = useModStorm();
  return (
    <object3D
      position={[position.x, position.y, position.z]}
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
        <planeGeometry args={[0.25, 0.25]} />
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
        />
      </mesh>
    </object3D>
  );
};
