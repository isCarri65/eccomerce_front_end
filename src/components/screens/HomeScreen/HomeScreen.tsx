import { CategorySection } from "../../ui/HomeScreenComponents/CategorySection/CategorySection";
import { PrincipalSection } from "../../ui/HomeScreenComponents/PrincipasSection/PrincipalSecton";
import { ProductCarruselSection } from "../../ui/HomeScreenComponents/ProductCarruselSection/ProductCarruselSection";
export const HomeScreen = () => {
  return (
    <main>
      <PrincipalSection />
      <CategorySection />
      <ProductCarruselSection />
    </main>
  );
};
