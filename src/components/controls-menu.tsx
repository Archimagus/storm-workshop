import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SubPartType } from "@/lib/types";
import { useStormworkshop } from "@/StormworkshopProvider";
import { Box, Boxes, CircleDot, Grid2X2, Share2, Ship } from "lucide-react";

const subPartTypes = Object.values(SubPartType);

const subPartData = {
  [SubPartType.VisibleSurface]: {
    label: "Surface",
    icon: <Grid2X2 className="h-4 w-4" />,
    description: "A surface is a flat part of the part.",
    defaultEnabled: true,
  },
  [SubPartType.HiddenSurface]: {
    label: "Hidden Surface",
    icon: <Grid2X2 className="h-4 w-4 text-red-400" />,
    description: "A hidden surface is a hidden surface.",
    defaultEnabled: false,
  },
  [SubPartType.BouancySurface]: {
    label: "Bouancy Surface",
    icon: <Ship className="h-4 w-4 text-yellow-400" />,
    description:
      "A bouancy surface is a surface that is used to calculate buoyancy.",
    defaultEnabled: false,
  },
  [SubPartType.LogicNode]: {
    label: "Logic Node",
    icon: <Share2 className="h-4 w-4" />,
    description: "A logic node is a node that is used to calculate logic.",
    defaultEnabled: false,
  },
  [SubPartType.Voxel]: {
    label: "Voxel",
    icon: <Box className="h-4 w-4" />,
    description: "A voxel is a voxel.",
    defaultEnabled: false,
  },
  [SubPartType.ReserveVoxel]: {
    label: "Reserve Voxel",
    icon: <Box className="h-4 w-4 text-red-400" />,
    description: "A reserve voxel is a voxel that is used to calculate voxels.",
    defaultEnabled: false,
  },
  [SubPartType.Mesh]: {
    label: "Mesh",
    icon: <Boxes className="h-4 w-4" />,
    description: "A mesh is a mesh.",
    defaultEnabled: true,
  },
  [SubPartType.EditorOnlyMesh]: {
    label: "Editor Only Mesh",
    icon: <Boxes className="h-4 w-4 text-blue-400" />,
    description: "A mesh that is only visible in the editor.",
    defaultEnabled: true,
  },
  [SubPartType.PipeConnection]: {
    label: "Pipe Connection",
    icon: <CircleDot className="h-4 w-4" />,
    description: "A pipe connection is a pipe connection.",
    defaultEnabled: true,
  },
};

export function ControlsMenu() {
  const { visibility, setVisibility } = useStormworkshop();

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
            defaultChecked={false}
            onChange={() => setVisibility((prev) => [...prev, type])}
          >
            {subPartData[type].icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
