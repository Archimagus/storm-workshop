import { usePremGenerator } from "@/hooks/use-prem-generator";
import { Environment } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { EquirectangularReflectionMapping } from "three";
import { EXRLoader } from "three-stdlib";

export const Background: React.FC = () => {
  const texture = useLoader(
    EXRLoader,
    "https://utfs.io/f/VQounLkZ9ymwuYsbuNDuSlaNyCWA81VKzJne6qtbH3wTkjxm"
  );
  const pmremGenerator = usePremGenerator();
  const { bgTexture } = useMemo(() => {
    if (!pmremGenerator) return { bgTexture: null };
    texture.mapping = EquirectangularReflectionMapping;
    const bgTexture = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    return { bgTexture };
  }, [texture, pmremGenerator]);

  return (
    <Suspense fallback={null}>
      {bgTexture && (
        <Environment background near={0.1} far={1000} map={bgTexture} />
      )}
    </Suspense>
  );
};
