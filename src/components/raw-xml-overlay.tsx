import { useModStorm } from "@/ModStormProvider";
import { FC } from "react";
import { Card, CardContent } from "./ui/card";

export const RawXmlOverlay: FC = () => {
  const { rawData } = useModStorm();

  return (
    <Card className="absolute top-0 max-h-[50vh] max-w-[50vw] overflow-auto">
      <CardContent>
        <pre className="text-xs">{rawData}</pre>
      </CardContent>
    </Card>
  );
};
