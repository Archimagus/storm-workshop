import { LogicNode, Surface, Voxel } from "./parse_part_definition";

export enum SubPartType {
  VisibleSurface = "VisibleSurface",
  HiddenSurface = "HiddenSurface",
  BouancySurface = "BouancySurface",
  Mesh = "Mesh",
  EditorOnlyMesh = "EditorOnlyMesh",
  PipeConnection = "PipeConnection",
  LogicNode = "LogicNode",
  Voxel = "Voxel",
  ReserveVoxel = "ReserveVoxel",
}

export type HoveredObject = {
  name: string;
  content: Surface | LogicNode | Voxel | string;
};
