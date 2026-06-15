"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { deleteInterviewById } from "@/lib/actions/general.action";

export default function InterviewActions({
  interviewId,
  userId,
  redirectAfterDelete = false,
}: {
  interviewId: string;
  userId: string;
  redirectAfterDelete?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this interview? This will also remove its feedback report if one exists."
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteInterviewById({ interviewId, userId });

      if (!result.success) {
        alert(result.message || "Could not delete interview.");
        return;
      }

      if (redirectAfterDelete) {
        router.push("/interview");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDelete();
        }}
        className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 text-[#859599] transition hover:border-white/10 hover:bg-white/6 hover:text-[#F4F1EA] disabled:opacity-50"
        title="Delete interview"
      >
        {isPending ? (
          <span className="size-3 rounded-full border border-[#859599] border-t-transparent animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}