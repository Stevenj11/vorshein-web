import { AssessmentBanner } from "@/components/home/AssessmentBanner";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { Gen001Teaser } from "@/components/home/Gen001Teaser";
import { Hero } from "@/components/home/Hero";
import { HowItWorksTeaser } from "@/components/home/HowItWorksTeaser";
import { PhilosophyTeaser } from "@/components/home/PhilosophyTeaser";
import { PricingTeaser } from "@/components/home/PricingTeaser";
import { ProgramsTeaser } from "@/components/home/ProgramsTeaser";
import { ProgressionTeaser } from "@/components/home/ProgressionTeaser";
import { SystemTeaser } from "@/components/home/SystemTeaser";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Hero />
      <HowItWorksTeaser locale={locale} />
      <PhilosophyTeaser />
      <ProgramsTeaser />
      <SystemTeaser />
      <ProgressionTeaser locale={locale} />
      <Gen001Teaser locale={locale} />
      <PricingTeaser locale={locale} />
      <AssessmentBanner />
      <EventsTeaser />
    </>
  );
}
