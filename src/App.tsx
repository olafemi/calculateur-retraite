import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { RetraiteCalculateurPage } from "./pages/RetraiteCalculateurPage";
import { RoadToMillionsPage } from "./pages/RoadToMillionsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

/** Scroll to top on route change (fixes Safari mobile scroll issue). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/outils/retraite" element={<RetraiteCalculateurPage />} />
          <Route path="/outils/millions" element={<RoadToMillionsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
