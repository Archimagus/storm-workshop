import {
  InvPyramidShape,
  PyramidShape,
  SlopeShape,
  TriangleShape,
} from "@/components/ThreeD/Shapes";
import { Surface } from "@/lib/parse_part_definition";

function surfaceRotationToLocal({ rotation, orientation }: Surface) {
  let rotationInRadians = (Math.PI / 2) * -rotation;
  if (orientation === 0) {
    rotationInRadians -= Math.PI / 2;
  }
  if (orientation === 1) {
    rotationInRadians += Math.PI / 2;
  }
  if (orientation === 2 || orientation === 4) {
    rotationInRadians += Math.PI;
  }
  return rotationInRadians;
}

export function getSurfaceGeometry(surface: Surface) {
  switch (surface.shape) {
    case 0:
    case 1:
    case 3:
      // Pretty sure these are correct
      return <planeGeometry args={[0.25, 0.25]} />;
    case 2:
      // Probably not correct
      return <TriangleShape rotation={surfaceRotationToLocal(surface)} />;
    case 6:
      // Maybe correct
      return <SlopeShape rotation={surfaceRotationToLocal(surface)} />;
    case 7:
      return <PyramidShape rotation={surfaceRotationToLocal(surface)} />;
    case 8:
      return <InvPyramidShape rotation={surfaceRotationToLocal(surface)} />;
    default:
      // Until we figure out what shape things actually are, we'll just use a circle
      return <circleGeometry args={[0.125, 32]} />;
  }
}
