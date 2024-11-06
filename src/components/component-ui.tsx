import { Part } from "@/lib/parse_part_definition";
import { useStormworkshop } from "@/StormworkshopProvider";
import { FC, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ComponentUIProps {
  part: Part;
}

export const ComponentUI: FC<ComponentUIProps> = ({ part }) => {
  const { meshes } = useStormworkshop();

  const missingData = useMemo(() => {
    const missing = [];
    if (part.mesh_data_name && !meshes[part.mesh_data_name])
      missing.push(part.mesh_data_name);
    if (part.mesh_0_name && !meshes[part.mesh_0_name])
      missing.push(part.mesh_0_name);
    if (part.mesh_1_name && !meshes[part.mesh_1_name])
      missing.push(part.mesh_1_name);
    if (part.mesh_editor_only_name && !meshes[part.mesh_editor_only_name])
      missing.push(part.mesh_editor_only_name);
    return missing;
  }, [meshes, part]);

  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle>{part.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Category: {part.category}</p>
        <p>Type: {part.type}</p>
        <p>Mass: {part.mass}</p>
        <p>Value: {part.value}</p>
        {missingData.length > 0 && (
          <>
            <h3 className="text-2xl">Missing Data</h3>
            {missingData.map((mesh) => (
              <p className="text-red-500" key={mesh} title={mesh}>
                {mesh}
              </p>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
};
