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
  [SubPartType.Mesh]: {
    label: "Mesh",
    icon: <Boxes className="h-4 w-4" />,
    description: "A mesh is a mesh.",
  },
};

export function ControlsMenu() {
  const { visibility, setVisibility } = useStormworkshop();
  const [displayMode, setDisplayMode] = useState("solid");

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <ToggleGroup
        type="multiple"
        value={visibility}
        onValueChange={setVisibility}
        className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-md"
      >
        {subPartTypes.map((type) => (
          <ToggleGroupItem
            value={type}
            aria-label={subPartData[type].label}
            title={type}
            className="px-3"
            key={type}
            onChange={() => setVisibility((prev) => [...prev, type])}
          >
            {subPartData[type].icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
