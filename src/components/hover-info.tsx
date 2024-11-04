import { useModStorm } from "@/ModStormProvider";
import { FC } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

export const HoverInfo: FC = () => {
  const { hoveredObject } = useModStorm();
  if (!hoveredObject) return null;
  return (
    <Card className="absolute top-0 right-0">
      <CardHeader>{hoveredObject.name}</CardHeader>
      <CardContent>
        <pre>{JSON.stringify(hoveredObject.content, null, 2)}</pre>
      </CardContent>
    </Card>
  );
};
