import { useContext } from "react";
import { StormworkshopContext } from "./stormworkshop-context";

export function useStormworkshop() {
  const context = useContext(StormworkshopContext);
  if (!context) {
    throw new Error(
      "useStormworkshop must be used within a StormworkshopProvider."
    );
  }

  return context;
}
