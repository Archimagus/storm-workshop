import jet_engine_combustion_chamber from "@/assets/jet_engine_combustion_chamber.xml?raw";
import React, { ComponentProps, FC } from "react";
import { Part, parsePartDefinition } from "./lib/parse_part_definition";
import { HoveredObject } from "./lib/types";
type ModStormContext = {
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
  hoveredObject: HoveredObject | null;
  setHoveredObject: React.Dispatch<React.SetStateAction<HoveredObject | null>>;
  rawData: string;
  setRawData: React.Dispatch<React.SetStateAction<string>>;
};

const ModStormContext = React.createContext<ModStormContext | null>(null);

export function useModStorm() {
  const context = React.useContext(ModStormContext);
  if (!context) {
    throw new Error("useModStorm must be used within a ModStormProvider.");
  }

  return context;
}

export const ModStormProvider: FC<ComponentProps<"div">> = ({ children }) => {
  const [rawData, setRawData] = React.useState<string>(
    jet_engine_combustion_chamber
  );

  const [parts, setParts] = React.useState<Part[]>([
    parsePartDefinition(jet_engine_combustion_chamber),
  ]);
  const [hoveredObject, setHoveredObject] = React.useState<any>(null);
  const contextValue = React.useMemo<ModStormContext>(
    () => ({
      parts,
      setParts,
      hoveredObject,
      setHoveredObject,
      rawData,
      setRawData,
    }),
    [parts, hoveredObject]
  );

  return (
    <ModStormContext.Provider value={contextValue}>
      {children}
    </ModStormContext.Provider>
  );
};
