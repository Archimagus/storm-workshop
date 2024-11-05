import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./App.css";
import { ControlsMenu } from "./components/controls-menu";
import { HoverInfo } from "./components/hover-info";
import { ThemeProvider } from "./components/theme-provider";
import { Viewer } from "./components/viewer";
import { StormworkshopProvider } from "./StormworkshopProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="Stormworkshop-ui-theme">
      <StormworkshopProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="h-full w-full">
            <ControlsMenu />
            <Viewer />
            <SidebarTrigger />
            <HoverInfo />
            {/* <RawXmlOverlay /> */}
          </main>
        </SidebarProvider>
      </StormworkshopProvider>
    </ThemeProvider>
  );
}

export default App;
