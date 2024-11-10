// import testInput from "@/assets/01_block.xml?raw";
// import testInput from "@/assets/02_wedge.xml?raw";
import testInput from "@/assets/03_pyramid.xml?raw";
// import testInput from "@/assets/04_invpyramid.xml?raw";
import React, { ComponentProps, FC, useEffect } from "react";
import { BufferGeometry } from "three";
import { Mod, Part, parsePartDefinition } from "./lib/parse_part_definition";
import { HoveredObject, SubPartType } from "./lib/types";

type StormworkshopContext = {
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

const StormworkshopContext = React.createContext<StormworkshopContext | null>(
  null
);

export function useStormworkshop() {
  const context = React.useContext(StormworkshopContext);
  if (!context) {
    throw new Error(
      "useStormworkshop must be used within a StormworkshopProvider."
    );
  }

  return context;
}

export const StormworkshopProvider: FC<ComponentProps<"div">> = ({
  children,
}) => {
  const [rawData, setRawData] = React.useState<string>(testInput);
  const [mod, setMod] = React.useState<Mod | null>(null);
  const [parts, setParts] = React.useState<Part[]>([
    parsePartDefinition(rawData),
  ]);
  const [openParts, setOpenParts] = React.useState<number[]>([]);

  useEffect(() => {
    setOpenParts([0]);
  }, [parts]);

  const [meshes, setMeshes] = React.useState<Record<string, BufferGeometry>>(
    {}
  );
  const [hoveredObject, setHoveredObject] = React.useState<any>(null);
  const [visibility, setVisibility] = React.useState<string[]>([
    SubPartType.VisibleSurface,
    SubPartType.Mesh,
    SubPartType.EditorOnlyMesh,
  ]);

  const contextValue = React.useMemo<StormworkshopContext>(
    () => ({
      mod,
      setMod,
      parts,
      setParts,
      openParts,
      setOpenParts,
      hoveredObject,
      setHoveredObject,
      rawData,
      setRawData,
      visibility,
      setVisibility,
      meshes,
      setMeshes,
    }),
    [parts, hoveredObject, visibility, meshes, openParts]
  );

  return (
    <StormworkshopContext.Provider value={contextValue}>
      {children}
    </StormworkshopContext.Provider>
  );
};
