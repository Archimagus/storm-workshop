import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Box, Boxes, CircleDot, Grid2X2, Ship } from "lucide-react";
import { useState } from "react";

const subPartTypes = Object.values(SubPartType);

const subPartData = {
  [SubPartType.Surface]: {
    label: "Surface",
    icon: <Grid2X2 className="h-4 w-4" />,
    description: "A surface is a flat part of the part.",
  },
  [SubPartType.BouancySurface]: {
    label: "Bouancy Surface",
    icon: <Ship className="h-4 w-4" />,
    description:
      "A bouancy surface is a surface that is used to calculate buoyancy.",
  },
  [SubPartType.LogicNode]: {
    label: "Logic Node",
    icon: <CircleDot className="h-4 w-4" />,
    description: "A logic node is a node that is used to calculate logic.",
  },
  [SubPartType.Voxel]: {
    label: "Voxel",
    icon: <Box className="h-4 w-4" />,
    description: "A voxel is a voxel.",
  },
};

export function ControlsMenu() {
  const { view, setView } = useStormworkshop();
  const [displayMode, setDisplayMode] = useState("solid");

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <ToggleGroup
        type="multiple"
        value={view}
        onValueChange={setView}
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md"
      >
        {subPartTypes.map((type) => (
          <ToggleGroupItem
            value={type}
            aria-label={`Toggle ${type}`}
            className="px-3"
          >
            <ToggleGroupItem
              value={type}
              aria-label={subPartData[type].label}
              title={type}
              onChange={() => setView((prev) => [...prev, type])}
            >
              {subPartData[type].icon}
            </ToggleGroupItem>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <ToggleGroup
        type="single"
        value={displayMode}
        onValueChange={(value) => value && setDisplayMode(value)}
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md"
      >
        <ToggleGroupItem
          value="wireframe"
          aria-label="Wireframe mode"
          className="px-3"
        >
          <Boxes className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="solid" aria-label="Solid mode" className="px-3">
          <Box className="h-4 w-4 fill-current" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
