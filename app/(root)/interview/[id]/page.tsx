import Agent from "@/components/Agent";
import InterviewActions from "@/components/InterviewActions";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById } from "@/lib/actions/general.action";
import { ArrowLeft, Clock3, FileText, Layers3, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const InterviewSessionPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) redirect("/interview");

  const isRoadmapInterview = interview.roadmapId && interview.moduleId;

  const backHref = isRoadmapInterview
    ? `/roadmaps/${interview.roadmapId}/modules/${interview.moduleId}`
    : "/interview";

  const backLabel = isRoadmapInterview
    ? "Back to module"
    : "Back to interviews";

  const normalizedType = /mix/gi.test(interview.type)
    ? "Mixed"
    : interview.type;

  return (
    <section className="space-y-5">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={backHref}
              className="mb-3 inline-flex items-center gap-2 text-sm text-[#859599] transition hover:text-[#F4F1EA]"
            >
              <ArrowLeft size={14} />
              {backLabel}
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold capitalize tracking-[-0.025em]">
                {interview.role} Interview
              </h1>

              <span className="rounded-md border border-white/6 bg-white/2.5 px-2 py-0.5 text-xs capitalize text-[#A8B3AD]">
                {normalizedType}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {interview.userId === user?.id && (
              <InterviewActions
                interviewId={id}
                userId={user.id}
                redirectAfterDelete
              />
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_15%,rgba(45,212,191,0.09),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-0 divide-y divide-white/6 lg:grid-cols-[1fr_340px] lg:divide-x lg:divide-y-0">
          <div className="p-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SessionStat
                icon={<Target size={15} />}
                label="Mode"
                value={normalizedType}
                caption="Question style"
              />

              <SessionStat
                icon={<Layers3 size={15} />}
                label="Level"
                value={interview.level || "Practice"}
                caption="Difficulty target"
              />

              <SessionStat
                icon={<FileText size={15} />}
                label="Questions"
                value={`${interview.questions?.length ?? 0}`}
                caption="Generated set"
              />

              <SessionStat
                icon={<Clock3 size={15} />}
                label="Est. time"
                value="10–15 min"
                caption="Suggested pace"
              />
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
                  Stack focus
                </p>
                <p className="mt-1 text-sm font-medium text-[#F4F1EA]">
                  Topics covered
                </p>
              </div>

              <span className="rounded-md border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 px-2 py-1 text-xs text-[#A7F3D0]">
                {interview.techstack?.length ?? 0} areas
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {interview.techstack?.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#A8B3AD]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Agent
        userName={user?.name}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
      />
    </section>
  );
};

export default InterviewSessionPage;

function SessionStat({
  icon,
  label,
  value,
  caption,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="group rounded-md border border-white/6 bg-[#050607]/55 p-4 transition hover:border-white/10 hover:bg-white/2.5">
      <div className="flex items-center justify-between">
        <span className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 text-[#859599] transition group-hover:text-[#A7F3D0]">
          {icon}
        </span>

        <span className="text-[11px] uppercase tracking-[0.12em] text-[#69756F]">
          {label}
        </span>
      </div>

      <p className="mt-5 truncate text-lg font-semibold capitalize tracking-[-0.025em] text-[#F4F1EA]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#69756F]">{caption}</p>
    </div>
  );
}
