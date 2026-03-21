import { BrowserRouter, Routes, Route } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { RetraiteCalculateurPage } from "./pages/RetraiteCalculateurPage";
import { RoadToMillionsPage } from "./pages/RoadToMillionsPage";
import { AuthPage } from "./pages/AuthPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/outils/retraite" element={<RetraiteCalculateurPage />} />
          <Route path="/outils/millions" element={<RoadToMillionsPage />} />
          <Route path="/connexion" element={<AuthPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
