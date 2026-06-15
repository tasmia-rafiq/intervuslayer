import dayjs from "dayjs";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  FileText,
} from "lucide-react";

import InterviewActions from "@/components/InterviewActions";

const InterviewCard = ({
  id,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const isCompleted = !!feedback;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D");

  const href = isCompleted ? `/interview/${id}/feedback` : `/interview/${id}`;

  return (
    <article className="group rounded-md border border-white/6 bg-(--color-surface-1) transition hover:border-white/10 hover:bg-(--color-surface-2)">
      <div className="flex items-center justify-between gap-4 p-4">
        <Link href={href} className="flex min-w-0 flex-1 items-start gap-3">
          <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/2.5">
            {isCompleted ? (
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

              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] ${
                  isCompleted
                    ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#A7F3D0]"
                    : "border-white/6 bg-white/2.5 text-[#859599]"
                }`}
              >
                {isCompleted ? "Completed" : "Pending"}
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
                {isCompleted ? `${feedback?.totalScore}/100` : "Not taken"}
              </span>

              <p className="line-clamp-1 text-xs text-(--color-accent)">
                {techstack?.join(" • ")}
              </p>
            </div>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {id && userId && (
            <InterviewActions interviewId={id} userId={userId} />
          )}

          <Link
            href={href}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-(--color-accent) opacity-80 transition group-hover:bg-(--color-accent)/10 group-hover:opacity-100"
          >
            {isCompleted ? "Open report" : "Start"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default InterviewCard;