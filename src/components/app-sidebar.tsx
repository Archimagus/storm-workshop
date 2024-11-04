import { ShipWheel } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { parsePartDefinition } from "@/lib/parse_part_definition";
import { useModStorm } from "@/ModStormProvider";
import { ChevronDown } from "lucide-react";
import { ComponentUI } from "./component-ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

export function AppSidebar() {
  const { parts, setParts } = useModStorm();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div
                    className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-accent/50 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      const files = Array.from(e.dataTransfer.files);
                      const xmlFile = files.find((file) =>
                        file.name.endsWith(".xml")
                      );

                      if (xmlFile) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const content = e.target?.result as string;
                          // Handle XML content here
                          const part = parsePartDefinition(content);
                          setParts([...parts, part]);
                        };
                        reader.readAsText(xmlFile);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ShipWheel className="h-4 w-4" />
                      <span className="text-sm text-center whitespace-nowrap">
                        Drop Part Definition XML file here
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {parts.map((part) => (
                <Collapsible
                  defaultOpen
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
