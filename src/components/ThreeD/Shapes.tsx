import { useMemo } from "react";
import { Path, PlaneGeometry, Shape, ShapeGeometry } from "three";

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
  const shape = useMemo(() => {
    const shape = new Shape();
    shape.ellipse(0, 0, outerRadius, outerRadius, 0, Math.PI * 2, true);
    shape.holes.push(
      new Path().ellipse(0, 0, innerRadius, innerRadius, 0, Math.PI * 2, true)
    );
    const geometry = new ShapeGeometry(shape);
    geometry.translate(0, 0, offset);
    return geometry;
  }, []);

  return <primitive object={shape} />;
}
export function TriangleShape({ rotation = 0 }: { rotation?: number }) {
  // Create a shape
  const shape = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.125, -0.125);
    shape.lineTo(0.125, 0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    const geometry = new ShapeGeometry(shape);
    geometry.rotateZ(rotation);
    return geometry;
  }, []);
  return <primitive object={shape} />;
}
export function SlopeShape() {
  const geometry = useMemo(() => {
    const shape = new PlaneGeometry(0.25, 0.3535533905932738);
    shape.rotateX(Math.PI / -4);
    shape.translate(0, 0, -0.125);
    return shape;
  }, []);
  return <primitive object={geometry} />;
}
