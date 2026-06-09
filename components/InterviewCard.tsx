import dayjs from "dayjs";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  FileText,
} from "lucide-react";

import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && id
      ? await getFeedbackByInterviewId({ interviewId: id, userId })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D");

  const href = feedback ? `/interview/${id}/feedback` : `/interview/${id}`;

  return (
    <Link
      href={href}
      className="group block rounded-md border border-white/6 bg-(--color-surface-1) transition hover:border-white/10 hover:bg-(--color-surface-2)"
    >
      <article className="flex items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/2.5">
            {feedback ? (
              <CheckCircle2 size={15} className="text-[#2DD4BF]" />
            ) : (
              <Circle size={15} className="text-[#69756F]" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-medium capitalize text-[#F4F1EA]">
                {role} Interview
              </h3>

              <span className="rounded-md border border-white/6 bg-white/2.5 px-2 py-0.5 text-[11px] capitalize text-[#859599]">
                {normalizedType}
              </span>
            </div>

            <p className="mt-1 line-clamp-1 text-sm text-[#859599]">
              {feedback?.finalAssessment ||
                "Start this practice session to generate a structured feedback report."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-(--color-accent)">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                {formattedDate}
              </span>

              <span className="flex items-center gap-1.5">
                <FileText size={13} />
                {feedback ? `${feedback.totalScore}/100` : "Not taken"}
              </span>

              <p className="text-xs text-(--color-accent)">
                {techstack
                  .join(" • ")
                  .replace(/\s*•\s*/g, " • ")}
              </p>
            </div>
          </div>
        </div>

        <span className="flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-(--color-accent) opacity-80 transition group-hover:bg-(--color-accent)/10 group-hover:opacity-100">
          {feedback ? "Open" : "Start"}
          <ArrowRight size={14} />
        </span>
      </article>
    </Link>
  );
};

export default InterviewCard;
