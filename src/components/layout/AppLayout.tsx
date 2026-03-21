import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content — visually hidden, revealed on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-primary-700 focus:font-semibold focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
