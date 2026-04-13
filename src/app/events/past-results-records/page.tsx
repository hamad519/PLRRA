import { PastResultsRecordsHeroSection } from "@/components/sections/PastResultsRecordsHeroSection";
import { PastResultsRecordsContentSection } from "@/components/sections/PastResultsRecordsContentSection";

export default function PastResultsRecordsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PastResultsRecordsHeroSection />
      <PastResultsRecordsContentSection />
    </div>
  );
}