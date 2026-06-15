"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { createRoadmapModuleInterview } from "@/lib/actions/general.action";

export default function CreateModuleInterviewButton({
  userId,
  roadmapId,
  moduleId,
  label = "Generate module interview",
}: {
  userId: string;
  roadmapId: string;
  moduleId: string;
  label?: string;
}) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (isCreating) return;

    setIsCreating(true);

    try {
      const result = await createRoadmapModuleInterview({
        userId,
        roadmapId,
        moduleId,
      });

      if (!result.success || !result.interviewId) {
        throw new Error(result.message || "Could not create interview.");
      }

      router.push(`/interview/${result.interviewId}`);
    } catch (error) {
      console.error(error);
      alert("Could not create module interview. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isCreating}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-4 text-sm font-medium text-[#03110F] transition hover:bg-(--color-accent)/80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isCreating ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Creating
        </>
      ) : (
        <>
          <Plus size={15} />
          {label}
          <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}