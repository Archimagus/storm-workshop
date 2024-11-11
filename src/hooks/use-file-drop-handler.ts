import { parseMeshFile } from "@/lib/parse_mesh";
import { useStormworkshop } from "@/provider/useStormworkshop";
import {
  parseModFile,
  parsePartDefinitionFile,
} from "../lib/parse_part_definition";

let rootPath = "";
type FileWithRelativePath = { file: File; relativePath: string };
export function useFileDropHandler() {
  const { setParts, setMod, setMeshes } = useStormworkshop();

  async function handleFileList(items: FileList | DataTransferItemList) {
    function handleFiles(files: FileWithRelativePath[]) {
      setParts([]);
      setMeshes({});
      files.forEach(async (file) => {
        if (!file?.file?.name) {
          console.error("No file name", file);
          return;
        }
        if (file.file.name === "mod.xml") {
          const mod = await parseModFile(file.file);
          setMod(mod);
        } else if (file.file.name.endsWith(".xml")) {
          const part = await parsePartDefinitionFile(file.file);
          setParts((prev) => [...prev, part]);
        } else if (file.file.name.endsWith(".mesh")) {
          const mesh = await parseMeshFile(file.file);
          setMeshes((prev) => ({ ...prev, [file.relativePath]: mesh }));
        }
      });
    }

    const filePromises: Promise<FileWithRelativePath>[] = [];

    // If items is a FileList from <input type="file">, process it directly
    if (items instanceof FileList) {
      for (let i = 0; i < items.length; i++) {
        filePromises.push(
          Promise.resolve({ file: items[i], relativePath: items[i].name })
        );
      }
    } else {
      // Otherwise, handle DataTransferItemList for drag-and-drop, using webkitGetAsEntry
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if ("webkitGetAsEntry" in item) {
          const entry = (item as DataTransferItem).webkitGetAsEntry();
          rootPath = entry?.fullPath || "";
          if (entry) {
            if (entry.isDirectory) {
              filePromises.push(
                ...(await traverseDirectory(entry as FileSystemDirectoryEntry))
              );
            } else if (entry.isFile) {
              filePromises.push(
                new Promise((resolve) =>
                  (entry as FileSystemFileEntry).file((file) =>
                    resolve({ file, relativePath: file.name })
                  )
                )
              );
            }
          }
        }
      }
    }

    // Wait for all file promises to resolve
    const files = await Promise.all(filePromises);
    handleFiles(files);
  }

  // Updated traverseDirectory to return a promise that resolves with all files in the directory
  async function traverseDirectory(
    dirEntry: FileSystemDirectoryEntry
  ): Promise<Promise<FileWithRelativePath>[]> {
    const reader = dirEntry.createReader();
    const filePromises: Promise<FileWithRelativePath>[] = [];

    function readEntries(): Promise<void> {
      return new Promise((resolve, reject) => {
        reader.readEntries((entries) => {
          if (entries.length === 0) {
            resolve();
            return;
          }

          const entryPromises = entries.map((entry) => {
            if (entry.isDirectory) {
              return traverseDirectory(entry as FileSystemDirectoryEntry).then(
                (subFiles) => {
                  filePromises.push(...subFiles);
                }
              );
            } else {
              return new Promise<void>((resolve) => {
                const path = (entry as FileSystemFileEntry).fullPath;
                const relativePath = path.replace(rootPath + "/", "");
                (entry as FileSystemFileEntry).file((file) => {
                  filePromises.push(Promise.resolve({ file, relativePath }));
                  resolve();
                });
              });
            }
          });

          Promise.all(entryPromises).then(() => resolve());
        }, reject);
      });
    }

    await readEntries();
    return filePromises;
  }

  return handleFileList;
}
