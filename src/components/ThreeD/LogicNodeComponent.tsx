import { LogicNode } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Billboard, Edges } from "@react-three/drei";
import { FC, useState } from "react";
import { AlwaysDepth } from "three";
import {
  componentOrientationToLocal,
  componentPositionToLocal,
} from "../../lib/componentUtils";
import { CircleShape } from "./Shapes";

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
export const LogicNodeComponent: FC<LogicNodeProps> = ({ node }) => {
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
