import { WhoWeAreHeroSection } from "@/components/sections/WhoWeAreHeroSection";
import { AboutSectionContent } from "@/components/sections/AboutSectionContent";
import { MembershipCategoriesSection } from "@/components/sections/MembershipCategoriesSection";
import { HistorySection } from "@/components/sections/HistorySection";
import { InternationalAscendancySection } from "@/components/sections/InternationalAscendancySection";
import { MajorContributorsSection } from "@/components/sections/MajorContributorsSection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";

export default function WhoWeArePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <WhoWeAreHeroSection />
      <AboutSectionContent />
      <MembershipCategoriesSection />
      <HistorySection />
      <InternationalAscendancySection />
      <TestimonialSection />
      <MajorContributorsSection />
    </div>
  );
}
