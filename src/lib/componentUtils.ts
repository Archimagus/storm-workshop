import { Position } from "@/lib/parse_part_definition";
import { EulerTuple } from "three";

const defaultPosition: [number, number, number] = [0, 0, 0];

export const componentPositionToLocal = (
  position: Position | null
): [number, number, number] => {
  if (!position) return defaultPosition;
  return [position.x * 0.25, position.y * 0.25, position.z * 0.25];
};
/**
 * Converts the orientation of a component to the local coordinate system.
 * 0 -> +X
 * 1 -> -X
 * 2 -> +Y
 * 3 -> -Y
 * 4 -> +Z
 * 5 -> -Z
 * @param orientation The orientation of the component.
 * @returns The orientation of the component in the local coordinate system.
 */
export const componentOrientationToLocal = (
  orientation: number
): EulerTuple => {
  switch (orientation) {
    case 0:
      return [0, Math.PI / 2, 0];
    case 1:
      return [0, -Math.PI / 2, 0];
    case 2:
      return [-Math.PI / 2, 0, 0];
    case 3:
      return [Math.PI / 2, 0, 0];
    case 4:
      return [0, 0, 0];
    case 5:
      return [0, Math.PI, 0];
    default:
      return [0, 0, 0];
  }
};
