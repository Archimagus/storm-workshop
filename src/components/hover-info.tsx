import { useStormworkshop } from "@/provider/useStormworkshop";
import { FC } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

export const HoverInfo: FC = () => {
  const { hoveredObject } = useStormworkshop();
  if (!hoveredObject) return null;
  return (
    <Card className="absolute top-0 right-0 pointer-events-none max-w-96">
      <CardHeader>{hoveredObject.name}</CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(hoveredObject.content, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};
