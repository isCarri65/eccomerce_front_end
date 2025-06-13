import { Routes, Route, useLocation } from "react-router-dom";
import { HomeScreen } from "../components/screens/HomeScreen/HomeScreen";
import { ProductCatalogScreen } from "../components/screens/ProductCatalogScreen/ProductCatalogScreen";
import { LoginScreen } from "../components/screens/LoginScreen";
import { RegisterScreen } from "../components/screens/RegisterScreen";

import { AdminRoute, ProtectedRoute } from "../components/auth/ProtectedRoute";
import { NavBar } from "../components/ui/NavBar/NavBar";
import { Footer } from "../components/ui/Footer/Footer";

// Admin screens
import { ProductListScreen } from "../components/screens/admin/ProductListScreen/ProductListScreen";
import { CategoryListScreen } from "../components/screens/admin/CategoryListScreen/CategoryListScreen";
import { DiscountListScreen } from "../components/screens/admin/DiscountListScreen/DiscountListScreen";
import { ProfileScreen } from "../components/screens/User-Admin/ProfileScreen";

export const AppRouter = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Solo muestro NavBar y Footer en rutas que NO sean admin */}
      {!isAdmin && <NavBar />}
      <Routes>
        {/* PÚBLICO / USUARIO */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/productsCatalog/*" element={<ProductCatalogScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <AdminRoute>
              <ProductListScreen />
            </AdminRoute>
          }
        />

        {/* ADMIN */}
        <Route path="/admin/productos" element={<ProductListScreen />} />
        <Route path="/admin/categorias" element={<CategoryListScreen />} />
        <Route path="/admin/descuentos" element={<DiscountListScreen />} />
      </Routes>
      {/* Solo muestro Footer en rutas que NO sean admin */}
      {!isAdmin && <Footer />}
    </>
  );
};
