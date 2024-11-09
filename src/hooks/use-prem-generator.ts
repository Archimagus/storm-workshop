import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { PMREMGenerator } from "three";

export const usePremGenerator = () => {
  const renderer = useThree((state) => state.gl);

  const prem = useMemo(() => {
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    return pmremGenerator;
  }, [renderer]);
  return prem;
};
