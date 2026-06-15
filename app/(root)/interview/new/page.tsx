import NewInterviewForm from "@/components/NewInterviewForm";
import NewRoadmapForm from "@/components/NewRoadmapForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  ArrowLeft,
  FileText,
  Layers3,
  Map,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

const NewInterviewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) => {
  const user = await getCurrentUser();
  const params = await searchParams;

  const mode = params.mode === "single_interview" ? "single_interview" : "roadmap";

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div>
          <Link
            href={mode === "roadmap" ? "/roadmaps" : "/interview"}
            className="mb-3 inline-flex items-center gap-2 text-sm text-[#91a1a5] transition hover:text-[#F4F1EA]"
          >
            <ArrowLeft size={14} />
            Back to {mode === "roadmap" ? "roadmaps" : "interviews"}
          </Link>

          <div className="flex items-center gap-2 text-sm text-[#97a6aa]">
            <span>{mode === "roadmap" ? "Roadmaps" : "Interviews"}</span>
            <span>/</span>
            <span className="text-[#a8b1b3]">New</span>
          </div>

          <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
            {mode === "roadmap" ? "Create roadmap" : "Create interview"}
          </h1>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-md border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-8 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
          <div className="flex flex-col justify-start">
            <div>
              <div className="mb-5 inline-flex rounded-md border border-white/6 bg-[#050607]/60 p-1">
                <ModeTab
                  href="/interview/new"
                  active={mode === "roadmap"}
                  icon={<Map size={14} />}
                  label="Roadmap"
                />

                <ModeTab
                  href="/interview/new?mode=single_interview"
                  active={mode === "single_interview"}
                  icon={<FileText size={14} />}
                  label="Single interview"
                />
              </div>

              <h2 className="max-w-xl text-4xl font-semibold tracking-[-0.05em]">
                {mode === "roadmap"
                  ? "Build a structured preparation path for your target role."
                  : "Build a focused interview for your target role."}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-[#b7bfc0]">
                {mode === "roadmap"
                  ? "Create a roadmap with modules, skills, and interview tracks so your preparation becomes measurable."
                  : "Enter the role, seniority, tech stack, interview type, and question count. Your interview will be generated and added to your queue."}
              </p>
            </div>

            <div className="mt-10 rounded-md border border-white/6 bg-[#050607]/60 p-4">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                <Sparkles size={15} className="text-[#a7ddf3]" />
                {mode === "roadmap" ? "Roadmap example" : "Good setup examples"}
              </div>

              {mode === "roadmap" ? (
                <div className="space-y-3">
                  <Example label="Role" value="Frontend Developer" />
                  <Example label="Level" value="Junior" />
                  <Example label="Stack" value="React, Next.js, TypeScript" />
                  <Example
                    label="Modules"
                    value="JS, React, APIs, Behavioral"
                  />

                  <div className="mt-4 rounded-md border border-white/6 bg-white/[0.018] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#F4F1EA]">
                      <Layers3 size={15} className="text-[#a7ddf3]" />
                      What gets created
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#b9bfc2]">
                      A role-specific preparation plan with ordered modules,
                      target skills, and interview counts.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm text-[#b9bfc2]">
                  <Example label="Role" value="Frontend Developer" />
                  <Example label="Level" value="Junior" />
                  <Example label="Stack" value="React, Next.js, TypeScript" />
                  <Example label="Type" value="Technical or Mixed" />
                </div>
              )}
            </div>
          </div>

          {mode === "roadmap" ? (
            <NewRoadmapForm userId={user?.id} />
          ) : (
            <NewInterviewForm userId={user?.id} />
          )}
        </div>
      </section>
    </section>
  );
};

export default NewInterviewPage;

function ModeTab({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center gap-2 rounded-sm px-3 text-sm transition ${
        active
          ? "bg-white/8 text-[#F4F1EA]"
          : "text-[#859599] hover:text-[#F4F1EA]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function Example({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 pb-2 text-sm last:border-b-0 last:pb-0">
      <span className="text-[#69756F]">{label}</span>
      <span className="text-right text-[#F4F1EA]">{value}</span>
    </div>
  );
}
