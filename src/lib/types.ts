import { LogicNode, Surface, Voxel } from "./parse_part_definition";

export type HoveredObject = {
  name: string;
  content: Surface | LogicNode | Voxel;
};
