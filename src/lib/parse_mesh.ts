import { BufferGeometry, Float32BufferAttribute } from "three";

interface Vertex {
  position: [number, number, number];
  color: [number, number, number, number];
  normal: [number, number, number];
}

interface Triangle {
  vertices: [number, number, number];
}

interface SubMesh {
  startIndex: number;
  endIndex: number;
  shaderId: number;
  cullingArea: {
    min: [number, number, number];
    max: [number, number, number];
  };
}

interface MeshData {
  vertexCount: number;
  vertices: Vertex[];
  edgeBuffer: number;
  triangles: Triangle[];
  subMeshes: {
    count: number;
    meshes: SubMesh[];
  };
}

export function parseMeshFile(file: File): Promise<BufferGeometry> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const content = e.target?.result as ArrayBuffer;
        const mesh = parseMesh(new Uint8Array(content));
        const geometry = new BufferGeometry();
        geometry.setIndex(
          mesh.triangles.flatMap((triangle) => triangle.vertices)
        );
        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(
            mesh.vertices.flatMap((v) => v.position),
            3
          )
        );
        geometry.setAttribute(
          "normal",
          new Float32BufferAttribute(
            mesh.vertices.flatMap((v) => v.normal),
            3
          )
        );
        geometry.setAttribute(
          "color",
          new Float32BufferAttribute(
            mesh.vertices.flatMap((v) => v.color),
            4
          )
        );
        mesh.subMeshes.meshes.forEach((subMesh) => {
          const start = subMesh.startIndex;
          const end = subMesh.endIndex;
          geometry.addGroup(start, end - start, subMesh.shaderId);
        });
        resolve(geometry);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}

function readFloat32(buffer: DataView, offset: number): number {
  if (offset >= buffer.byteLength) {
    throw new Error("Offset is greater than buffer length");
  }
  return buffer.getFloat32(offset, true);
}

function readUint16(buffer: DataView, offset: number): number {
  if (offset >= buffer.byteLength) {
    throw new Error("Offset is greater than buffer length");
  }
  return buffer.getUint16(offset, true);
}

function readUint32(buffer: DataView, offset: number): number {
  if (offset >= buffer.byteLength) {
    throw new Error("Offset is greater than buffer length");
  }
  return buffer.getUint32(offset, true);
}

export function parseMesh(bin: Uint8Array): MeshData {
  let offset = 8; // Skip initial header (6D 65 73 68 07 00 01 00)

  const dataView = new DataView(bin.buffer);

  // Read vertex count
  const vertexCount = readUint16(dataView, offset);
  offset += 6; // Skip to vertex data

  // Read vertices
  const vertices: Vertex[] = [];
  for (let i = 0; i < vertexCount; i++) {
    const vertex: Vertex = {
      position: [
        -readFloat32(dataView, offset),
        readFloat32(dataView, offset + 4),
        readFloat32(dataView, offset + 8),
      ],
      color: [
        bin[offset + 12] / 255,
        bin[offset + 13] / 255,
        bin[offset + 14] / 255,
        bin[offset + 15] / 255,
      ],
      normal: [
        -readFloat32(dataView, offset + 16),
        readFloat32(dataView, offset + 20),
        readFloat32(dataView, offset + 24),
      ],
    };
    vertices.push(vertex);
    offset += 28;
  }

  // Read edge buffer
  const edgeBuffer = readUint32(dataView, offset);
  offset += 4;

  // Read triangles
  const triangleCount = (edgeBuffer * 2) / 6;
  const triangles: Triangle[] = [];
  for (let i = 0; i < triangleCount; i++) {
    triangles.push({
      vertices: [
        readUint16(dataView, offset),
        readUint16(dataView, offset + 2),
        readUint16(dataView, offset + 4),
      ],
    });
    offset += 6;
  }

  // Read submeshes
  const subMeshCount = readUint16(dataView, offset);
  offset += 2;

  const subMeshes: SubMesh[] = [];
  for (let i = 0; i < subMeshCount; i++) {
    const startIndex = readUint32(dataView, offset);
    offset += 4;
    const endIndex = readUint32(dataView, offset);
    offset += 6; // Skip padding
    const shaderId = readUint16(dataView, offset);
    offset += 2;

    const cullingArea: {
      max: [number, number, number];
      min: [number, number, number];
    } = {
      max: [
        readFloat32(dataView, offset),
        readFloat32(dataView, offset + 4),
        readFloat32(dataView, offset + 8),
      ],
      min: [
        readFloat32(dataView, offset + 12),
        readFloat32(dataView, offset + 16),
        readFloat32(dataView, offset + 20),
      ],
    };
    offset += 24;

    subMeshes.push({
      startIndex,
      endIndex,
      shaderId,
      cullingArea,
    });

    offset += 2;
    const idLength = readUint16(dataView, offset);
    offset += idLength + 16; // Skip ID and padding
  }

  return {
    vertexCount,
    vertices,
    edgeBuffer,
    triangles,
    subMeshes: {
      count: subMeshCount,
      meshes: subMeshes,
    },
  };
}
