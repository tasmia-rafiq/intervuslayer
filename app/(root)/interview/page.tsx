import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
} from "@/lib/actions/general.action";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Layers3,
  LibraryIcon,
  Mic,
  Plus,
  Target,
} from "lucide-react";
import Link from "next/link";

type InterviewWithFeedback = InterviewCardProps & {
  feedback: Awaited<ReturnType<typeof getFeedbackByInterviewId>> | null;
};

const InterviewsPage = async () => {
  const user = await getCurrentUser();
  const interviews = await getInterviewsByUserId(user?.id!);

  const interviewsWithFeedback: InterviewWithFeedback[] = await Promise.all(
    (interviews ?? []).map(async (interview) => ({
      ...interview,
      feedback:
        interview.userId && interview.id
          ? await getFeedbackByInterviewId({
              interviewId: interview.id,
              userId: interview.userId,
            })
          : null,
    })),
  );

  const pendingInterviews = interviewsWithFeedback.filter(
    (interview) => !interview.feedback,
  );

  const completedInterviews = interviewsWithFeedback.filter(
    (interview) => !!interview.feedback,
  );

  const nextInterview = pendingInterviews[0];
  const latestReport = completedInterviews[0];

  const averageScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + (interview.feedback?.totalScore ?? 0),
            0,
          ) / completedInterviews.length,
        )
      : null;

  return (
    <>
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#859599]">Workspace</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Interviews
            </h1>
          </div>

          <Button
            asChild
            className="h-9 rounded-lg bg-[#F4F1EA] px-3 text-sm font-medium text-[#050607] hover:bg-white"
          >
            <Link href="/interview/new">
              <Plus size={16} />
              New interview
            </Link>
          </Button>
        </div>
      </header>

      <main className="py-6">
        <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#ffffff]/5.5 blur-3xl" />
              <div className="relative grid gap-6 p-6 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="flex items-center gap-2 text-[#a7e4f3]">
                    <LibraryIcon size={18} />
                    Interview Library
                  </div>

                  <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em]">
                    Your interview workspace.
                  </h2>

                  <p className="mt-3 max-w-2xl text-lg leading-6 text-[#bcc5c7]">
                    Generate role-specific interviews, start pending sessions,
                    and review completed reports from one focused workspace.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="h-9 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F] hover:bg-[#5EEAD4]"
                    >
                      <Link href="/interview/new">
                        <Plus size={15} />
                        Generate interview
                      </Link>
                    </Button>

                    {nextInterview && (
                      <Button
                        asChild
                        className="h-9 rounded-lg border border-white/6 bg-white/2.5 px-3 text-sm font-medium text-[#F4F1EA] hover:bg-white/4.5"
                      >
                        <Link href={`/interview/${nextInterview.id}`}>
                          Continue next
                          <ArrowRight size={15} />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
                  <HeroStat
                    label="Pending"
                    value={pendingInterviews.length}
                    caption="Not taken"
                  />
                  <HeroStat
                    label="Completed"
                    value={completedInterviews.length}
                    caption="Finished"
                  />
                  <HeroStat
                    label="Avg score"
                    value={averageScore ? `${averageScore}` : "--"}
                    caption="Reports"
                  />
                </div>
              </div>
            </section>

            {nextInterview && (
              <section className="rounded-md border border-(--color-accent)/15 bg-(--color-accent)/3.5 p-5">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-[#a7e4f3]">
                      <Target size={15} />
                      Next recommended session
                    </div>

                    <h3 className="mt-3 text-lg font-semibold capitalize">
                      {nextInterview.role} Interview
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A8B3AD]">
                      This interview has been generated and is ready to take.
                      Start it now to unlock a structured feedback report.
                    </p>
                  </div>

                  <Link
                    href={`/interview/${nextInterview.id}`}
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F] transition hover:bg-[#5EEAD4]"
                  >
                    Start session
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </section>
            )}

            <SectionHeader
              eyebrow="Library"
              title="All interviews"
              action={
                <Link
                  href="/interview/new"
                  className="inline-flex items-center gap-1 text-sm text-(--color-accent) transition hover:text-(--color-accent)"
                >
                  Generate new <ArrowUpRight size={14} />
                </Link>
              }
            />

            {interviewsWithFeedback.length > 0 ? (
              <div className="space-y-3">
                {interviewsWithFeedback.map((interview) => (
                  <InterviewCard
                    {...interview}
                    key={interview.id}
                    feedback={interview.feedback}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No interviews yet"
                description="Generate a role-specific interview and it will appear here."
                href="/interview/new"
                action="Generate interview"
              />
            )}
          </div>

          <aside className="space-y-6">
            <SidePanel title="Workspace health" icon={<Layers3 size={15} />}>
              <div className="space-y-4">
                <HealthRow label="Pending" value={pendingInterviews.length} />
                <HealthRow
                  label="Completed"
                  value={completedInterviews.length}
                />
                <HealthRow
                  label="Average score"
                  value={averageScore ? `${averageScore}/100` : "--"}
                />
              </div>
            </SidePanel>

            <SidePanel title="Latest report" icon={<FileText size={15} />}>
              {latestReport ? (
                <div>
                  <h3 className="font-medium capitalize">
                    {latestReport.role} Interview
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A8B3AD]">
                    {latestReport.feedback?.finalAssessment ||
                      "Feedback report is ready."}
                  </p>

                  <Link
                    href={`/interview/${latestReport.id}/feedback`}
                    className="mt-4 inline-flex items-center gap-1 text-sm text-[#a7e4f3] transition hover:text-(--color-accent)"
                  >
                    Open report <ArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <p className="text-sm leading-6 text-[#A8B3AD]">
                  Complete your first interview to see feedback here.
                </p>
              )}
            </SidePanel>

            <SidePanel title="Practice flow" icon={<Mic size={15} />}>
              <div className="space-y-3 text-sm text-[#A8B3AD]">
                <FlowItem number="1" text="Generate a focused interview." />
                <FlowItem number="2" text="Take the voice session." />
                <FlowItem number="3" text="Review the feedback report." />
                <FlowItem number="4" text="Retake weak areas." />
              </div>
            </SidePanel>
          </aside>
        </section>
      </main>
    </>
  );
};

export default InterviewsPage;

function HeroStat({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <div className="rounded-md border border-white/6 bg-[#050607]/70 p-4">
      <p className="text-sm text-[#9aa7aa]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{value}</p>
      <p className="mt-1 text-xs text-[#7a8386]">{caption}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/6 pt-2 pb-3">
      <div>
        <p className="text-base text-[#859599]">{eyebrow}</p>
        <h2 className="mt-0.5 text-lg font-medium text-[#F4F1EA]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SidePanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/6 bg-(--color-surface-1)">
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
        <span className="text-[#859599]">{icon}</span>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function HealthRow({
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

function FlowItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#a7e4f3]">
        {number}
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
    <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-6">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#A8B3AD]">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-medium text-[#a7e4f3] transition hover:text-(--color-accent)"
      >
        {action}
      </Link>
    </div>
  );
}

function ReportRow({ interview }: { interview: InterviewWithFeedback }) {
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
        className="text-right text-sm text-[#a7e4f3] transition hover:text-(--color-accent) max-md:text-left"
      >
        Open
      </Link>
    </div>
  );
}
