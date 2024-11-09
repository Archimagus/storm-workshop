import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useFileDropHandler } from "@/hooks/use-file-drop-handler";
import { useStormworkshop } from "@/StormworkshopProvider";
import { ChevronDown, ShipWheel } from "lucide-react";
import { ComponentUI } from "./component-ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function AppSidebar() {
  const { parts, openParts, setOpenParts } = useStormworkshop();

  const handleFiles = useFileDropHandler();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <img src="Stormworkshop.webp" />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div
                  className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFiles(e.dataTransfer.items);
                  }}
                  onClick={() =>
                    document.getElementById("folderInput")?.click()
                  }
                >
                  <input
                    type="file"
                    id="folderInput"
                    // @ts-ignore
                    webkitdirectory="true"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFiles(e.target.files);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ShipWheel className="h-4 w-4" />
                    <span className="text-sm text-center whitespace-nowrap">
                      Drop Mod Folder Here
                    </span>
                  </div>
                </div>
              </SidebarMenuItem>
              {parts.map((part, index) => (
                <Collapsible
                  defaultOpen={openParts.includes(index)}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenParts([...openParts, index]);
                    } else {
                      setOpenParts(openParts.filter((i) => i !== index));
                    }
                  }}
                  className="group/collapsible"
                  key={part.name}
                >
                  <SidebarGroup>
                    <SidebarGroupLabel asChild>
                      <CollapsibleTrigger>
                        {part.name}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <ComponentUI part={part} />
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
