import { LogicNode, Surface, Voxel } from "./parse_part_definition";

export enum SubPartType {
  Surface = "Surface",
  BouancySurface = "BouancySurface",
  LogicNode = "LogicNode",
  Voxel = "Voxel",
  ReserveVoxel = "ReserveVoxel",
  Mesh = "Mesh",
  EditorOnlyMesh = "EditorOnlyMesh",
}

export type HoveredObject = {
  name: string;
  content: Surface | LogicNode | Voxel | string;
};
