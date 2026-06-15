import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Map,
  Play,
} from "lucide-react";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRoadmapById } from "@/lib/actions/general.action";

const RoadmapDetailPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  const roadmap = await getRoadmapById(id);

  if (!roadmap) redirect("/roadmaps");
  if (roadmap.userId !== user?.id) redirect("/roadmaps");

  const availableModule = roadmap.modules.find(
    (module) => module.status === "available",
  );

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div>
          <Link
            href="/roadmaps"
            className="mb-3 inline-flex items-center gap-2 text-sm text-[#91a0a3] transition hover:text-[#F4F1EA]"
          >
            <ArrowLeft size={14} />
            Back to roadmaps
          </Link>

          <p className="text-sm text-[#91a0a3]">Interview roadmap</p>

          <h1 className="mt-1 text-xl font-semibold capitalize tracking-[-0.025em]">
            {roadmap.title}
          </h1>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-xl border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-0 lg:grid-cols-[1fr_300px]">
          <div className="border-b border-white/6 p-6 lg:border-b-0 lg:border-r">
            <div className="mb-4 inline-flex items-center gap-2 text-[#a7e1f3]">
              <Map size={18} />
              Structured preparation
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
              {roadmap.role} interview roadmap.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b4bcbe]">
              {roadmap.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>{roadmap.level}</Badge>
              {roadmap.techstack.slice(0, 4).map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          <div className="p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
              Readiness progress
            </p>

            <div className="mt-5 text-5xl font-semibold tracking-[-0.06em]">
              {roadmap.progress}%
            </div>

            <div className="mt-5 h-2 rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-(--color-accent)"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>

            {availableModule && (
              <Link
                href={`/roadmaps/${roadmap.id}/modules/${availableModule.id}`}
                className="mt-6 inline-flex h-9 items-center gap-2 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F]"
              >
                Continue module
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="border-b border-white/6 pb-3">
          <p className="text-sm text-[#91a0a3]">Modules</p>
          <h2 className="mt-1 text-lg font-medium">Preparation path</h2>
        </div>

        <div className="mt-4 space-y-3">
          {roadmap.modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              roadmapId={roadmap.id}
              module={module}
              index={index}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default RoadmapDetailPage;

function ModuleCard({
  roadmapId,
  module,
  index,
}: {
  roadmapId: string;
  module: RoadmapModule;
  index: number;
}) {
  const isLocked = module.status === "locked";
  const isCompleted = module.status === "completed";

  return (
    <div className="rounded-md border border-white/6 bg-(--color-surface-1) p-4">
      <div className="flex items-start justify-between gap-5">
        <div className="flex gap-3">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg border ${
              isCompleted
                ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#a7e1f3]"
                : isLocked
                  ? "border-white/6 bg-white/2.5 text-[#69756F]"
                  : "border-white/6 bg-white/2.5 text-[#a7e1f3]"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 size={15} />
            ) : isLocked ? (
              <Lock size={15} />
            ) : (
              <Play size={15} />
            )}
          </span>

          <div>
            <p className="text-sm text-[#888f91]">Module {index + 1}</p>

            <h3 className="mt-1 text-lg font-medium">{module.title}</h3>

            <p className="mt-2 max-w-2xl leading-6 text-[#b4bcbe]">
              {module.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {module.targetSkills.slice(0, 4).map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right flex flex-col items-end w-fit">
          <ModuleStatusBadge module={module} />

          {!isLocked && (
            <Link
              href={`/roadmaps/${roadmapId}/modules/${module.id}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#A7F3D0] transition hover:text-(--color-accent)"
            >
              {isCompleted
                ? "Review"
                : module.completedCount > 0
                  ? "Continue"
                  : "Start"}
                <ArrowRight size={14} />
            </Link>
          )}

          {isLocked && (
            <p className="mt-4 max-w-40 text-xs leading-5 text-[#69756F]">
              Complete one round in the previous module to unlock.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-white/6 bg-white/2.5 px-2 py-1 text-xs capitalize text-[#b4bcbe]">
      {children}
    </span>
  );
}

function ModuleStatusBadge({ module }: { module: RoadmapModule }) {
  if (module.status === "locked") {
    return (
      <span className="rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#69756F]">
        Locked
      </span>
    );
  }

  if (module.status === "completed") {
    return (
      <span className="rounded-md border border-(--color-accent)/20 bg-(--color-accent)/10 px-2.5 py-1 text-xs text-[#A7F3D0]">
        Completed
      </span>
    );
  }

  if (module.completedCount > 0) {
    return (
      <span className="rounded-md border border-(--color-accent)/20 bg-(--color-accent)/10 px-2.5 py-1 text-xs text-[#A7F3D0]">
        In progress
      </span>
    );
  }

  return (
    <span className="rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#A8B3AD]">
      Available
    </span>
  );
}