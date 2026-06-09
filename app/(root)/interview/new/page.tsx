import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { ArrowLeft, Mic, Mic2, Sparkles } from "lucide-react";
import Link from "next/link";

const NewInterviewPage = async () => {
  const user = await getCurrentUser();

  return (
    <section className="space-y-6">
      <header className="-mx-5 border-b border-white/6 px-5 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link
              href="/interview"
              className="mb-3 inline-flex items-center gap-2 text-sm text-[#859599] transition hover:text-[#F4F1EA]"
            >
              <ArrowLeft size={14} />
              Back to interviews
            </Link>

            <div className="flex items-center gap-2 text-sm text-[#97a6aa]">
              <span>Interviews</span>
              <span>/</span>
              <span className="text-[#a8b1b3]">Generate</span>
            </div>

            <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
              Create a new interview
            </h1>
          </div>

          <div className="hidden items-center gap-2 rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#b5bdbe] sm:flex">
            <Mic2 size={13} />
            Voice-guided setup
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-2xl border border-white/6 bg-(--color-surface-1)">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

        <div className="relative grid gap-8 p-6 lg:grid-cols-[1fr_320px] lg:p-7">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-[#a7e4f3]">
              <Mic size={18} />
              Interview builder
            </div>

            <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] md:text-4xl">
              Generate a role-specific interview through a short voice setup.
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-6 text-[#bcc5c7]">
              The assistant will ask for your target role, level, tech stack,
              interview type, and question count. Once done, your interview will
              be saved to the queue.
            </p>
          </div>

          <div className="rounded-2xl border border-white/6 bg-[#050607]/60 p-4">
            <p className="text-sm font-medium text-[#F4F1EA]">
              What gets created
            </p>

            <div className="mt-4 space-y-3">
              <SetupItem number="1" title="Role" text="Frontend, backend, AI, SQA, etc." />
              <SetupItem number="2" title="Level" text="Junior, mid, senior, or custom." />
              <SetupItem number="3" title="Stack" text="Tools, frameworks, and topics." />
              <SetupItem number="4" title="Question set" text="Saved to your interview queue." />
            </div>
          </div>
        </div>
      </section>

      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </section>
  );
};

export default NewInterviewPage;

function SetupItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#A7F3D0]">
        {number}
      </span>

      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#859599]">{text}</p>
      </div>
    </div>
  );
}