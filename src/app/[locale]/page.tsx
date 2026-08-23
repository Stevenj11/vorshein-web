import { AssessmentBanner } from "@/components/home/AssessmentBanner";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { Hero } from "@/components/home/Hero";
import { PhilosophyTeaser } from "@/components/home/PhilosophyTeaser";
import { ProgramsTeaser } from "@/components/home/ProgramsTeaser";
import { SystemTeaser } from "@/components/home/SystemTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <PhilosophyTeaser />
      <ProgramsTeaser />
      <SystemTeaser />
      <AssessmentBanner />
      <EventsTeaser />
    </>
  );
}
