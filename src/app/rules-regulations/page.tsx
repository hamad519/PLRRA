import { RulesRegulationsHeroSection } from "@/components/sections/RulesRegulationsHeroSection";
import { RulesRegulationsContentSection } from "@/components/sections/RulesRegulationsContentSection";

export default function RulesRegulationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <RulesRegulationsHeroSection />
      <RulesRegulationsContentSection />
    </div>
  );
}