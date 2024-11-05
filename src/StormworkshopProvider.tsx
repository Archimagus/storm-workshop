import testInput from "@/assets/connector_large.xml?raw";
import React, { ComponentProps, FC } from "react";
import { Part, parsePartDefinition } from "./lib/parse_part_definition";
import { HoveredObject, SubPartType } from "./lib/types";
type StormworkshopContext = {
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  hoveredObject: HoveredObject | null;
  setHoveredObject: React.Dispatch<React.SetStateAction<HoveredObject | null>>;
  rawData: string;
  setRawData: React.Dispatch<React.SetStateAction<string>>;
  view: string[];
  setView: React.Dispatch<React.SetStateAction<string[]>>;
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

  const [parts, setParts] = React.useState<Part[]>([
    parsePartDefinition(rawData),
  ]);
  const [hoveredObject, setHoveredObject] = React.useState<any>(null);
  const [view, setView] = React.useState<string[]>(Object.keys(SubPartType));
  const contextValue = React.useMemo<StormworkshopContext>(
    () => ({
      parts,
      setParts,
      hoveredObject,
      setHoveredObject,
      rawData,
      setRawData,
      view,
      setView,
    }),
    [parts, hoveredObject, view]
  );

  return (
    <StormworkshopContext.Provider value={contextValue}>
      {children}
    </StormworkshopContext.Provider>
  );
};
