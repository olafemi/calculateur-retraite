/**
 * RetraiteCalculateurPage — Page wrapper for the Retirement Calculator.
 *
 * Renders the RetraiteWizard inside the AppLayout.
 * Mobile: edge-to-edge with px-4 padding.
 * Desktop: white card wrapper centered on page.
 * Bottom padding accounts for sticky nav bar on mobile (~80px).
 */
import { RetraiteWizard } from "../components/retraite/RetraiteWizard.tsx";

export function RetraiteCalculateurPage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] pt-20 md:pt-24 pb-28 md:pb-16 px-4">
      <div className="w-full max-w-sm sm:max-w-[480px] md:max-w-[560px] lg:max-w-[640px] mx-auto md:bg-white md:rounded-lg md:shadow-card md:border md:border-neutral-200 md:p-8 lg:p-10">
        <RetraiteWizard />
      </div>
    </section>
  );
}
