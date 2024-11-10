import { Part } from "@/lib/parse_part_definition";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { FC, useMemo } from "react";
import { Vector3Tuple } from "three";
import { BuoyancySurfaceComponent } from "./BuoyancySurfaceComponent";
import { LogicNodeComponent } from "./LogicNodeComponent";
import { SurfaceComponent } from "./SurfaceComponent";
import { VoxelComponent } from "./VoxelComponent";

interface PartComponentProps {
  part: Part;
}

export const PartComponent: FC<PartComponentProps> = ({ part }) => {
  const { meshes, visibility, setHoveredObject } = useStormworkshop();

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

  // Create geometries for each mesh
  // TODO: Move these to a separate component
  const mesh = meshes[part.mesh_data_name];
  const mesh0 = meshes[part.mesh_0_name];
  const mesh1 = meshes[part.mesh_1_name];
  const mesh_editor_only = meshes[part.mesh_editor_only_name];

  const meshPositionOffset: Vector3Tuple = [
    part.constraint_pos_parent?.x || 0,
    part.constraint_pos_parent?.y || 0,
    part.constraint_pos_parent?.z || 0,
  ];

  return (
    <group>
      {voxels}
      {surfaces}
      {bouancySurfaces}
      {logicNodes}
      {mesh && visibility.includes(SubPartType.Mesh) && (
        <mesh
          //   position={meshPositionOffset}
          geometry={mesh}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredObject({
              name: "Mesh",
              content: part.mesh_data_name,
            });
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredObject(null);
          }}
        >
          <meshStandardMaterial color="white" vertexColors={true} />
        </mesh>
      )}
      {mesh0 && visibility.includes(SubPartType.Mesh) && (
        <mesh
          //   position={meshPositionOffset}
          geometry={mesh0}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredObject({
              name: "Mesh",
              content: part.mesh_0_name,
            });
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredObject(null);
          }}
        >
          <meshLambertMaterial color="white" vertexColors={true} />
        </mesh>
      )}
      {mesh1 && visibility.includes(SubPartType.Mesh) && (
        <mesh
          //   position={meshPositionOffset}
          geometry={mesh1}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredObject({
              name: "Mesh",
              content: part.mesh_1_name,
            });
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredObject(null);
          }}
        >
          <meshStandardMaterial emissiveIntensity={0.5} vertexColors={true} />
        </mesh>
      )}
      {mesh_editor_only && visibility.includes(SubPartType.EditorOnlyMesh) && (
        <mesh
          geometry={mesh_editor_only}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredObject({
              name: "Mesh",
              content: part.mesh_editor_only_name,
            });
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredObject(null);
          }}
        >
          <meshStandardMaterial color="white" vertexColors={true} />
        </mesh>
      )}
    </group>
  );
};
