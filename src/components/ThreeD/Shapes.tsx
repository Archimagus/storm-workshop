import { useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorRepresentation,
  ExtrudeGeometry,
  Path,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  Vector3,
} from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

function setVertexColors(geometry: BufferGeometry, color: ColorRepresentation) {
  const count = geometry.attributes.position.count;
  const colors = Array(count).fill(new Color(color).toArray()).flat();
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colors), 3)
  );
}
function debugColors(geometry: BufferGeometry) {
  const colors = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(colors), 3)
  );
}

export function SquareShape({
  color = "white",
}: {
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const geometry = new PlaneGeometry(0.25, 0.25);
    setVertexColors(geometry, color);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function CircleShape({
  outerRadius = 0.07,
  innerRadius = 0.035,
  offset = 0,
  color = "white",
}: {
  outerRadius?: number;
  innerRadius?: number;
  offset?: number;
  color?: ColorRepresentation;
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
    setVertexColors(geometry, color);
    return geometry;
  }, [outerRadius, innerRadius, offset]);

  return <primitive object={geometry} />;
}

export function SquareWithHoleShape({
  radius = 0.089,
  color = "white",
}: {
  radius?: number;
  color?: ColorRepresentation;
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
    setVertexColors(geometry, color);
    return geometry;
  }, [radius]);
  return <primitive object={geometry} />;
}

export function TriangleShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  // Create a shape
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.125, -0.125);
    shape.lineTo(0.125, -0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    const geometry = new ShapeGeometry(shape);
    geometry.rotateZ(rotation);
    setVertexColors(geometry, color);
    return geometry;
  }, [rotation]);
  return <primitive object={geometry} />;
}
export function SlopeShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const geometry = new PlaneGeometry(0.25, 0.3535533905932738);
    geometry.rotateX(Math.PI / -4);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    setVertexColors(geometry, color);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function PyramidShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setFromPoints([
      new Vector3(0.125, 0.125, -0.125),
      new Vector3(-0.125, -0.125, -0.125),
      new Vector3(0.125, -0.125, 0.125),
    ]);
    geometry.computeVertexNormals();
    setVertexColors(geometry, color);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function InvPyramidShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setFromPoints([
      new Vector3(-0.125, -0.125, 0.125),
      new Vector3(0.125, 0.125, 0.125),
      new Vector3(-0.125, 0.125, -0.125),
    ]);
    geometry.computeVertexNormals();
    setVertexColors(geometry, color);
    geometry.rotateZ(rotation);
    geometry.translate(0, 0, -0.125);
    return geometry;
  }, []);
  return <primitive object={geometry} />;
}

export function TransmissionShape({
  radius = 0.0675,
  centerRatio = 0.8,
  color = "white",
  rotation = 0,
}: {
  radius?: number;
  centerRatio?: number;
  color?: ColorRepresentation;
  rotation?: number;
}) {
  const geometry = useMemo(() => {
    const innerShape = new Shape().setFromPoints(
      new Path()
        .ellipse(
          0,
          0,
          radius * centerRatio,
          radius * centerRatio,
          0,
          Math.PI * 2,
          true,
          Math.PI / 8
        )
        .getSpacedPoints(8)
    );
    const outerShape = new Shape();
    outerShape.setFromPoints(
      new Path()
        .ellipse(0, 0, radius, radius, 0, Math.PI * 2, true, Math.PI / 8)
        .getSpacedPoints(8)
    );
    outerShape.holes.push(innerShape);
    let geometry1: BufferGeometry = new ShapeGeometry(outerShape);

    setVertexColors(geometry1, color);

    geometry1 = BufferGeometryUtils.toCreasedNormals(geometry1);

    let geometry2: BufferGeometry = new ExtrudeGeometry(innerShape, {
      depth: -0.003,
      bevelEnabled: false,
    });

    setVertexColors(geometry2, "#2d2d2d");

    const geometry = BufferGeometryUtils.mergeGeometries([
      geometry1,
      geometry2,
    ]);
    geometry.rotateZ(rotation);
    return geometry;
  }, [rotation]);
  return <primitive object={geometry} />;
}

export function StaticShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.125, -0.125);
    shape.lineTo(0.125, -0.125);
    shape.lineTo(0.125, 0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    shape.holes.push(
      new Path()
        .moveTo(-0.0625 / 2, -0.0625 / 2)
        .lineTo(0.0625 / 2, -0.0625 / 2)
        .lineTo(0.0625 / 2, 0.0625 / 2)
        .lineTo(-0.0625 / 2, 0.0625 / 2)
        .closePath()
    );
    const geometry = new ShapeGeometry(shape);
    setVertexColors(geometry, color);
    const geometry2 = new PlaneGeometry(0.0625, 0.0625);
    setVertexColors(geometry2, "gray");
    const geometry3 = BufferGeometryUtils.mergeGeometries([
      geometry,
      geometry2,
    ]);
    return geometry3;
  }, [rotation]);
  return <primitive object={geometry} />;
}

export function WeightShape({
  rotation = 0,
  color = "white",
}: {
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.125, -0.125);
    shape.lineTo(0.125, -0.125);
    shape.lineTo(0.125, 0.125);
    shape.lineTo(-0.125, 0.125);
    shape.closePath();
    shape.holes.push(
      new Path()
        .moveTo(0, -0.0625 / 2)
        .lineTo(0.0625 / 2, 0)
        .lineTo(0, 0.0625 / 2)
        .lineTo(-0.0625 / 2, 0)
        .closePath()
    );
    const geometry = new ShapeGeometry(shape);
    setVertexColors(geometry, color);
    const geometry2 = new PlaneGeometry(0.0625 / 2, 0.0625 / 2);
    geometry2.scale(Math.sqrt(2), Math.sqrt(2), 1);
    geometry2.rotateZ(Math.PI / 4);
    setVertexColors(geometry2, "gray");
    const geometry3 = BufferGeometryUtils.mergeGeometries([
      geometry,
      geometry2,
    ]);
    return geometry3;
  }, [rotation]);
  return <primitive object={geometry} />;
}

