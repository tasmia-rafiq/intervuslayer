import dayjs from "dayjs";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Crown,
  Flame,
  Gem,
  Goal,
  LineChart,
  Lock,
  Plus,
  RotateCcw,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByUserId,
  getSkillGraphByUserId,
} from "@/lib/actions/general.action";
import EmptyState from "@/components/ui/empty-state";

type ProgressReport = InterviewCardProps & {
  feedback: Awaited<ReturnType<typeof getFeedbackByInterviewId>> | null;
};

const ProgressPage = async () => {
  const user = await getCurrentUser();
  const interviews = await getInterviewsByUserId(user?.id!);
  const skillGraph = await getSkillGraphByUserId(user?.id!);

  const reports: ProgressReport[] = (
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
      }),
    )
  ).filter((item) => !!item.feedback);

  const scores = reports.map((item) => item.feedback?.totalScore ?? 0);

  const latestScore = scores[0] ?? null;
  const previousScore = scores[1] ?? null;

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : null;

  const bestScore = scores.length > 0 ? Math.max(...scores) : null;

  const scoreDelta =
    latestScore !== null && previousScore !== null
      ? latestScore - previousScore
      : null;

  const allCategories = reports.flatMap(
    (report) => report.feedback?.categoryScores ?? [],
  );

  const categoryAverages = getCategoryAverages(allCategories);
  const weakestCategory = [...categoryAverages].sort(
    (a, b) => a.score - b.score,
  )[0];

  const momentumLabel =
    scoreDelta === null
      ? "Not enough data"
      : scoreDelta > 0
        ? "Improving"
        : scoreDelta < 0
          ? "Needs attention"
          : "Stable";

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#95a3a7]">Workspace</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Progress
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
              <LineChart size={18} />
              Growth analytics
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
              Track whether your interview performance is actually improving.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a8b2b3]">
              Progress uses completed feedback reports to summarize your score
              trend, skill gaps, and momentum across interviews.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              <HeroMetric
                label="Latest"
                value={latestScore ? `${latestScore}` : "--"}
              />
              <HeroMetric
                label="Average"
                value={averageScore ? `${averageScore}` : "--"}
              />
              <HeroMetric
                label="Best"
                value={bestScore ? `${bestScore}` : "--"}
              />
              <HeroMetric label="Reports" value={`${reports.length}`} />
            </div>
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
              Momentum
            </p>

            <div className="mt-5 rounded-md border border-white/6 bg-[#050607]/60 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg border border-(--color-accent)/20 bg-(--color-accent)/10 text-[#A7F3D0]">
                {scoreDelta !== null && scoreDelta < 0 ? (
                  <TrendingDown size={17} />
                ) : (
                  <TrendingUp size={17} />
                )}
              </div>

              <h3 className="mt-4 font-medium">{momentumLabel}</h3>

              <p className="mt-2 text-sm leading-6 text-[#a8b2b3]">
                {scoreDelta === null
                  ? "Complete at least two interviews to see your momentum."
                  : scoreDelta > 0
                    ? `Your latest score improved by ${scoreDelta} points compared to the previous report.`
                    : scoreDelta < 0
                      ? `Your latest score dropped by ${Math.abs(scoreDelta)} points. Review your weakest category before retaking.`
                      : "Your latest score stayed the same. Focus on one category to break the plateau."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Panel
            eyebrow="Skill graph"
            title="Interview skill map"
            description="Aggregated skill performance from all completed reports."
          >
            <SkillGraphSection skillGraph={skillGraph} />
          </Panel>

          <Panel
            eyebrow="Trend"
            title="Performance trend"
            description="Score movement across your latest completed interviews."
          >
            {reports.length > 0 ? (
              <TrendChart reports={reports.slice(0, 8).reverse()} />
            ) : (
              <EmptyState title="" />
            )}
          </Panel>

          <Panel
            eyebrow="Skills"
            title="Skill breakdown"
            description="Average score per category across all completed reports."
          >
            {categoryAverages.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {categoryAverages.map((category) => (
                  <SkillCard key={category.name} {...category} />
                ))}
              </div>
            ) : (
              <EmptyState title="" />
            )}
          </Panel>

          <Panel
            eyebrow="Milestones"
            title="Achievements"
            description="Progress markers that unlock as your practice history grows."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <AchievementCard
                done={reports.length >= 1}
                icon={<Star size={17} />}
                title="First signal"
                text="Generated your first performance report."
                progress={reports.length >= 1 ? 100 : 0}
              />

              <AchievementCard
                done={reports.length >= 5}
                icon={<Flame size={17} />}
                title="Practice streak"
                text="Complete five interviews to build reliable progress data."
                progress={Math.min((reports.length / 5) * 100, 100)}
              />

              <AchievementCard
                done={(bestScore ?? 0) >= 80}
                icon={<Crown size={17} />}
                title="Interview-ready"
                text="Score 80+ in any completed interview."
                progress={Math.min(((bestScore ?? 0) / 80) * 100, 100)}
              />

              <AchievementCard
                done={categoryAverages.some((category) => category.score >= 85)}
                icon={<Gem size={17} />}
                title="Strong skill area"
                text="Average 85+ in one feedback category."
                progress={
                  categoryAverages.length
                    ? Math.min(
                        (Math.max(...categoryAverages.map((c) => c.score)) /
                          85) *
                          100,
                        100,
                      )
                    : 0
                }
              />
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <SideCard
            eyebrow="Focus"
            title="Weakest category"
            icon={<Target size={15} />}
          >
            {weakestCategory ? (
              <>
                <p className="text-sm font-medium">{weakestCategory.name}</p>

                <div className="mt-4 rounded-md border border-white/6 bg-white/[0.018] p-4">
                  <p className="text-xs text-[#69756F]">Average score</p>
                  <p className="mt-1 text-3xl font-semibold tracking-[-0.05em]">
                    {weakestCategory.score}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#a8b2b3]">
                  Focus your next interview practice on this category first.
                </p>
              </>
            ) : (
              <p className="text-sm leading-6 text-[#a8b2b3]">
                Complete interviews to reveal your weakest category.
              </p>
            )}
          </SideCard>

          <SideCard
            eyebrow="Goal"
            title="Readiness target"
            icon={<Goal size={15} />}
          >
            <GoalTracker
              latestScore={latestScore ?? 0}
              target={85}
              reports={reports.length}
            />
          </SideCard>

          <SideCard
            eyebrow="Loop"
            title="Recommended routine"
            icon={<RotateIcon />}
          >
            <div className="space-y-3 text-sm text-[#a8b2b3]">
              <RoutineStep number="1" text="Review your weakest category." />
              <RoutineStep number="2" text="Retake a similar interview." />
              <RoutineStep number="3" text="Compare the new score." />
              <RoutineStep
                number="4"
                text="Repeat until your score stabilizes."
              />
            </div>
          </SideCard>
        </aside>
      </main>
    </section>
  );
};

