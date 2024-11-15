import * as Shapes from "@/components/ThreeD/Shapes";
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

const getSurfaceColor = (trans_type: number) => {
  switch (trans_type) {
    case 0:
      return "white";
    case 1:
      return "orange";
    case 2:
      return "teal";
    case 3:
      return "blue";
    case 4:
      return "black";
  }
};

export function getSurfaceGeometry(surface: Surface) {
  switch (surface.shape) {
    case 0:
    case 1:
      return <Shapes.SquareShape />;
    case 2:
      return (
        <Shapes.TriangleChunkShape
          length={1}
          chunk={0}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 3:
      return (
        <Shapes.TransmissionShape color={getSurfaceColor(surface.transType)} />
      );
    case 4:
      return <Shapes.StaticShape />;
    case 5:
      return <Shapes.WeightShape />;
    case 6:
      return <Shapes.SlopeShape rotation={surfaceRotationToLocal(surface)} />;
    case 7:
      return <Shapes.PyramidShape rotation={surfaceRotationToLocal(surface)} />;
    case 8:
      return (
        <Shapes.InvPyramidShape rotation={surfaceRotationToLocal(surface)} />
      );
    case 9:
      return (
        <Shapes.TriangleChunkShape
          length={2}
          chunk={0}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 10:
      return (
        <Shapes.TriangleChunkShape
          length={2}
          chunk={1}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 11:
      return (
        <Shapes.TriangleChunkShape
          length={2}
          chunk={0}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 12:
      return (
        <Shapes.TriangleChunkShape
          length={2}
          chunk={1}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 13:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={0}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 14:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={1}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 15:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={2}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 16:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={3}
          mirror={false}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 17:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={0}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 18:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={1}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 19:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={2}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 20:
      return (
        <Shapes.TriangleChunkShape
          length={4}
          chunk={3}
          mirror={true}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 21:
      return (
        <Shapes.SlopeChunkShape
          length={2}
          chunk={0}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 22:
      return (
        <Shapes.SlopeChunkShape
          length={2}
          chunk={1}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 23:
      return (
        <Shapes.SlopeChunkShape
          length={4}
          chunk={0}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 24:
      return (
        <Shapes.SlopeChunkShape
          length={4}
          chunk={1}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 25:
      return (
        <Shapes.SlopeChunkShape
          length={4}
          chunk={2}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 26:
      return (
        <Shapes.SlopeChunkShape
          length={4}
          chunk={3}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 27:
      return (
        <Shapes.PyramidChunkShape
          length={2}
          chunk={0}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 28:
      return (
        <Shapes.PyramidChunkShape
          length={2}
          chunk={1}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 29:
      return (
        <Shapes.PyramidChunkShape
          length={4}
          chunk={0}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 30:
      return (
        <Shapes.PyramidChunkShape
          length={4}
          chunk={1}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 31:
      return (
        <Shapes.PyramidChunkShape
          length={4}
          chunk={2}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 32:
      return (
        <Shapes.PyramidChunkShape
          length={4}
          chunk={3}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 49:
      return (
        <Shapes.InvPyramidChunkShape
          length={4}
          chunk={0}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 50:
      return (
        <Shapes.InvPyramidChunkShape
          length={4}
          chunk={1}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 51:
      return (
        <Shapes.InvPyramidChunkShape
          length={4}
          chunk={2}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    case 52:
      return (
        <Shapes.InvPyramidChunkShape
          length={4}
          chunk={3}
          rotation={surfaceRotationToLocal(surface)}
        />
      );
    default:
      // Until we figure out what shape things actually are, we'll just use a circle
      return <circleGeometry args={[0.125, 32]} />;
  }
}

// Shape IDs
// 0    none
// 1    square
// 2    triangle
// 3    transmission
// 4    static
// 5    weight
// 6    diagonal square
// 7    diagonal triangle
// 8    inv_triangle
// 9    triangle 2a
// 10    triangle 2b
// 11    triangle 2a alt
// 12    triangle 2b alt
// 13    triangle 4a
// 14    triangle 4b
// 15    triangle 4c
// 16    triangle 4d
// 17    triangle 4a alt
// 18    triangle 4b alt
// 19    triangle 4c alt
// 20    triangle 4d alt
// 21    diagonal square 2a
// 22    diagonal square 2b
// 23    diagonal square 4a
// 24    diagonal square 4b
// 25    diagonal square 4c
// 26    diagonal square 4d
// 27    diagonal triangle 2a
// 28    diagonal triangle 2b
// 29    diagonal triangle 4a
// 30    diagonal triangle 4b
// 31    diagonal triangle 4c
// 32    diagonal triangle 4d
// 33    diagonal triangle 2x2a
// 34    diagonal triangle 2x2b
// 35    diagonal triangle 2x4a
// 36    diagonal triangle 2x4b
// 37    diagonal triangle 2x4c
// 38    diagonal triangle 2x4d
// 39    diagonal triangle 2x4a alt
// 40    diagonal triangle 2x4b alt
// 41    diagonal triangle 2x4c alt
// 42    diagonal triangle 2x4d alt
// 43    diagonal triangle 4x4a
// 44    diagonal triangle 4x4b
// 45    diagonal triangle 4x4c
// 46    diagonal triangle 4x4d
// 47    diagonal inv_triangle 2a
// 48    diagonal inv_triangle 2b
// 49    diagonal inv_triangle 4a
// 50    diagonal inv_triangle 4b
// 51    diagonal inv_triangle 4c
// 52    diagonal inv_triangle 4d
// 53    diagonal inv_triangle 2x2a
// 54    diagonal inv_triangle 2x2b
// 55    diagonal inv_triangle 2x4a
// 56    diagonal inv_triangle 2x4b
// 57    diagonal inv_triangle 2x4c
// 58    diagonal inv_triangle 2x4d
// 59    diagonal inv_triangle 2x4a alt
// 60    diagonal inv_triangle 2x4b alt
// 61    diagonal inv_triangle 2x4c alt
// 62    diagonal inv_triangle 2x4d alt
// 63    diagonal inv_triangle 4x4a
// 64    diagonal inv_triangle 4x4b
// 65    diagonal inv_triangle 4x4c
// 66    diagonal inv_triangle 4x4d
