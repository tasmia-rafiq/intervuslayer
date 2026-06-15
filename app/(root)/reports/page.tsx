import dayjs from "dayjs";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FileText,
  LineChart,
  Plus,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
} from "@/lib/actions/general.action";

type ReportItem = InterviewCardProps & {
  feedback: Awaited<ReturnType<typeof getFeedbackByInterviewId>> | null;
};

const ReportsPage = async () => {
  const user = await getCurrentUser();
  const interviews = await getInterviewsByUserId(user?.id!);

  const reports: ReportItem[] = (
    await Promise.all(
      (interviews ?? []).map(async (interview) => {
        const feedback =
          interview.userId && interview.id
            ? await getFeedbackByInterviewId({
                interviewId: interview.id,
                userId: interview.userId,
              })
            : null;

        return { ...interview, feedback };
      })
    )
  ).filter((item) => !!item.feedback);

  const scores = reports.map((report) => report.feedback?.totalScore ?? 0);

  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : null;

  const bestReport =
    reports.length > 0
      ? reports.reduce((best, current) =>
          (current.feedback?.totalScore ?? 0) > (best.feedback?.totalScore ?? 0)
            ? current
            : best
        )
      : null;

  const latestReport = reports[0] ?? null;

  const weakestCategory = reports
    .flatMap((report) => report.feedback?.categoryScores ?? [])
    .sort((a, b) => a.score - b.score)[0];

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#95a3a7]">Workspace</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Reports
            </h1>
          </div>

          <Button
            asChild
            className="h-9 rounded-lg bg-[#F4F1EA] px-3 text-sm font-medium text-[#050607] hover:bg-white"
          >
            <Link href="/interview/new">
              <Plus size={15} />
              New interview
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[1fr_320px]">
          <div className="border-b border-white/6 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-4 inline-flex items-center gap-2 text-[#a7e1f3]">
              <FileText size={18} />
              Performance archive
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
              Review completed interviews and track where you are improving.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a8b2b3]">
              Reports are created after completed mock interviews. Use them to
              compare scores, identify weak areas, and decide what to retake.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <HeroMetric
                icon={<FileText size={15} />}
                label="Reports"
                value={`${reports.length}`}
              />
              <HeroMetric
                icon={<BarChart3 size={15} />}
                label="Average"
                value={averageScore ? `${averageScore}/100` : "--"}
              />
              <HeroMetric
                icon={<Trophy size={15} />}
                label="Best"
                value={
                  bestReport?.feedback?.totalScore
                    ? `${bestReport.feedback.totalScore}/100`
                    : "--"
                }
              />
            </div>
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
              Recommended focus
            </p>

            <div className="mt-5 rounded-md border border-white/6 bg-[#050607]/60 p-4">
              <div className="flex size-9 items-center justify-center rounded-md border border-(--color-accent)/20 bg-(--color-accent)/10 text-[#A7F3D0]">
                <Target size={17} />
              </div>

              <h3 className="mt-4 font-medium">
                {weakestCategory?.name ?? "Complete your first report"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#a8b2b3]">
                {weakestCategory
                  ? `Your lowest scoring area is ${weakestCategory.name}. Retake an interview and focus on improving this first.`
                  : "Once you complete an interview, your weakest category and next action will appear here."}
              </p>

              <Link
                href={
                  latestReport?.id
                    ? `/interview/${latestReport.id}`
                    : "/interview/new"
                }
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#a7e1f3] transition hover:text-(--color-accent)"
              >
                {latestReport ? "Retake latest interview" : "Create interview"}
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Panel
            eyebrow="Reports"
            title="Completed interview reports"
            description="Only interviews with generated feedback appear here."
          >
            {reports.length > 0 ? (
              <div className="overflow-hidden rounded-md border border-white/6">
                <div className="grid grid-cols-[1fr_120px_120px_140px] border-b border-white/6 bg-white/2.5 px-4 py-3 text-xs text-[#69756F] max-md:hidden">
                  <span>Interview</span>
                  <span>Score</span>
                  <span>Type</span>
                  <span className="text-right">Action</span>
                </div>

                <div className="divide-y divide-white/6">
                  {reports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </Panel>
        </div>

        <aside className="space-y-6">
          <SideCard
            eyebrow="Latest"
            title="Recent report"
            icon={<CalendarDays size={15} />}
          >
            {latestReport ? (
              <>
                <p className="text-sm font-medium capitalize">
                  {latestReport.role} Interview
                </p>

                <div className="mt-4 rounded-md border border-white/6 bg-white/[0.018] p-4">
                  <p className="text-xs text-[#69756F]">Score</p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-0.05em]">
                    {latestReport.feedback?.totalScore ?? "--"}
                  </p>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#a8b2b3]">
                  {latestReport.feedback?.finalAssessment}
                </p>

                <Link
                  href={`/interview/${latestReport.id}/feedback`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#a7e1f3] transition hover:text-(--color-accent)"
                >
                  Open report
                  <ArrowUpRight size={14} />
                </Link>
              </>
            ) : (
              <p className="text-sm leading-6 text-[#a8b2b3]">
                Your most recent feedback report will appear here.
              </p>
            )}
          </SideCard>

          <SideCard
            eyebrow="Trend"
            title="Score snapshot"
            icon={<LineChart size={15} />}
          >
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <ScoreSnapshot key={report.id} report={report} />
              ))}

              {reports.length === 0 && (
                <p className="text-sm leading-6 text-[#a8b2b3]">
                  Complete a few interviews to build your score snapshot.
                </p>
              )}
            </div>
          </SideCard>

          <SideCard
            eyebrow="Action"
            title="Improve faster"
            icon={<RotateCcw size={15} />}
          >
            <p className="text-sm leading-6 text-[#a8b2b3]">
              Use reports as a loop: review your weakest category, retake the
              interview, then compare the new score.
            </p>

            <Button
              asChild
              className="mt-4 h-9 w-full rounded-lg border border-white/6 bg-white/[0.035] text-sm font-medium text-[#F4F1EA] hover:bg-white/6"
            >
              <Link href="/interview">View interviews</Link>
            </Button>
          </SideCard>
        </aside>
      </main>
    </section>
  );
};

