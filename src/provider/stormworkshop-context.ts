import { Mod, Part } from "@/lib/parse_part_definition";
import { HoveredObject } from "@/lib/types";
import { createContext } from "react";
import { BufferGeometry } from "three";

export type StormworkshopContext = {
  mod: Mod | null;
  setMod: React.Dispatch<React.SetStateAction<Mod | null>>;
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  openParts: number[];
  setOpenParts: React.Dispatch<React.SetStateAction<number[]>>;
  hoveredObject: HoveredObject | null;
  setHoveredObject: React.Dispatch<React.SetStateAction<HoveredObject | null>>;
  rawData: string;
  setRawData: React.Dispatch<React.SetStateAction<string>>;
  visibility: string[];
  setVisibility: React.Dispatch<React.SetStateAction<string[]>>;
  meshes: Record<string, BufferGeometry>;
  setMeshes: React.Dispatch<
    React.SetStateAction<Record<string, BufferGeometry>>
  >;
};

export const StormworkshopContext = createContext<StormworkshopContext | null>(
  null
);
