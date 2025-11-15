import { BrowserRouter, Route, Routes } from "react-router-dom";
import { appRoutes } from "./routes";
import { useAuthSync } from "@/hooks/use-auth-sync";

export const AppRouter = () => {
  useAuthSync();

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
