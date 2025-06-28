import { Routes, Route, useLocation } from "react-router-dom";
import { HomeScreen } from "../components/screens/HomeScreen/HomeScreen";
import { ProductCatalogScreen } from "../components/screens/Catalog/ProductCatalogScreen/ProductCatalogScreen";
import { LoginScreen } from "../components/screens/LoginScreen";
import { RegisterScreen } from "../components/screens/RegisterScreen";
import { ProductDetailScreen } from "../components/screens/Catalog/ProductDetailScreen/ProductDetailScreen";

import { AdminRoute, ProtectedRoute } from "../components/auth/ProtectedRoute";
import { NavBar } from "../components/ui/NavBar/NavBar";
import { Footer } from "../components/ui/Footer/Footer";
import { MessageContainer } from "../components/ui/MessageContainer/MessageContainer";

// Admin screens
import { ProductListScreen } from "../components/screens/admin/ProductListScreen/ProductListScreen";
import { CategoryListScreen } from "../components/screens/admin/CategoryListScreen/CategoryListScreen";
import { DiscountListScreen } from "../components/screens/admin/DiscountListScreen/DiscountListScreen";
import { ProfileScreen } from "../components/screens/User-Admin/ProfileScreen";
import { useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import CheckoutScreen from "../components/screens/CheckOutScreen/CheckOutScreen";

export const AppRouter = () => {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const { autoLogin } = useUsers();
  useEffect(() => {
    console.log("autologin ejecutado");
    autoLogin();
  }, []);
  return (
    <>
      {/* Solo muestro NavBar y Footer en rutas que NO sean admin */}
      {!isAdmin && <NavBar />}
      <Routes>
        {/* PÚBLICO / USUARIO */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/productsCatalog/*" element={<ProductCatalogScreen />} />
        <Route path="/product/:id" element={<ProductDetailScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/checkout" element={<CheckoutScreen />} />
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
      {/* MessageContainer global */}
      <MessageContainer />
    </>
  );
};
