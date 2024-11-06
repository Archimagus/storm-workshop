import { LogicNode, Surface, Voxel } from "./parse_part_definition";

export enum SubPartType {
  Surface = "Surface",
  BouancySurface = "BouancySurface",
  LogicNode = "LogicNode",
  Voxel = "Voxel",
  Mesh = "Mesh",
}

export type HoveredObject = {
  name: string;
  content: Surface | LogicNode | Voxel;
};
