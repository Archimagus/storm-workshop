export interface Mod {
  name: string;
  author: string;
  description: string;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface RotationMatrix {
  "00": number;
  "01": number;
  "02": number;
  "10": number;
  "11": number;
  "12": number;
  "20": number;
  "21": number;
  "22": number;
}

export interface Surface {
  orientation: number;
  rotation: number;
  shape: number;
  transType: number;
  position: Position | null;
}

export interface BouancySurface extends Surface {}

export interface LogicNode {
  orientation: number;
  label: string;
  mode: number;
  type: number;
  description: string;
  flags: number;
  position: Position | null;
}

export interface Voxel {
  flags: number;
  physicsShape: number;
  buoyPipes: number;
  position: Position | null;
  physicsShapeRotation: RotationMatrix | null;
}

export interface Connection {
  position: Position | null;
  normal: Position | null;
}

export interface PartConnections {
  prev: Connection[];
  next: Connection[];
}

export interface Part {
  name: string;
  category: number;
  type: number;
  mass: number;
  value: number;
  surfaces: Surface[];
  buoyancySurfaces: BouancySurface[];
  logicNodes: LogicNode[];
  voxels: Voxel[];
  connections: PartConnections;
  mesh_data_name: string;
  mesh_0_name: string;
  mesh_1_name: string;
  mesh_editor_only_name: string;
}

function parseSurfaces(surfacesElement: Element | null): Surface[] {
  if (!surfacesElement) return [];

  return Array.from(surfacesElement.querySelectorAll("surface")).map(
    (surface) => ({
      orientation: parseInt(surface.getAttribute("orientation") || "0"),
      rotation: parseInt(surface.getAttribute("rotation") || "0"),
      shape: parseInt(surface.getAttribute("shape") || "0"),
      transType: parseInt(surface.getAttribute("trans_type") || "0"),
      position: parsePosition(surface.querySelector("position")),
    })
  );
}

function parseBouancySurfaces(
  surfacesElement: Element | null
): BouancySurface[] {
  if (!surfacesElement) return [];

  return parseSurfaces(surfacesElement);
}

function parseLogicNodes(nodesElement: Element | null): LogicNode[] {
  if (!nodesElement) return [];

  return Array.from(nodesElement.querySelectorAll("logic_node")).map(
    (node) => ({
      orientation: parseInt(node.getAttribute("orientation") || "0"),
      label: node.getAttribute("label") || "",
      mode: parseInt(node.getAttribute("mode") || "0"),
      type: parseInt(node.getAttribute("type") || "0"),
      description: node.getAttribute("description") || "",
      flags: parseInt(node.getAttribute("flags") || "0"),
      position: parsePosition(node.querySelector("position")),
    })
  );
}

function parseVoxels(voxelsElement: Element | null): Voxel[] {
  if (!voxelsElement) {
    return [];
  }

  const voxels = Array.from(voxelsElement.querySelectorAll("voxel"));

  if (voxels.length === 0) {
    // Try direct children approach
    const directChildren = Array.from(voxelsElement.children).filter(
      (el) => el.tagName.toLowerCase() === "voxel"
    );
    if (directChildren.length > 0) {
      voxels.push(...directChildren);
    }
  }

  return voxels.map((voxel, index) => {
    try {
      const v: Voxel = {
        flags: parseInt(voxel.getAttribute("flags") || "0"),
        physicsShape: parseInt(voxel.getAttribute("physics_shape") || "0"),
        buoyPipes: parseInt(voxel.getAttribute("buoy_pipes") || "0"),
        position: parsePosition(voxel.querySelector("position")),
        physicsShapeRotation: parseRotationMatrix(
          voxel.querySelector("physics_shape_rotation")
        ),
      };
      return v;
    } catch (error) {
      console.error(`Error parsing voxel ${index}:`, error);
      console.debug("Voxel element:", voxel.outerHTML);
      // Return a default voxel instead of throwing
      return {
        flags: 0,
        physicsShape: 0,
        buoyPipes: 0,
        position: null,
        physicsShapeRotation: null,
      };
    }
  });
}

function parseConnections(connectionsElement: Element | null): Connection[] {
  if (!connectionsElement) return [];

  return Array.from(connectionsElement.querySelectorAll("j")).map(
    (connection) => ({
      position: parsePosition(connection.querySelector("pos")),
      normal: parsePosition(connection.querySelector("normal")),
    })
  );
}

function parsePosition(posElement: Element | null): Position | null {
  if (!posElement) return null;

  return {
    x: parseFloat(posElement.getAttribute("x") || "0"),
    y: parseFloat(posElement.getAttribute("y") || "0"),
    z: parseFloat(posElement.getAttribute("z") || "0"),
  };
}

function parseRotationMatrix(
  rotationElement: Element | null
): RotationMatrix | null {
  if (!rotationElement) return null;

  // Create default matrix
  const matrix: RotationMatrix = {
    "00": 0,
    "01": 0,
    "02": 0,
    "10": 0,
    "11": 0,
    "12": 0,
    "20": 0,
    "21": 0,
    "22": 0,
  };

  // Get the raw text content and parse it
  const text = rotationElement.textContent?.trim() || "";

  // Split by whitespace and parse each number
  const values = text
    .split(/\s+/)
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v));

  // Map the values to the matrix positions
  const positions = ["00", "01", "02", "10", "11", "12", "20", "21", "22"];
  values.forEach((value, index) => {
    if (index < positions.length) {
      matrix[positions[index] as keyof RotationMatrix] = value;
    }
  });

  return matrix;
}