export default ProgressPage;

function SkillGraphSection({
  skillGraph,
}: {
  skillGraph: Awaited<ReturnType<typeof getSkillGraphByUserId>>;
}) {
  if (skillGraph.skills.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-8">
        <h3 className="text-sm font-medium">No skill graph yet</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#a8b2b3]">
          Complete interviews to build your skill graph. Each feedback report
          adds signal to your strengths and weak areas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
      <div className="grid gap-3 md:grid-cols-2">
        {skillGraph.skills.map((skill) => (
          <SkillGraphCard key={skill.name} skill={skill} />
        ))}
      </div>

      <div className="space-y-3">
        <SkillFocusCard
          label="Weakest area"
          skill={skillGraph.weakestSkill}
          tone="weak"
        />

        <SkillFocusCard
          label="Strongest area"
          skill={skillGraph.strongestSkill}
          tone="strong"
        />
      </div>
    </div>
  );
}

function SkillGraphCard({
  skill,
}: {
  skill: {
    name: string;
    averageScore: number;
    latestScore: number;
    previousScore: number | null;
    delta: number | null;
    reportCount: number;
    latestReason: string;
  };
}) {
  const score = skill.averageScore;

  return (
    <article className="group rounded-md border border-white/6 bg-(--color-surface-1) p-4 transition hover:border-white/10 hover:bg-white/[0.018]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-[#F4F1EA]">{skill.name}</h3>
          <p className="mt-1 text-xs text-[#69756F]">
            Seen in {skill.reportCount} report{skill.reportCount === 1 ? "" : "s"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold tracking-[-0.04em]">{score}</p>
          <p className="text-xs text-[#69756F]">avg</p>
        </div>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-(--color-accent)"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-[#69756F]">Latest {skill.latestScore}/100</span>

        <span
          className={
            skill.delta === null
              ? "text-[#69756F]"
              : skill.delta >= 0
                ? "text-[#A7F3D0]"
                : "text-[#f3d7a7]"
          }
        >
          {skill.delta === null
            ? "New"
            : `${skill.delta >= 0 ? "+" : ""}${skill.delta}`}
        </span>
      </div>

      {skill.latestReason && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-[#859599]">
          {skill.latestReason}
        </p>
      )}
    </article>
  );
}

function SkillFocusCard({
  label,
  skill,
  tone,
}: {
  label: string;
  skill: {
    name: string;
    averageScore: number;
    latestReason: string;
  } | null;
  tone: "weak" | "strong";
}) {
  if (!skill) return null;

  return (
    <div className="rounded-md border border-white/6 bg-(--color-surface-1) p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
        {label}
      </p>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#F4F1EA]">
            {skill.name}
          </h3>
          <p className="mt-1 text-sm text-[#859599]">
            {tone === "weak"
              ? "Recommended practice focus"
              : "Keep this consistent"}
          </p>
        </div>

        <p className="text-3xl font-semibold tracking-[-0.06em]">
          {skill.averageScore}
        </p>
      </div>

      {skill.latestReason && (
        <p className="mt-4 text-sm leading-6 text-[#a8b2b3]">
          {skill.latestReason}
        </p>
      )}

      {tone === "weak" && (
        <Link
          href={`/interview/new`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#A7F3D0] transition hover:text-(--color-accent)"
        >
          Create focused interview
          <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}

function TrendChart({ reports }: { reports: ProgressReport[] }) {
  const points = reports.map((report, index) => ({
    label: report.feedback?.createdAt
      ? dayjs(report.feedback.createdAt).format("MMM D")
      : `#${index + 1}`,
    score: report.feedback?.totalScore ?? 0,
  }));

  const width = 720;
  const height = 260;
  const padding = 34;

  const maxScore = 100;
  const minScore = 0;

  const plotted = points.map((point, index) => {
    const x =
      points.length === 1
        ? width / 2
        : padding + (index / (points.length - 1)) * (width - padding * 2);

    const y =
      height -
      padding -
      ((point.score - minScore) / (maxScore - minScore)) *
        (height - padding * 2);

    return { ...point, x, y };
  });

  const path = plotted
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const latest = points[points.length - 1]?.score ?? 0;
  const first = points[0]?.score ?? 0;
  const delta = latest - first;

  return (
    <div className="overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
      <div className="flex items-start justify-between gap-4 border-b border-white/6 p-4">
        <div>
          <p className="text-sm font-medium">Score trajectory</p>
          <p className="mt-1 text-sm text-[#69756F]">
            Latest {points.length} completed reports
          </p>
        </div>

        <div className="rounded-md border border-white/6 bg-white/2.5 px-3 py-2 text-right">
          <p className="text-xs text-[#69756F]">Change</p>
          <p
            className={`mt-0.5 text-sm font-medium ${
              delta >= 0 ? "text-[#A7F3D0]" : "text-[#f3d7a7]"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta}
          </p>
        </div>
      </div>

      <div className="p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[260px] w-full overflow-visible"
          role="img"
        >
          {[25, 50, 75, 100].map((line) => {
            const y = height - padding - (line / 100) * (height - padding * 2);

            return (
              <g key={line}>
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                />
                <text x={0} y={y + 4} fill="#69756F" fontSize="11">
                  {line}
                </text>
              </g>
            );
          })}

          <path
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {plotted.map((point) => (
            <g key={`${point.label}-${point.score}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="var(--color-accent)"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="rgba(45,212,191,0.12)"
              />
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fill="#69756F"
                fontSize="11"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function AchievementCard({
  done,
  icon,
  title,
  text,
  progress,
}: {
  done: boolean;
  icon: React.ReactNode;
  title: string;
  text: string;
  progress: number;
}) {
  const safeProgress = Math.min(progress, 100);

  return (
    <article
      className={`group relative overflow-hidden rounded-md border p-4 transition duration-300 ${
        done
          ? "border-(--color-accent)/25 bg-(--color-accent)/7.5 hover:border-(--color-accent)/35"
          : "border-white/6 bg-(--color-surface-1) hover:border-white/10"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(255,255,255,0.06),transparent_28%)]" />

      {done && (
        <div className="absolute -right-10 -top-10 size-28 rounded-full bg-(--color-accent)/10 blur-2xl" />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex size-11 items-center justify-center rounded-md border transition ${
            done
              ? "border-(--color-accent)/25 bg-(--color-accent)/10 text-[#A7F3D0]"
              : "border-white/6 bg-white/2.5 text-[#69756F]"
          }`}
        >
          {done ? icon : <Lock size={16} />}
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            done
              ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#A7F3D0]"
              : "border-white/6 bg-white/2.5 text-[#69756F]"
          }`}
        >
          {done ? "Unlocked" : `${Math.round(safeProgress)}%`}
        </span>
      </div>

      <div className="relative mt-6">
        <h3 className="text-sm font-medium text-[#F4F1EA]">{title}</h3>

        <p className="mt-2 min-h-12 text-sm leading-6 text-[#a8b2b3]">{text}</p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-[#69756F]">Progress</span>
            <span className={done ? "text-[#A7F3D0]" : "text-[#859599]"}>
              {Math.round(safeProgress)}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
            <div
              className={`h-full rounded-full transition-all ${
                done ? "bg-(--color-accent)" : "bg-white/20"
              }`}
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function GoalTracker({
  latestScore,
  target,
  reports,
}: {
  latestScore: number;
  target: number;
  reports: number;
}) {
  const progress = Math.min((latestScore / target) * 100, 100);
  const remaining = Math.max(target - latestScore, 0);
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (progress / 100) * circumference;

  const status =
    reports === 0
      ? "No signal yet"
      : remaining === 0
        ? "Target reached"
        : "In progress";

  return (
    <div className="relative overflow-hidden rounded-md border border-white/6 bg-[#050607]/60 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(45,212,191,0.1),transparent_30%)]" />

      <div className="relative flex items-center gap-4">
        <div className="relative flex size-28 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="text-center">
            <p className="text-3xl font-semibold tracking-[-0.06em]">
              {latestScore}
            </p>
            <p className="text-[11px] text-[#69756F]">current</p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="inline-flex rounded-full border border-white/6 bg-white/2.5 px-2.5 py-1 text-[11px] text-[#A7F3D0]">
            {status}
          </div>

          <h3 className="mt-3 text-sm font-medium text-[#F4F1EA]">
            Readiness score
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#a8b2b3]">
            {reports === 0
              ? "Complete your first interview to start measuring readiness."
              : remaining === 0
                ? "You have reached the readiness target. Keep practicing to stay consistent."
                : `${remaining} points left to reach the recommended target of ${target}.`}
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2">
        <GoalMetric label="Current" value={`${latestScore}`} />
        <GoalMetric label="Target" value={`${target}`} />
        <GoalMetric label="Reports" value={`${reports}`} />
      </div>
    </div>
  );
}

function GoalMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/6 bg-white/[0.018] p-3">
      <p className="text-[11px] text-[#69756F]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#F4F1EA]">{value}</p>
    </div>
  );
}

function getCategoryAverages(
  categories: { name: string; score: number; comment?: string }[],
) {
  const grouped = categories.reduce(
    (acc, category) => {
      if (!acc[category.name]) acc[category.name] = [];
      acc[category.name].push(category.score);
      return acc;
    },
    {} as Record<string, number[]>,
  );

  return Object.entries(grouped).map(([name, scores]) => ({
    name,
    score: Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length,
    ),
  }));
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/6 bg-white/[0.018] p-3">
      <p className="text-xs text-[#899397]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#F4F1EA]">{value}</p>
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

function SkillCard({ name, score }: { name: string; score: number }) {
  return (
    <article className="rounded-md border border-white/6 bg-(--color-surface-1) p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{name}</h3>
        <span className="text-sm text-[#F4F1EA]">{score}/100</span>
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
          <p className="text-xs text-[#899397]">{eyebrow}</p>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function RoutineStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#A7F3D0]">
        {number}
      </span>
      <span className="leading-6">{text}</span>
    </div>
  );
}

function RotateIcon() {
  return <RotateCcw size={15} />;
}
