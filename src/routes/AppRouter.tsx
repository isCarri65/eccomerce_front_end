import { Route, Routes } from "react-router-dom";
import { HomeScreen } from "../components/screens/HomeScreen/HomeScreen";
import { ProductCatalogScreen } from "../components/screens/ProductCatalogScreen/ProductCatalogScreen";
import { LoginScreen } from "../components/screens/LoginScreen";
import { RegisterScreen } from "../components/screens/RegisterScreen";
import { ProfileScreen } from "../components/screens/User-Admin/ProfileScreen";
import { Footer } from "../components/ui/Footer/Footer";
import { NavBar } from "../components/ui/NavBar/NavBar";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

export const AppRouter = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/productsCatalog/*" element={<ProductCatalogScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/admin/products" element={<ProductCatalogScreen />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
};
