import { HeroCarouselSection } from "@/components/sections/HeroCarouselSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { RecordsSection } from "@/components/sections/RecordsSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { CompetitionCarouselSection } from "@/components/sections/CompetitionCarouselSection";
import { Reveal } from "@/components/animations/Reveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroCarouselSection />

      <Reveal direction="up">
        <CompetitionCarouselSection />
      </Reveal>

      <Reveal direction="up">
        <UpcomingEventsSection />
      </Reveal>

      <Reveal direction="up" delay={0.3}>
        <AboutSection />
      </Reveal>

      <Reveal direction="up">
        <RecordsSection />
      </Reveal>
    </div>
  );
}
