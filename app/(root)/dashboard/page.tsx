import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Mic,
  Plus,
} from "lucide-react";
import Link from "next/link";

const DashboardPage = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const completedCount = userInterviews?.length ?? 0;
  const availableCount = latestInterviews?.length ?? 0;

  const recentInterview = userInterviews?.[0];

  return (
    <>
      <header className="-mx-5 border-b border-white/6 bg-red/80 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#69756F]">
              <span className="text-[#A8B3AD]">Dashboard</span>
            </div>

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
            label="Completed"
            value={completedCount}
            icon={<CheckCircle2 size={16} />}
            caption="Finished sessions"
          />

          <MetricCard
            label="Available"
            value={availableCount}
            icon={<Mic size={16} />}
            caption="Practice tracks"
          />

          <MetricCard
            label="Average score"
            value="--"
            icon={<Activity size={16} />}
            caption="Coming from reports"
          />

          <MetricCard
            label="Current focus"
            value="Clarity"
            icon={<CircleDot size={16} />}
            caption="Recommended skill"
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_260px]">
          <div className="space-y-6">
            <Panel
              eyebrow="Today"
              title="Start from your next best action"
              action={
                <Link
                  href="/interview"
                  className="text-sm text-(--color-accent) transition hover:text-(--color-accent-600)"
                >
                  Browse library
                </Link>
              }
            >
              <div className="rounded-2xl border border-white/6 bg-white/2 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-[#69756F]">
                      <Clock3 size={15} />
                      Recommended
                    </div>

                    <h3 className="font-medium">
                      Take one mixed interview and review answer structure.
                    </h3>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#A8B3AD]">
                      Keep answers concise, use one concrete example, then close
                      with the tradeoff or impact.
                    </p>
                  </div>

                  <Button
                    asChild
                    className="h-8 shrink-0 rounded-lg bg-[#2DD4BF] px-3 text-xs font-medium text-[#03110F] hover:bg-[#5EEAD4]"
                  >
                    <Link href="/interview">Start</Link>
                  </Button>
                </div>
              </div>
            </Panel>

            <Panel
              eyebrow="Practice library"
              title="Available interviews"
              action={
                <Link
                  href="/interview"
                  className="inline-flex items-center gap-1 text-sm text-(--color-accent) transition hover:text-[#2DD4BF]"
                >
                  View all <ArrowUpRight size={14} />
                </Link>
              }
            >
              {(latestInterviews ?? []).length > 0 ? (
                <div className="space-y-4">
                  {latestInterviews?.slice(0, 4).map((interview) => (
                    <InterviewCard {...interview} key={interview.id} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No interviews available"
                  description="Create or generate a new interview to start practicing."
                  href="/interview"
                  action="Create interview"
                />
              )}
            </Panel>
          </div>

          <aside className="space-y-6">
            <Panel eyebrow="Progress" title="Practice pulse">
              <div className="space-y-4">
                <PulseRow label="Sessions completed" value={completedCount} />
                <PulseRow label="Practice tracks" value={availableCount} />
                <PulseRow label="Reports reviewed" value="--" />
              </div>
            </Panel>

            <Panel eyebrow="Recent" title="Latest activity">
              {recentInterview ? (
                <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                  <div className="flex items-center gap-2 text-sm text-[#69756F]">
                    <CalendarDays size={15} />
                    Latest interview
                  </div>

                  <h3 className="mt-3 font-medium capitalize">
                    {recentInterview.role} Interview
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#A8B3AD]">
                    Continue reviewing your previous attempt or retake the
                    session to improve.
                  </p>

                  <Link
                    href={`/interview/${recentInterview.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm text-[#A7F3D0] transition hover:text-[#2DD4BF]"
                  >
                    Open interview <ArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="rounded-xl border border-white/6 bg-white/2 p-4 text-sm leading-6 text-[#A8B3AD]">
                  No recent interview activity yet.
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

        <section className="mt-6">
          <Panel eyebrow="History" title="Previous interviews">
            {(userInterviews ?? []).length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-white/6">
                <div className="grid grid-cols-[1fr_120px_120px_120px] border-b border-white/6 bg-white/2.5 px-4 py-3 text-xs text-[#69756F] max-md:hidden">
                  <span>Interview</span>
                  <span>Type</span>
                  <span>Status</span>
                  <span className="text-right">Action</span>
                </div>

                <div className="divide-y divide-white/6">
                  {userInterviews?.map((interview) => (
                    <HistoryRow key={interview.id} interview={interview} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                title="No completed interviews"
                description="Your completed interviews and feedback reports will appear here."
                href="/interview"
                action="Start first interview"
              />
            )}
          </Panel>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;

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
          <p className="text-base text-[#859599]">{eyebrow}</p>
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

function HistoryRow({ interview }: { interview: InterviewCardProps }) {
  const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;

  return (
    <div className="grid items-center gap-3 px-4 py-3 text-sm text-[#A8B3AD] transition hover:bg-white/2.5 md:grid-cols-[1fr_120px_120px_120px]">
      <div>
        <p className="font-medium capitalize text-[#F4F1EA]">
          {interview.role} Interview
        </p>
        <p className="mt-1 text-xs text-[#69756F]">
          Practice session report
        </p>
      </div>

      <span>{normalizedType}</span>

      <span className="w-fit rounded-md border border-white/6 bg-white/2.5 px-2 py-1 text-xs">
        Completed
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