export function TriangleChunkShape({
  length,
  chunk,
  mirror = false,
  rotation = 0,
  color = "white",
}: {
  length: number;
  chunk: number;
  mirror: boolean;
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const totalWidth = 0.25 * length;
    const chunkWidth = totalWidth / length;
    let startX = -0.125;
    let endX = startX + chunkWidth;

    if (mirror) {
      startX = endX;
      endX = startX - chunkWidth;
    }

    const shape = new Shape();
    // Calculate the y-coordinates based on the triangle's slope
    const slope = 0.25 / totalWidth;
    // Invert the chunk number to make 0 the base
    const invertedChunk = length - chunk - 1;
    const startY = -0.125 + slope * (invertedChunk + 1) * chunkWidth;
    const endY = -0.125 + slope * invertedChunk * chunkWidth;

    shape.moveTo(startX, -0.125);
    shape.lineTo(startX, startY);
    shape.lineTo(endX, endY);
    shape.lineTo(endX, -0.125);
    shape.closePath();

    const geometry = new ShapeGeometry(shape);
    setVertexColors(geometry, color);

    if (rotation) {
      geometry.rotateZ(rotation);
    }
    return geometry;
  }, [length, chunk, mirror, rotation, color]);

  return <primitive object={geometry} />;
}

export function SlopeChunkShape({
  length,
  chunk,
  mirror = false,
  rotation = 0,
  color = "white",
}: {
  length: number;
  chunk: number;
  mirror: boolean;
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const totalWidth = 0.25 * length;
    const chunkWidth = totalWidth / length;
    // Calculate the Y-coordinates based on the slope
    const slope = 0.25 / totalWidth;
    const invertedChunk = length - chunk - 1;
    const startY = -0.125 + slope * invertedChunk * chunkWidth;
    const endY = -0.125 + slope * (invertedChunk + 1) * chunkWidth;

    const startX = -0.125;
    const endX = 0.125;
    const startZ = 0;
    const endZ = -0.25;
    const vertices = [
      new Vector3(startX, startY, startZ),
      new Vector3(endX, startY, startZ),
      new Vector3(startX, endY, endZ),
      new Vector3(endX, startY, startZ),
      new Vector3(endX, endY, endZ),
      new Vector3(startX, endY, endZ),
    ];
    const geometry = new BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.computeVertexNormals();
    setVertexColors(geometry, color);

    if (rotation) {
      geometry.rotateZ(rotation);
    }

    return geometry;
  }, [length, chunk, mirror, rotation, color]);

  return <primitive object={geometry} />;
}

export function PyramidChunkShape({
  length,
  chunk,
  mirror = false,
  rotation = 0,
  color = "white",
}: {
  length: number;
  chunk: number;
  mirror: boolean;
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const chunkWidth = 0.25;
    const totalWidth = chunkWidth * length;

    const apex = new Vector3(0.125, -0.125, totalWidth - 0.125);
    const basePoint1 = new Vector3(-0.125, -0.125, -0.125);
    const basePoint2 = new Vector3(0.125, 0.125, -0.125);

    const dist1 = chunk / length;
    const dist2 = (chunk + 1) / length;
    const point1 = new Vector3().copy(basePoint1).lerp(apex, dist1);
    const point2 = new Vector3().copy(basePoint2).lerp(apex, dist1);
    const point3 = new Vector3().copy(basePoint2).lerp(apex, dist2);
    const point4 = new Vector3().copy(basePoint1).lerp(apex, dist2);

    const vertices = [point1, point3, point2, point1, point4, point3];

    const geometry = new BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.computeVertexNormals();
    setVertexColors(geometry, color);
    geometry.translate(0, 0, -0.125 - chunk * 0.25);
    if (rotation) {
      geometry.rotateZ(rotation);
    }
    return geometry;
  }, [length, chunk, mirror, rotation, color]);

  return <primitive object={geometry} />;
}

export function InvPyramidChunkShape({
  length,
  chunk,
  mirror = false,
  rotation = 0,
  color = "white",
}: {
  length: number;
  chunk: number;
  mirror: boolean;
  rotation?: number;
  color?: ColorRepresentation;
}) {
  const geometry = useMemo(() => {
    const chunkWidth = 0.25;
    const totalWidth = chunkWidth * length;

    const apex = new Vector3(-0.125, 0.125, -0.125);
    const basePoint1 = new Vector3(-0.125, -0.125, totalWidth - 0.125);
    const basePoint2 = new Vector3(0.125, 0.125, totalWidth - 0.125);

    const invertedChunk = length - chunk - 1;

    const dist1 = invertedChunk / length;
    const dist2 = (invertedChunk + 1) / length;
    const point1 = new Vector3().copy(basePoint1).lerp(apex, dist1);
    const point2 = new Vector3().copy(basePoint2).lerp(apex, dist1);
    const point3 = new Vector3().copy(basePoint2).lerp(apex, dist2);
    const point4 = new Vector3().copy(basePoint1).lerp(apex, dist2);

    const vertices = [point1, point2, point3, point1, point3, point4];

    const geometry = new BufferGeometry();
    geometry.setFromPoints(vertices);
    geometry.computeVertexNormals();
    setVertexColors(geometry, color);
    geometry.translate(0, 0, -0.125 - chunk * 0.25);
    if (rotation) {
      geometry.rotateZ(rotation);
    }
    return geometry;
  }, [length, chunk, mirror, rotation, color]);

  return <primitive object={geometry} />;
}