export default ReportsPage;

function HeroMetric({
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
      <div className="flex items-center gap-2 text-[#848d91]">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-2 font-medium text-[#F4F1EA]">{value}</p>
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

function ReportRow({ report }: { report: ReportItem }) {
  const normalizedType = /mix/gi.test(report.type) ? "Mixed" : report.type;

  const score = report.feedback?.totalScore ?? 0;

  return (
    <div className="grid items-center gap-3 px-4 py-3 text-sm text-[#a8b2b3] transition hover:bg-white/2.5 md:grid-cols-[1fr_120px_120px_140px]">
      <div>
        <p className="font-medium capitalize text-[#F4F1EA]">
          {report.role} Interview
        </p>

        <p className="mt-1 text-xs text-[#69756F]">
          {report.feedback?.createdAt
            ? dayjs(report.feedback.createdAt).format("MMM D, YYYY h:mm A")
            : "Feedback report"}
        </p>
      </div>

      <span className="w-fit rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#F4F1EA]">
        {score}/100
      </span>

      <span className="capitalize">{normalizedType}</span>

      <Link
        href={`/interview/${report.id}/feedback`}
        className="text-right text-sm text-[#a7e1f3] transition hover:text-(--color-accent) max-md:text-left"
      >
        Open report
      </Link>
    </div>
  );
}

function ScoreSnapshot({ report }: { report: ReportItem }) {
  const score = report.feedback?.totalScore ?? 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="truncate capitalize text-[#a8b2b3]">
          {report.role}
        </span>
        <span className="text-[#F4F1EA]">{score}</span>
      </div>

      <div className="h-1.5 rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-(--color-accent)"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
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

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-8">
      <div className="flex size-10 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-[#95a3a7]">
        <FileText size={18} />
      </div>

      <h3 className="mt-5 text-sm font-medium">No reports yet</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#a8b2b3]">
        Complete an interview to generate your first feedback report. Reports
        will show your score, strengths, and improvement areas.
      </p>

      <Link
        href="/interview"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#a7e1f3] transition hover:text-(--color-accent)"
      >
        Start an interview
        <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}