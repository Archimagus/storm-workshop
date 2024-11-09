import { useMemo } from "react";
import {
  BufferGeometry,
  Path,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";

export function CircleShape({
  outerRadius = 0.07,
  innerRadius = 0.035,
  offset = 0,
}: {
  outerRadius?: number;
  innerRadius?: number;
  offset?: number;
}) {
  // Create a shape
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.ellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2, true);
    shape.holes.push(
      new Path().ellipse(0, 0, innerRadius, innerRadius, 0, Math.PI * 2, true)
    );
    const geometry = new ShapeGeometry(shape);
    geometry.translate(0, 0, offset);
    return geometry;
  }, [outerRadius, innerRadius, offset]);

  return <primitive object={geometry} />;
}

export function SquareWithHoleShape({
  radius = 0.089,
}: {
  radius?: number;
  offset?: number;
}) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.125, -0.125);
    shape.lineTo(0.125, -0.125);
    shape.lineTo(0.125, 0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    shape.holes.push(
      new Path().setFromPoints(
        new Path()
          .ellipse(0, 0, radius, radius, 0, Math.PI * 2, true, Math.PI / 8)
          .getSpacedPoints(8)
      )
    );
    const geometry = new ShapeGeometry(shape);
    return geometry;
  }, [radius]);
  return <primitive object={geometry} />;
}

export function TriangleShape({ rotation = 0 }: { rotation?: number }) {
  // Create a shape
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.125, -0.125);
    shape.lineTo(0.125, -0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    const geometry = new ShapeGeometry(shape);
    geometry.rotateZ(rotation);
    return geometry;
  }, [rotation]);
  return <primitive object={geometry} />;
}
export function SlopeShape({ rotation = 0 }: { rotation?: number }) {
  const geometry = useMemo(() => {
    const geometry = new PlaneGeometry(0.25, 0.3535533905932738);
    geometry.rotateX(Math.PI / -4);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function PyramidShape({ rotation = 0 }: { rotation?: number }) {
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setFromPoints([
      new Vector3(0.125, 0.125, -0.125),
      new Vector3(-0.125, -0.125, -0.125),
      new Vector3(0.125, -0.125, 0.125),
    ]);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function InvPyramidShape({ rotation = 0 }: { rotation?: number }) {
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setFromPoints([
      new Vector3(-0.125, -0.125, 0.125),
      new Vector3(0.125, 0.125, 0.125),
      new Vector3(-0.125, 0.125, -0.125),
    ]);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}
