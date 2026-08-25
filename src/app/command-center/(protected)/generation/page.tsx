import { getActiveGeneration } from "@/lib/generation";
import { GenerationForm } from "./GenerationForm";

export default async function GenerationPage() {
  const generation = await getActiveGeneration();
  return (
    <div className="mx-auto max-w-2xl">
      <GenerationForm generation={generation} />
    </div>
  );
}
