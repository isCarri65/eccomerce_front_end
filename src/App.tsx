import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { AppRouter } from "./routes/AppRouter";
import "tailwindcss";
function App() {
  const { autoLogin, loading } = useAuth();

  useEffect(() => {
    console.log("autologin ejecutado");
    autoLogin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