function getXmlDocument(xmlString: string) {
  const cleanXmlString = xmlString.replace(/(\s)(\d\d)=/g, "$1_$2=");

  // Create DOM parser
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(cleanXmlString, "text/xml");

  // Check for parsing errors
  const parserError = xmlDoc.querySelector("parsererror");
  if (parserError) {
    console.error("XML parsing error:", parserError.textContent);
    throw new Error("Failed to parse XML");
  }
  return xmlDoc;
}

export function parsePartDefinitionFile(file: File): Promise<Part> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const part = parsePartDefinition(content);
        resolve(part);
      };
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}

export function parsePartDefinition(xmlString: string): Part {
  // Clean up potentially problematic attributes in the XML string
  const xmlDoc = getXmlDocument(xmlString);

  // Get the root definition element
  const definition = xmlDoc.querySelector("definition");
  if (!definition) {
    throw new Error("No definition element found in XML");
  }

  // Parse main attributes
  const result: Part = {
    name: definition.getAttribute("name") || "",
    category: parseInt(definition.getAttribute("category") || "0"),
    type: parseInt(definition.getAttribute("type") || "0"),
    mass: parseFloat(definition.getAttribute("mass") || "0"),
    value: parseInt(definition.getAttribute("value") || "0"),
    mesh_data_name: definition.getAttribute("mesh_data_name") || "",
    mesh_0_name: definition.getAttribute("mesh_0_name") || "",
    mesh_1_name: definition.getAttribute("mesh_1_name") || "",
    mesh_editor_only_name:
      definition.getAttribute("mesh_editor_only_name") || "",

    // Parse nested elements
    surfaces: parseSurfaces(definition.querySelector("surfaces")),
    buoyancySurfaces: parseBouancySurfaces(
      definition.querySelector("buoyancy_surfaces")
    ),
    logicNodes: parseLogicNodes(definition.querySelector("logic_nodes")),
    voxels: parseVoxels(definition.querySelector("voxels")),
    connections: {
      prev: parseConnections(
        definition.querySelector("jet_engine_connections_prev")
      ),
      next: parseConnections(
        definition.querySelector("jet_engine_connections_next")
      ),
    },
  };

  return result;
}
export function parseModFile(file: File): Promise<Mod> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    try {
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const mod = parseModXml(content);
        resolve(mod);
      };
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}
export function parseModXml(xmlString: string): Mod {
  const xmlDoc = getXmlDocument(xmlString);

  const mod = xmlDoc.querySelector("mod");
  if (!mod) throw new Error("No mod element found in XML");

  return {
    name: mod.getAttribute("name") || "",
    author: mod.getAttribute("author") || "",
    description: mod.getAttribute("desc") || "",
  };
}
