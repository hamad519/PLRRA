import { UpcomingEventsHeroSection } from "@/components/sections/UpcomingEventsHeroSection";
import { UpcomingEventsContentSection } from "@/components/sections/UpcomingEventsContentSection";

export default function UpcomingEventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <UpcomingEventsHeroSection />
      <UpcomingEventsContentSection />
    </div>
  );
}