import {
  BouancySurface,
  LogicNode,
  Part,
  Position,
  Surface,
  Voxel,
} from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Billboard, Edges } from "@react-three/drei";
import { FC, useMemo, useState } from "react";
import { AlwaysDepth, EulerTuple, Path, Shape, ShapeGeometry } from "three";

interface PartComponentProps {
  part: Part;
}

const defaultPosition: [number, number, number] = [0, 0, 0];

const componentPositionToLocal = (
  position: Position | null
): [number, number, number] => {
  if (!position) return defaultPosition;
  return [position.x * 0.25, position.y * 0.25, position.z * 0.25];
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
      return <BuoyancySurfaceComponent key={index} surface={surface} />;
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
  const { visibility, setHoveredObject } = useStormworkshop();
  if (!visibility.includes(SubPartType.Voxel)) return null;
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
        transparent={voxel.flags === 0}
        opacity={0.25}
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

interface SurfaceProps {
  surface: Surface;
}
const SurfaceComponent: FC<SurfaceProps> = ({ surface }) => {
  const position = componentPositionToLocal(surface.position);
  const rotation = componentOrientationToLocal(surface.orientation);
  const [hovered, setHovered] = useState(false);
  const { setHoveredObject, visibility } = useStormworkshop();
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
          renderOrder={3}
        />
      </mesh>
    </object3D>
  );
};

interface BouancySurfaceProps {
  surface: BouancySurface;
}
const BuoyancySurfaceComponent: FC<BouancySurfaceProps> = ({ surface }) => {
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
      {/* The plane is offset by 0.127 to prevent z-fighting with the voxel and the surface */}
      <mesh position={[0, 0, 0.127]}>
        <planeGeometry args={[0.25, 0.25]} />
        <meshStandardMaterial
          color="#e8df75"
          side={2}
          transparent
          opacity={0.25}
        />
        <Edges
          linewidth={hovered ? 3 : 1}
          scale={1}
          threshold={80} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
          color={hovered ? "#e8df75" : "#97914d"}
          renderOrder={3}
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
  { logicType: string; color: string; offset: number; physical: boolean }
> = {
  0: { logicType: "boolean", color: "#cc234a", offset: 0, physical: false },
  1: { logicType: "number", color: "green", offset: 0, physical: false },
  2: { logicType: "rps", color: "#ff9900", offset: 0, physical: true },
  3: { logicType: "fluid", color: "#1480c8", offset: 0, physical: true },
  4: {
    logicType: "electric",
    color: "#bcbc2f",
    offset: -0.01,
    physical: false,
  },
  5: {
    logicType: "composite",
    color: "#8000ff",
    offset: 0.01,
    physical: false,
  },
  6: { logicType: "video", color: "#33d2ad", offset: -0.02, physical: false },
  7: { logicType: "audio", color: "#5d8729", offset: 0.02, physical: false },
  8: { logicType: "rope", color: "#3b3b3b", offset: -0.03, physical: false },
};
const LogicNodeComponent: FC<LogicNodeProps> = ({ node }) => {
  const { physical } = logicNodeTypeMap[node.type];
  if (physical) return <PhysicalLogicNodeComponent node={node} />;
  return <LogicalLogicNodeComponent node={node} />;
};

const PhysicalLogicNodeComponent: FC<LogicNodeProps> = ({ node }) => {
  const position = componentPositionToLocal(node.position);
  const rotation = componentOrientationToLocal(node.orientation);
  const [hovered, setHovered] = useState(false);
  const { visibility, setHoveredObject } = useStormworkshop();
  if (!visibility.includes(SubPartType.LogicNode)) return null;
  const { color } = logicNodeTypeMap[node.type];
  return (
    <group
      position={position}
      rotation={rotation}
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
      <mesh renderOrder={1} position={[0, 0, 0.128]}>
        <circleGeometry args={[0.07, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        <Edges
          linewidth={hovered ? 4 : 2}
          scale={1}
          threshold={80}
          color={"white"}
          renderOrder={2}
        />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <circleGeometry args={[0.03, 32]} />
        <meshStandardMaterial color={"#212121"} />
      </mesh>
    </group>
  );
};
const LogicalLogicNodeComponent: FC<LogicNodeProps> = ({ node }) => {
  const position = componentPositionToLocal(node.position);
  const [hovered, setHovered] = useState(false);
  const { visibility, setHoveredObject } = useStormworkshop();
  if (!visibility.includes(SubPartType.LogicNode)) return null;

  const { color, offset } = logicNodeTypeMap[node.type];

  return (
    <Billboard position={position}>
      <mesh
        position={[offset, 0, offset]}
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
        renderOrder={1}
      >
        {node.mode === 1 ? (
          <CircleShape />
        ) : (
          <circleGeometry args={[0.025, 32]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0}
          depthFunc={AlwaysDepth}
          depthWrite={false}
          transparent={true}
          opacity={1}
        />
        <Edges
          linewidth={hovered ? 4 : 2}
          scale={1}
          threshold={80}
          color={"white"}
          renderOrder={2}
          depthFunc={AlwaysDepth}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
};

function CircleShape({
  outerRadius = 0.07,
  innerRadius = 0.035,
  offset = 0,
}: {
  outerRadius?: number;
  innerRadius?: number;
  offset?: number;
}) {
  // Create a shape
  const shape = useMemo(() => {
    const shape = new Shape();
    shape.ellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2, true);
    shape.holes.push(
      new Path().ellipse(0, 0, innerRadius, innerRadius, 0, Math.PI * 2, true)
    );
    const geometry = new ShapeGeometry(shape);
    geometry.translate(0, 0, offset);
    return geometry;
  }, []);

  return <primitive object={shape} />;
}
