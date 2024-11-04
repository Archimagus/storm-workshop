import {
  BouancySurface,
  LogicNode,
  Part,
  Position,
  Surface,
  Voxel,
} from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useModStorm } from "@/ModStormProvider";
import { Billboard, Edges, Outlines } from "@react-three/drei";
import { FC, useMemo, useState } from "react";
import { EulerTuple } from "three";

interface PartComponentProps {
  part: Part;
}

const defaultPosition = { x: 0, y: 0, z: 0 };

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

  // Create geometries for each bouancy surface
  const bouancySurfaces = useMemo(() => {
    return part.buoyancySurfaces.map((surface, index) => {
      return <BouancySurfaceComponent key={index} surface={surface} />;
    });
  }, [part.buoyancySurfaces]);

  // Create geometries for each logic node
  const logicNodes = useMemo(() => {
    return part.logicNodes.map((node, index) => {
      return <LogicNodeComponent key={index} node={node} />;
    });
  }, [part.logicNodes]);

  return (
    <group>
      {voxels}
      {surfaces}
      {bouancySurfaces}
      {logicNodes}
    </group>
  );
};

interface VoxelProps {
  voxel: Voxel;
}
const VoxelComponent: FC<VoxelProps> = ({ voxel }) => {
  const position = componentPositionToLocal(voxel.position);
  const [hovered, setHovered] = useState(false);
  const { view, setHoveredObject } = useModStorm();
  if (!view.includes(SubPartType.Voxel)) return null;
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
      <meshStandardMaterial color="gray" transparent opacity={0.5} />
      <Edges
        linewidth={hovered ? 3 : 1}
        scale={1}
        threshold={80}
        color={hovered ? "#393939" : "#353535"}
      />
    </mesh>
  );
};

interface SurfaceProps {
  surface: Surface;
}
const SurfaceComponent: FC<SurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, view } = useModStorm();
  if (!view.includes(SubPartType.Surface)) return null;
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

interface BouancySurfaceProps {
  surface: BouancySurface;
}
const BouancySurfaceComponent: FC<BouancySurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, view } = useModStorm();
  if (!view.includes(SubPartType.BouancySurface)) return null;
  return (
    <object3D
      position={[position.x, position.y, position.z]}
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
      {/* The plane is offset by 0.127 to prevent z-fighting with the voxel and the surface */}
      <mesh position={[0, 0, 0.127]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial
          color="#e88484"
          side={2}
          transparent
          opacity={0.25}
        />
        <Edges
          linewidth={hovered ? 3 : 1}
          scale={1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#975454" : "#e88484"}
        />
      </mesh>
    </object3D>
  );
};

interface LogicNodeProps {
  node: LogicNode;
}
const logicNodeTypeMap: Record<
  number,
  { logicType: string; color: string; offset: number }
> = {
  0: { logicType: "boolean", color: "#cc234a", offset: 0 },
  1: { logicType: "number", color: "green", offset: 0 },
  2: { logicType: "rps", color: "#ff9900", offset: 0 },
  3: { logicType: "fluid", color: "#1480c8", offset: 0 },
  4: { logicType: "electric", color: "#bcbc2f", offset: -0.01 },
  5: { logicType: "composite", color: "#8000ff", offset: 0.01 },
  6: { logicType: "video", color: "#33d2ad", offset: -0.02 },
  7: { logicType: "audio", color: "#5d8729", offset: 0.02 },
  8: { logicType: "rope", color: "#3b3b3b", offset: -0.03 },
};
const LogicNodeComponent: FC<LogicNodeProps> = ({ node }) => {
  const position = componentPositionToLocal(node.position);
  const [hovered, setHovered] = useState(false);
  const { view, setHoveredObject } = useModStorm();
  if (!view.includes(SubPartType.LogicNode)) return null;

  const { color, offset } = logicNodeTypeMap[node.type];

  return (
    <Billboard position={[position.x + offset, position.y, position.z]}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredObject({
            name: "Logic Node",
            content: node,
          });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setHoveredObject(null);
        }}
      >
        {node.mode === 1 ? (
          <torusGeometry args={[0.06, 0.01]} />
        ) : (
          <sphereGeometry args={[0.025, 32, 32]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        <Outlines
          scale={hovered ? 1.04 : 1.02}
          color={hovered ? "white" : "black"}
        />
      </mesh>
    </Billboard>
  );
};
