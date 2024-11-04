import { Part } from "@/lib/parse_part_definition";
import { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ComponentUIProps {
  part: Part;
}

export const ComponentUI: FC<ComponentUIProps> = ({ part }) => {
  return (
    <Card className="bg-transparent border-none">
      <CardHeader>
        <CardTitle>{part.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <span>Category: {part.category}</span>
        <span>Type: {part.type}</span>
        <span>Mass: {part.mass}</span>
        <span>Value: {part.value}</span>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};
