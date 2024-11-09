import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
  },
  // Suppress source map warnings for node_modules
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },
  },
  // Custom logger to filter out source map warnings
  customLogger: {
    warn: (msg: string) => {
      if (!msg.includes("Could not read source map")) {
        console.warn(msg);
      }
    },
    warnOnce: (msg: string) => {
      if (!msg.includes("Could not read source map")) {
        console.warn(msg);
      }
    },
    info: (msg: string) => console.info(msg),
    error: (msg: string) => console.error(msg),
    clearScreen: () => console.clear(),
    hasErrorLogged: () => false,
    hasWarned: false,
  },
  base: "/stormworkshop/", // Just the repository name with slashes
});
