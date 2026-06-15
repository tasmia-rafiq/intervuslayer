import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  Lock,
  Map,
  Play,
  Target,
} from "lucide-react";

import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewsByRoadmapModule,
  getRoadmapById,
} from "@/lib/actions/general.action";
import CreateModuleInterviewButton from "@/components/roadmaps/CreateModuleInterviewButton";

type ModuleInterviewWithFeedback = InterviewCardProps & {
  feedback: Awaited<ReturnType<typeof getFeedbackByInterviewId>> | null;
};

const RoadmapModulePage = async ({ params }: RouteParams) => {
  const { id, moduleId } = await params;

  const user = await getCurrentUser();
  const roadmap = await getRoadmapById(id);

  if (!roadmap) redirect("/roadmaps");
  if (roadmap.userId !== user?.id) redirect("/roadmaps");

  const moduleIndex = roadmap.modules.findIndex((item) => item.id === moduleId);

  const module = roadmap.modules[moduleIndex];

  if (!module) redirect(`/roadmaps/${id}`);

  const isLocked = module.status === "locked";
  const isCompleted = module.status === "completed";

  const rawInterviews = await getInterviewsByRoadmapModule({
    userId: user.id,
    roadmapId: id,
    moduleId,
  });

  const interviews: ModuleInterviewWithFeedback[] = await Promise.all(
    (rawInterviews ?? []).map(async (interview) => ({
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

  const completedInterviews = interviews.filter((item) => !!item.feedback);
  const pendingInterviews = interviews.filter((item) => !item.feedback);

  const moduleProgress =
    module.interviewCount > 0
      ? Math.min(
          Math.round(
            (completedInterviews.length / module.interviewCount) * 100,
          ),
          100,
        )
      : 0;

  const hasReachedTarget = interviews.length >= module.interviewCount;
  const canCreateMore = !isLocked && !hasReachedTarget;
  const nextPendingInterview = pendingInterviews[0];

  const nextModule = roadmap.modules[moduleIndex + 1];
  const previousModule = roadmap.modules[moduleIndex - 1];

  const canOpenNextModule = nextModule && nextModule.status !== "locked";

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/roadmaps/${id}`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-[#859599] transition hover:text-[#F4F1EA]"
            >
              <ArrowLeft size={14} />
              Back to roadmap
            </Link>

            <p className="text-sm text-[#859599]">
              Module {moduleIndex + 1} of {roadmap.modules.length}
            </p>

            <h1 className="mt-1 truncate text-xl font-semibold tracking-[-0.025em]">
              {module.title}
            </h1>
          </div>

          {!isLocked && (
            <div className="hidden sm:block">
              {nextPendingInterview ? (
                <Link
                  href={`/interview/${nextPendingInterview.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F] transition hover:bg-(--color-accent)/80"
                >
                  <Play size={15} />
                  Continue round
                </Link>
              ) : canCreateMore ? (
                <CreateModuleInterviewButton
                  userId={user.id}
                  roadmapId={id}
                  moduleId={moduleId}
                  label={
                    interviews.length === 0
                      ? "Start first round"
                      : "Create next round"
                  }
                />
              ) : (
                <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-(--color-accent)/20 bg-(--color-accent)/10 px-3 text-sm font-medium text-[#a7e1f3]">
                  <CheckCircle2 size={15} />
                  Module complete
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(255,255,255,0.045),transparent_30%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[1fr_320px]">
          <div className="border-b border-white/6 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-4 inline-flex items-center gap-2 text-[#a7ddf3]">
              <Map size={18} />
              {roadmap.title}
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
              {module.title}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#a8b1b3]">
              {module.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{roadmap.role}</Badge>
              <Badge>{roadmap.level}</Badge>
              <Badge>{module.status}</Badge>
            </div>

            {isLocked && (
              <div className="mt-6 rounded-md border border-white/6 bg-white/[0.018] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 text-[#798183]">
                    <Lock size={15} />
                  </span>

                  <div>
                    <p className="text-sm font-medium text-[#F4F1EA]">
                      Module locked
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#a8b1b3]">
                      Complete the available modules before starting this one.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#798183]">
              Module progress
            </p>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-[-0.06em]">
                {moduleProgress}
              </span>
              <span className="mb-2 text-sm text-[#798183]">%</span>
            </div>

            <div className="mt-5 h-2 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-(--color-accent)"
                style={{ width: `${moduleProgress}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniStat
                icon={<CheckCircle2 size={14} />}
                label="Completed"
                value={`${completedInterviews.length}`}
              />
              <MiniStat
                icon={<FileText size={14} />}
                label="Target"
                value={`${module.interviewCount}`}
              />
            </div>

            {!isLocked && (
              <div className="mt-5 sm:hidden">
                {nextPendingInterview ? (
                  <Link
                    href={`/interview/${nextPendingInterview.id}`}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-4 text-sm font-medium text-[#03110F]"
                  >
                    <Play size={15} />
                    Continue interview
                  </Link>
                ) : (
                  <CreateModuleInterviewButton
                    userId={user.id}
                    roadmapId={id}
                    moduleId={moduleId}
                    label="Generate interview"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {previousModule ? (
          <ModuleNavCard
            label="Previous module"
            title={previousModule.title}
            href={`/roadmaps/${id}/modules/${previousModule.id}`}
            disabled={previousModule.status === "locked"}
          />
        ) : (
          <ModuleNavPlaceholder label="Previous module" />
        )}

        {nextModule ? (
          <ModuleNavCard
            label="Next module"
            title={nextModule.title}
            href={`/roadmaps/${id}/modules/${nextModule.id}`}
            disabled={!canOpenNextModule}
            lockedText="Complete one round in this module to unlock."
          />
        ) : (
          <ModuleNavPlaceholder
            label="Next module"
            text="This is the final module."
          />
        )}
      </section>

      <main className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Panel
            eyebrow="Module interviews"
            title="Practice queue"
            action={
              !isLocked ? (
                <CreateModuleInterviewButton
                  userId={user.id}
                  roadmapId={id}
                  moduleId={moduleId}
                  label="Generate"
                />
              ) : null
            }
          >
            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.map((interview) => (
                  <InterviewCard
                    {...interview}
                    key={interview.id}
                    feedback={interview.feedback}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                locked={isLocked}
                userId={user.id}
                roadmapId={id}
                moduleId={moduleId}
              />
            )}
          </Panel>

          <Panel eyebrow="Skills" title="Target skills">
            <div className="grid gap-3 md:grid-cols-2">
              {module.targetSkills.map((skill) => (
                <SkillCard key={skill} skill={skill} />
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <SideCard title="Module status" icon={<Layers3 size={15} />}>
            <div className="space-y-4">
              <StatusRow label="Status" value={module.status} />
              <StatusRow
                label="Practice rounds"
                value={`${interviews.length}/${module.interviewCount}`}
              />
              <StatusRow
                label="Completed"
                value={`${completedInterviews.length}`}
              />
              <StatusRow
                label="Pending"
                value={`${pendingInterviews.length}`}
              />
            </div>
          </SideCard>

          <SideCard title="Best practice" icon={<BookOpen size={15} />}>
            <div className="space-y-3 text-sm text-[#a8b1b3]">
              <PracticeStep number="1" text="Generate one module interview." />
              <PracticeStep number="2" text="Take the session fully." />
              <PracticeStep number="3" text="Review feedback report." />
              <PracticeStep
                number="4"
                text="Retake until the module is strong."
              />
            </div>
          </SideCard>

          <SideCard title="Roadmap navigation" icon={<ArrowRight size={15} />}>
            <div className="space-y-2">
              {roadmap.modules.map((item, index) => (
                <Link
                  key={item.id}
                  href={
                    item.status === "locked"
                      ? "#"
                      : `/roadmaps/${id}/modules/${item.id}`
                  }
                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm transition ${
                    item.id === moduleId
                      ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#a7e1f3]"
                      : item.status === "locked"
                        ? "border-white/6 bg-white/1.5 text-[#798183]"
                        : "border-white/6 bg-white/[0.018] text-[#a8b1b3] hover:bg-white/4"
                  }`}
                >
                  <span className="truncate">
                    {index + 1}. {item.title}
                  </span>

                  {item.status === "completed" ? (
                    <CheckCircle2 size={14} />
                  ) : item.status === "locked" ? (
                    <Lock size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </Link>
              ))}
            </div>
          </SideCard>
        </aside>
      </main>
    </section>
  );
};

export default RoadmapModulePage;

function ModuleNavCard({
  label,
  title,
  href,
  disabled,
  lockedText,
}: {
  label: string;
  title: string;
  href: string;
  disabled?: boolean;
  lockedText?: string;
}) {
  if (disabled) {
    return (
      <div className="rounded-md border border-white/6 bg-white/1.5 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#798183]">
          {label}
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-[#798183]">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-[#798183]">
              {lockedText || "This module is locked."}
            </p>
          </div>

          <Lock size={15} className="text-[#798183]" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group rounded-md border border-white/6 bg-(--color-surface-1) p-4 transition hover:border-white/10 hover:bg-white/[0.018]"
    >
      <p className="text-xs uppercase tracking-[0.14em] text-[#798183]">
        {label}
      </p>

      <div className="mt-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-[#F4F1EA]">{title}</h3>
        <ArrowRight
          size={15}
          className="text-[#798183] transition group-hover:text-[#a7e1f3]"
        />
      </div>
    </Link>
  );
}

function ModuleNavPlaceholder({
  label,
  text = "No module available.",
}: {
  label: string;
  text?: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-white/8 bg-white/[0.012] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-[#798183]">
        {label}
      </p>
      <p className="mt-3 text-sm text-[#798183]">{text}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/6 bg-white/2.5 px-2 py-1 text-xs capitalize text-[#a8b1b3]">
      {children}
    </span>
  );
}

function MiniStat({
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
      <div className="flex items-center gap-2 text-[#798183]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-[#F4F1EA]">{value}</p>
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
      <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3">
        <div>
          <p className="text-sm text-[#859599]">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-medium text-[#F4F1EA]">{title}</h2>
        </div>

        {action}
      </div>

      <div className="pt-4">{children}</div>
    </section>
  );
}

function EmptyState({
  locked,
  userId,
  roadmapId,
  moduleId,
}: {
  locked: boolean;
  userId: string;
  roadmapId: string;
  moduleId: string;
}) {
  if (locked) {
    return (
      <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-6">
        <h3 className="text-sm font-medium">Module locked</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#a8b1b3]">
          This module will unlock after you complete the previous available
          module.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-6">
      <h3 className="text-sm font-medium">No practice rounds yet</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#a8b1b3]">
        Start the first round for this module. Each round creates a focused
        interview based on this module's skills.
      </p>

      <div className="mt-5">
        <CreateModuleInterviewButton
          userId={userId}
          roadmapId={roadmapId}
          moduleId={moduleId}
          label="Start first round"
        />
      </div>
    </div>
  );
}

function SkillCard({ skill }: { skill: string }) {
  return (
    <div className="rounded-md border border-white/6 bg-(--color-surface-1) p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 text-[#a7e1f3]">
          <Target size={15} />
        </span>

        <div>
          <p className="text-sm font-medium text-[#F4F1EA]">{skill}</p>
          <p className="mt-1 text-xs text-[#798183]">Target skill</p>
        </div>
      </div>
    </div>
  );
}

function SideCard({
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
        <h3 className="text-sm font-medium text-[#F4F1EA]">{title}</h3>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-[#a8b1b3]">{label}</span>
      <span className="capitalize text-[#F4F1EA]">{value}</span>
    </div>
  );
}

function PracticeStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#a7e1f3]">
        {number}
      </span>
      <span className="leading-6">{text}</span>
    </div>
  );
}
