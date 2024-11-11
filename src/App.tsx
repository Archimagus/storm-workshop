import packageInfo from "@/../package.json";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./App.css";
import { ControlsMenu } from "./components/controls-menu";
import { HoverInfo } from "./components/hover-info";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Viewer } from "./components/viewer";
import { StormworkshopProvider } from "./provider/stormworkshop-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="Stormworkshop-ui-theme">
      <StormworkshopProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="h-full w-full relative">
            <ControlsMenu />
            <Viewer />
            <HoverInfo />
            <SidebarTrigger />
            <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-700">
              Version:{packageInfo.version}
            </div>
            {/* <RawXmlOverlay /> */}
          </main>
        </SidebarProvider>
      </StormworkshopProvider>
    </ThemeProvider>
  );
}

export default App;
