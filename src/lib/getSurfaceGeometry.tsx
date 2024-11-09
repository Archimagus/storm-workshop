import { SlopeShape, TriangleShape } from "@/components/ThreeD/Shapes";
import { Surface } from "@/lib/parse_part_definition";

export function getSurfaceGeometry(surface: Surface) {
  switch (surface.shape) {
    case 0:
    case 1:
      // Pretty sure these are correct
      return <planeGeometry args={[0.25, 0.25]} />;
    case 2:
      // Probably not correct
      return <TriangleShape rotation={(Math.PI / 2) * surface.rotation} />;
    case 6:
      // Maybe correct
      return <SlopeShape />;
    default:
      // Until we figure out what shape things actually are, we'll just use a circle
      return <circleGeometry args={[0.125, 32]} />;
  }
}
