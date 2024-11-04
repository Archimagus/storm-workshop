import { LogicNode, Surface, Voxel } from "./parse_part_definition";

export enum SubPartType {
  Surface = "Surface",
  BouancySurface = "BouancySurface",
  LogicNode = "LogicNode",
  Voxel = "Voxel",
}

export type HoveredObject = {
  name: string;
  content: Surface | LogicNode | Voxel;
};
