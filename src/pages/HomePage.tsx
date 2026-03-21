import { TOOLS } from "../data/tools";
import { PRICING_PLANS } from "../data/pricing";
import { HeroSection } from "../components/landing/HeroSection";
import { ToolCardsSection } from "../components/landing/ToolCardsSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { PricingSection } from "../components/landing/PricingSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolCardsSection tools={TOOLS} />
      <HowItWorksSection />
      <PricingSection plans={PRICING_PLANS} />
    </>
  );
}
