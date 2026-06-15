import Link from "next/link";
import { ArrowUpRight, Map, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getRoadmapsByUserId } from "@/lib/actions/general.action";

const RoadmapsPage = async () => {
  const user = await getCurrentUser();
  const roadmaps = await getRoadmapsByUserId(user?.id!);

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#859599]">Workspace</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Roadmaps
            </h1>
          </div>

          <Button
            asChild
            className="h-9 rounded-lg bg-[#F4F1EA] px-3 text-sm font-medium text-[#050607] hover:bg-white"
          >
            <Link href="/interview/new">
              <Plus size={15} />
              New roadmap
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(255,255,255,0.04),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(255,255,255,0.045),transparent_30%)]" />

        <div className="relative p-6">
          <div className="mb-4 inline-flex items-center gap-2 text-[#a7e1f3]">
            <Map size={18} />
            Preparation paths
          </div>

          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em]">
            Turn random practice into a structured interview plan.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#b7bfc2]">
            Roadmaps organize your preparation into modules so you always know
            what to practice next.
          </p>
        </div>
      </section>

      {roadmaps && roadmaps.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {roadmaps.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`/roadmaps/${roadmap.id}`}
              className="group rounded-md border border-white/6 bg-(--color-surface-1) p-5 transition hover:border-white/10 hover:bg-white/[0.018]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#859599]">{roadmap.level}</p>
                  <h3 className="mt-2 text-lg font-semibold capitalize">
                    {roadmap.title}
                  </h3>
                </div>

                <ArrowUpRight
                  size={16}
                  className="text-[#797f83] transition group-hover:text-[#a7e1f3]"
                />
              </div>

              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#b7bfc2]">
                {roadmap.description}
              </p>

              <div className="mt-5 h-1.5 rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-(--color-accent)"
                  style={{ width: `${roadmap.progress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-[#69756F]">
                {roadmap.progress}% complete
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-white/8 bg-white/1.5 p-8">
          <h3 className="text-sm font-medium">No roadmaps yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#b7bfc2]">
            Create a roadmap for your target role and follow it module by
            module.
          </p>

          <Link
            href="/interview/new"
            className="mt-5 inline-flex text-sm font-medium text-[#a7e1f3]"
          >
            Create roadmap
          </Link>
        </div>
      )}
    </section>
  );
};

export default RoadmapsPage;