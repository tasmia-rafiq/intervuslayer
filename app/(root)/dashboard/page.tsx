import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Mic,
  Plus,
  Target,
} from "lucide-react";
import Link from "next/link";

type InterviewWithFeedback = InterviewCardProps & {
  feedback: Awaited<ReturnType<typeof getFeedbackByInterviewId>> | null;
};

const DashboardPage = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const userInterviewFeedbacks = await Promise.all(
    (userInterviews ?? []).map(async (interview) => ({
      ...interview,
      feedback:
        interview.userId && interview.id
          ? await getFeedbackByInterviewId({
              interviewId: interview.id,
              userId: interview.userId,
            })
          : null,
    }))
  );

  const pendingInterviews = userInterviewFeedbacks.filter(
    (interview) => !interview.feedback
  );

  const completedInterviews = userInterviewFeedbacks.filter(
    (interview) => !!interview.feedback
  );

  const reportsReviewed = completedInterviews.length;

  const averageScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + (interview.feedback?.totalScore ?? 0),
            0
          ) / completedInterviews.length
        )
      : null;

  const nextInterview = pendingInterviews[0] ?? latestInterviews?.[0] ?? null;
  const latestReport = completedInterviews[0] ?? null;

  return (
    <>
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#859599]">Dashboard</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Good to see you{user?.name ? `, ${user.name}` : ""}
            </h1>
          </div>

          <Button
            asChild
            className="h-9 rounded-lg bg-[#F4F1EA] px-3 text-sm font-medium text-[#050607] hover:bg-white"
          >
            <Link href="/interview">
              <Plus size={16} />
              New interview
            </Link>
          </Button>
        </div>
      </header>

      <main className="py-6">
        <section className="grid gap-3 md:grid-cols-4">
          <MetricCard
            label="Pending"
            value={pendingInterviews.length}
            caption="Generated, not taken"
            icon={<Clock3 size={16} />}
          />

          <MetricCard
            label="Completed"
            value={completedInterviews.length}
            caption="Finished with feedback"
            icon={<CheckCircle2 size={16} />}
          />

          <MetricCard
            label="Average score"
            value={averageScore ? `${averageScore}/100` : "--"}
            caption="From completed reports"
            icon={<BarChart3 size={16} />}
          />

          <MetricCard
            label="Reports"
            value={reportsReviewed}
            caption="Feedback generated"
            icon={<FileText size={16} />}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
          <div className="space-y-8">
            <Panel
              eyebrow="Next action"
              title={
                nextInterview
                  ? "Continue from your latest interview"
                  : "Create your first interview"
              }
              action={
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-1 text-sm text-(--color-accent) transition hover:text-[#2DD4BF]"
                >
                  Create new <ArrowUpRight size={14} />
                </Link>
              }
            >
              {nextInterview ? (
                <NextActionCard interview={nextInterview} />
              ) : (
                <EmptyState
                  title="No interviews yet"
                  description="Generate a role-specific interview, then come back here to start practicing."
                  href="/interview"
                  action="Generate interview"
                />
              )}
            </Panel>

            <Panel
              eyebrow="Queue"
              title="Pending interviews"
              action={
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-1 text-sm text-(--color-accent) transition hover:text-[#2DD4BF]"
                >
                  View all <ArrowUpRight size={14} />
                </Link>
              }
            >
              {pendingInterviews.length > 0 ? (
                <div className="space-y-3">
                  {pendingInterviews.slice(0, 5).map((interview) => (
                    <InterviewCard {...interview} key={interview.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No pending interviews"
                  description="Generated interviews that you have not taken yet will appear here."
                  href="/interview"
                  action="Generate interview"
                />
              )}
            </Panel>

            <Panel eyebrow="Reports" title="Completed interviews">
              {completedInterviews.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-white/6">
                  <div className="grid grid-cols-[1fr_120px_120px_120px] border-b border-white/6 bg-white/2.5 px-4 py-3 text-xs text-[#69756F] max-md:hidden">
                    <span>Interview</span>
                    <span>Type</span>
                    <span>Score</span>
                    <span className="text-right">Action</span>
                  </div>

                  <div className="divide-y divide-white/6">
                    {completedInterviews.slice(0, 6).map((interview) => (
                      <ReportRow key={interview.id} interview={interview} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No reports yet"
                  description="Complete an interview to generate a report with your score, strengths, and improvement areas."
                  href={pendingInterviews[0]?.id ? `/interview/${pendingInterviews[0].id}` : "/interview"}
                  action={pendingInterviews.length > 0 ? "Start pending interview" : "Generate interview"}
                />
              )}
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel eyebrow="Overview" title="Practice status">
              <div className="space-y-4">
                <PulseRow label="Pending interviews" value={pendingInterviews.length} />
                <PulseRow label="Completed sessions" value={completedInterviews.length} />
                <PulseRow label="Reports generated" value={reportsReviewed} />
                <PulseRow
                  label="Average score"
                  value={averageScore ? `${averageScore}/100` : "--"}
                />
              </div>
            </Panel>

            <Panel eyebrow="Latest report" title="Recent feedback">
              {latestReport ? (
                <LatestReportCard interview={latestReport} />
              ) : (
                <div className="rounded-xl border border-white/6 bg-white/2 p-4 text-sm leading-6 text-[#A8B3AD]">
                  No feedback report yet. Take one pending interview to unlock
                  your first performance report.
                </div>
              )}
            </Panel>

            <Panel eyebrow="Method" title="Answer framework">
              <div className="space-y-3 text-sm text-[#A8B3AD]">
                <FrameworkItem label="1" text="Define the concept clearly." />
                <FrameworkItem label="2" text="Give one concrete example." />
                <FrameworkItem label="3" text="Explain tradeoffs or impact." />
                <FrameworkItem label="4" text="Close with confidence." />
              </div>
            </Panel>
          </aside>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;

function NextActionCard({
  interview,
}: {
  interview: InterviewCardProps;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-(--color-surface-1) p-5">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-[#859599]">
            <Target size={15} />
            Recommended next
          </div>

          <h3 className="mt-3 text-lg font-semibold capitalize">
            {interview.role} Interview
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8B3AD]">
            This interview has been generated and is waiting for you. Start it
            when you are ready, then review the feedback report after completion.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{/mix/gi.test(interview.type) ? "Mixed" : interview.type}</Badge>
            <Badge>{interview.level || "Practice"}</Badge>
            <Badge>{interview.techstack?.slice(0, 3).join(" · ")}</Badge>
          </div>
        </div>

        <Button
          asChild
          className="h-9 shrink-0 rounded-lg bg-[#2DD4BF] px-3 text-sm font-medium text-[#03110F] hover:bg-[#5EEAD4]"
        >
          <Link href={`/interview/${interview.id}`}>
            <Mic size={15} />
            Start
          </Link>
        </Button>
      </div>
    </div>
  );
}

function LatestReportCard({
  interview,
}: {
  interview: InterviewWithFeedback;
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-4">
      <p className="text-sm text-[#69756F]">Latest completed interview</p>

      <h3 className="mt-3 font-medium capitalize">
        {interview.role} Interview
      </h3>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-[#A8B3AD]">Score</span>
        <span className="font-semibold text-[#F4F1EA]">
          {interview.feedback?.totalScore ?? "--"}/100
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#A8B3AD]">
        {interview.feedback?.finalAssessment ||
          "Feedback is available for this completed session."}
      </p>

      <Link
        href={`/interview/${interview.id}/feedback`}
        className="mt-4 inline-flex items-center gap-1 text-sm text-[#A7F3D0] transition hover:text-[#2DD4BF]"
      >
        Open report <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

function MetricCard({
  label,
  value,
  caption,
  icon,
}: {
  label: string;
  value: string | number;
  caption: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/6 bg-(--color-surface-1) p-4">
      <div className="flex items-center justify-between text-[#69756F]">
        <span className="text-sm">{label}</span>
        {icon}
      </div>

      <div className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </div>

      <p className="mt-1 text-xs text-[#69756F]">{caption}</p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 border-b border-white/6 py-3">
        <div>
          <p className="text-base text-[#a2aeb1]">{eyebrow}</p>
          <h2 className="mt-0.5 text-lg font-medium text-[#F4F1EA]">
            {title}
          </h2>
        </div>
        {action}
      </div>

      <div className="py-4">{children}</div>
    </section>
  );
}

function PulseRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-[#A8B3AD]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function FrameworkItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#A7F3D0]">
        {label}
      </span>
      <span className="leading-6">{text}</span>
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/8 bg-white/1.5 p-6">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#A8B3AD]">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[#A7F3D0] transition hover:text-[#2DD4BF]"
      >
        {action}
      </Link>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/6 bg-white/2.5 px-2 py-1 text-xs text-[#859599]">
      {children}
    </span>
  );
}

function ReportRow({
  interview,
}: {
  interview: InterviewWithFeedback;
}) {
  const normalizedType = /mix/gi.test(interview.type)
    ? "Mixed"
    : interview.type;

  return (
    <div className="grid items-center gap-3 px-4 py-3 text-sm text-[#A8B3AD] transition hover:bg-white/2.5 md:grid-cols-[1fr_120px_120px_120px]">
      <div>
        <p className="font-medium capitalize text-[#F4F1EA]">
          {interview.role} Interview
        </p>
        <p className="mt-1 text-xs text-[#69756F]">Feedback report ready</p>
      </div>

      <span>{normalizedType}</span>

      <span className="w-fit rounded-md border border-white/6 bg-white/2.5 px-2 py-1 text-xs">
        {interview.feedback?.totalScore ?? "--"}/100
      </span>

      <Link
        href={`/interview/${interview.id}/feedback`}
        className="text-right text-sm text-[#A7F3D0] transition hover:text-[#2DD4BF] max-md:text-left"
      >
        Open
      </Link>
    </div>
  );
}