import { HomeScreen } from "../components/screens/HomeScreen/HomeScreen";
import { NavBar } from "../components/ui/NavBar/NavBar";

export const AppRouter = () => {
  return (
    <div>
      <NavBar />
      <HomeScreen />
    </div>
  );
};
