import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "../components/screens/HomeScreen/HomeScreen";
import { ProductCatalogScreen } from "../components/screens/ProductCatalogScreen/ProductCatalogScreen";
import { Footer } from "../components/ui/Footer/Footer";
import { NavBar } from "../components/ui/NavBar/NavBar";

export const AppRouter = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/productsCatalog/*" element={<ProductCatalogScreen />} />
      </Routes>
      <Footer />
    </>
  );
};
