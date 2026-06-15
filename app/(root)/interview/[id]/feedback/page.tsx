import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  FileText,
  LineChart,
  NotepadText,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
  getRoadmapById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
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

  const roadmap = interview.roadmapId
    ? await getRoadmapById(interview.roadmapId)
    : null;

  const currentModule = roadmap?.modules.find(
    (module) => module.id === interview.moduleId,
  );

  const currentModuleIndex =
    roadmap?.modules.findIndex((module) => module.id === interview.moduleId) ??
    -1;

  const nextModule =
    roadmap && currentModuleIndex >= 0
      ? roadmap.modules[currentModuleIndex + 1]
      : null;

  const canOpenNextModule = nextModule && nextModule.status !== "locked";

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  if (!feedback) redirect(`/interview/${id}`);

  const score = feedback.totalScore ?? 0;

  const scoreLabel =
    score >= 85
      ? "Strong"
      : score >= 70
        ? "Interview-ready"
        : score >= 50
          ? "Developing"
          : "Needs work";

  const lowestCategory = feedback.categoryScores?.reduce((lowest, current) =>
    current.score < lowest.score ? current : lowest,
  );

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={backHref}
              className="mb-3 inline-flex items-center gap-2 text-sm text-[#95a3a7] transition hover:text-[#F4F1EA]"
            >
              <ArrowLeft size={14} />
              {backLabel}
            </Link>

            <p className="text-sm text-[#95a3a7]">Feedback report</p>

            <h1 className="mt-1 truncate text-xl font-semibold capitalize tracking-[-0.025em]">
              {interview.role} Interview
            </h1>
          </div>

          <Button
            asChild
            className="h-9 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F] hover:bg-[#5EEAD4]"
          >
            <Link href={`/interview/${id}`}>
              <RotateCcw size={15} />
              Retake
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[300px_1fr]">
          <div className="border-b border-white/6 p-6 lg:border-b-0 lg:border-r">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7b8588]">
              Overall score
            </p>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-[-0.07em] text-[#F4F1EA]">
                {score}
              </span>
              <span className="mb-2 text-sm text-[#69756F]">/100</span>
            </div>

            <div className="mt-5 h-2 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-(--color-accent)"
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>

            <div className="mt-5 inline-flex rounded-md border border-(--color-accent)/20 bg-(--color-accent)/10 px-2.5 py-1 text-sm font-medium text-[#a7d1f3]">
              {scoreLabel}
            </div>

            <p className="mt-4 text-sm leading-6 text-[#a8b2b3]">
              Scored across communication, role knowledge, problem-solving, fit,
              and confidence.
            </p>
          </div>

          <div className="p-6">
            <div className="mb-4 inline-flex items-center gap-2 text-[#a7e1f3]">
              <NotepadText size={18} />
              Performance summary
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
              Your interview report is ready.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-[#b4bec0]">
              {feedback.finalAssessment}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <ReportMeta
                icon={<CalendarDays size={15} />}
                label="Created"
                value={
                  feedback.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, h:mm A")
                    : "N/A"
                }
              />

              <ReportMeta
                icon={<FileText size={15} />}
                label="Categories"
                value={`${feedback.categoryScores?.length ?? 0}`}
              />

              <ReportMeta
                icon={<Trophy size={15} />}
                label="Result"
                value={scoreLabel}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Panel
            eyebrow="Breakdown"
            title="Category performance"
            description="Each category shows the score and the reasoning behind it."
          >
            <div className="grid gap-3">
              {feedback.categoryScores?.map((category, index) => (
                <CategoryCard
                  key={category.name}
                  index={index}
                  name={category.name}
                  score={category.score}
                  comment={category.comment}
                />
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Strengths"
            title="What went well"
            description="Keep these behaviors in your next attempt."
          >
            <InsightList
              tone="positive"
              icon={<CheckCircle2 size={15} />}
              items={feedback.strengths ?? []}
              emptyText="No strengths were generated for this report."
            />
          </Panel>

          <Panel
            eyebrow="Improvement"
            title="What to work on next"
            description="Focus on these before retaking the interview."
          >
            <InsightList
              tone="warning"
              icon={<CircleAlert size={15} />}
              items={feedback.areasForImprovement ?? []}
              emptyText="No improvement areas were generated for this report."
            />
          </Panel>
        </div>

        <aside className="space-y-6">
          <SideCard
            eyebrow="Next step"
            title="Recommended action"
            icon={<Target size={15} />}
          >
            <p className="text-sm leading-6 text-[#a8b2b3]">
              {isRoadmapInterview ? (
                <>
                  This round contributes to{" "}
                  <span className="font-medium text-[#F4F1EA]">
                    {currentModule?.title ?? "your roadmap module"}
                  </span>
                  . Review the weakest category, then return to the module to
                  continue your practice path.
                </>
              ) : (
                <>
                  Retake this interview and focus first on{" "}
                  <span className="font-medium text-[#F4F1EA]">
                    {lowestCategory?.name ?? "your weakest category"}
                  </span>
                  . Use a simple structure: definition, explanation, example,
                  impact.
                </>
              )}
            </p>

            <Link
              href={`/interview/${id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#a7e1f3] transition hover:text-(--color-accent)"
            >
              Retake interview
              <RotateCcw size={14} />
            </Link>
          </SideCard>

          <SideCard
            eyebrow="Score bands"
            title="Score guide"
            icon={<LineChart size={15} />}
          >
            <div className="space-y-2">
              <GuideRow label="85–100" value="Strong" active={score >= 85} />
              <GuideRow
                label="70–84"
                value="Interview-ready"
                active={score >= 70 && score < 85}
              />
              <GuideRow
                label="50–69"
                value="Developing"
                active={score >= 50 && score < 70}
              />
              <GuideRow label="0–49" value="Needs work" active={score < 50} />
            </div>
          </SideCard>

          <SideCard
            eyebrow="Actions"
            title={isRoadmapInterview ? "Roadmap actions" : "Quick links"}
            icon={<Sparkles size={15} />}
          >
            <div className="space-y-2">
              {isRoadmapInterview &&
              interview.roadmapId &&
              interview.moduleId ? (
                <>
                  <Button
                    asChild
                    className="h-9 w-full rounded-lg bg-[#F4F1EA] text-sm font-medium text-[#050607] hover:bg-white"
                  >
                    <Link
                      href={`/roadmaps/${interview.roadmapId}/modules/${interview.moduleId}`}
                    >
                      Back to module
                    </Link>
                  </Button>

                  {canOpenNextModule && (
                    <Button
                      asChild
                      className="h-9 w-full rounded-lg bg-(--color-accent) text-sm font-medium text-[#03110F] hover:bg-(--color-accent)/80"
                    >
                      <Link
                        href={`/roadmaps/${interview.roadmapId}/modules/${nextModule.id}`}
                      >
                        Continue next module
                      </Link>
                    </Button>
                  )}

                  <Button
                    asChild
                    className="h-9 w-full rounded-lg border border-white/6 bg-white/[0.035] text-sm font-medium text-[#F4F1EA] hover:bg-white/6"
                  >
                    <Link href={`/interview/${id}`}>Retake this round</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="h-9 w-full rounded-lg bg-[#F4F1EA] text-sm font-medium text-[#050607] hover:bg-white"
                  >
                    <Link href="/dashboard">Back to dashboard</Link>
                  </Button>

                  <Button
                    asChild
                    className="h-9 w-full rounded-lg border border-white/6 bg-white/[0.035] text-sm font-medium text-[#F4F1EA] hover:bg-white/6"
                  >
                    <Link href="/interview">View interviews</Link>
                  </Button>
                </>
              )}
            </div>
          </SideCard>
        </aside>
      </main>
    </section>
  );
};

export default Feedback;

function ReportMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/6 bg-white/[0.018] p-3">
      <div className="flex items-center gap-2 text-[#798285]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-[#F4F1EA]">
        {value}
      </p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="border-b border-white/6 pb-3">
        <p className="text-sm text-[#95a3a7]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-medium">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-[#69756F]">{description}</p>
        )}
      </div>

      <div className="pt-4">{children}</div>
    </section>
  );
}

function CategoryCard({
  index,
  name,
  score,
  comment,
}: {
  index: number;
  name: string;
  score: number;
  comment: string;
}) {
  return (
    <article className="group rounded-md border border-white/6 bg-(--color-surface-1) p-4 transition hover:border-white/10 hover:bg-white/[0.018]">
      <div className="grid gap-4 md:grid-cols-[1fr_120px] md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#a7e1f3]">
              {index + 1}
            </span>
            <h3 className="font-medium">{name}</h3>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#a8b2b3]">{comment}</p>
        </div>

        <div className="md:text-right">
          <p className="text-2xl font-semibold tracking-[-0.04em] text-[#F4F1EA]">
            {score}
          </p>
          <p className="text-xs text-[#69756F]">/100</p>
        </div>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-(--color-accent)"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </article>
  );
}

function InsightList({
  icon,
  items,
  emptyText,
  tone,
}: {
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
  tone: "positive" | "warning";
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-5 text-sm text-[#95a3a7]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex gap-3 rounded-md border border-white/6 bg-white/[0.018] p-4 text-sm leading-6 text-[#a8b2b3]"
        >
          <span
            className={
              tone === "positive"
                ? "mt-0.5 text-[#a7e1f3]"
                : "mt-0.5 text-[#f3d7a7]"
            }
          >
            {icon}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

function SideCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/6 bg-(--color-surface-1)">
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
        <span className="text-[#95a3a7]">{icon}</span>
        <div>
          <p className="text-xs text-[#69756F]">{eyebrow}</p>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function GuideRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-md px-2 py-2 text-sm ${
        active
          ? "border border-(--color-accent)/20 bg-(--color-accent)/10"
          : "border border-transparent"
      }`}
    >
      <span className={active ? "text-[#a7e1f3]" : "text-[#9fadb1]"}>
        {label}
      </span>
      <span className="text-[#F4F1EA]">{value}</span>
    </div>
  );
}
