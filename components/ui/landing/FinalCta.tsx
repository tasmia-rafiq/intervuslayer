import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Mic2, Sparkles } from "lucide-react";

const points = [
  "Role-specific interviews",
  "Voice practice sessions",
  "Actionable feedback reports",
];

export default function FinalCta() {
  return (
    <section className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-white/6 bg-(--color-bg)">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.04),transparent_22%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.045),transparent_28%)]" />

          <div className="relative grid gap-0 lg:grid-cols-[1fr_360px]">
            <div className="border-b border-white/6 p-7 lg:border-b-0 lg:border-r">
              <div className="mb-5 inline-flex items-center gap-2 text-[#a7e4f3]">
                <Sparkles size={18} />
                Ready when you are
              </div>

              <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.055em] md:text-5xl">
                Turn every practice round into a sharper interview answer.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-[#b7c0c2]">
                Generate a targeted interview, take it under realistic pacing,
                and use the report to know exactly what to improve next.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/interview"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-4 text-sm font-medium text-[#030d11] transition hover:bg-[#5ee5ea]"
                >
                  Start practicing
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="#feedback"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 px-4 text-sm font-medium text-[#F4F1EA] transition hover:bg-white/6"
                >
                  View report preview
                </Link>
              </div>
            </div>

            <div className="p-7">
              <div className="rounded-xl border border-white/6 bg-[#050607]/70 p-4">
                <p className="text-sm font-medium text-[#F4F1EA]">
                  What you get
                </p>

                <div className="mt-4 space-y-3">
                  {points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/[0.018] px-3 py-2.5"
                    >
                      <CheckCircle2 size={15} className="text-[#a7e4f3]" />
                      <span className="text-sm text-[#b7c0c2]">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat icon={<Mic2 size={15} />} label="Session" value="Live" />
                  <MiniStat icon={<FileText size={15} />} label="Report" value="Scored" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    <div className="rounded-lg border border-white/6 bg-white/[0.018] p-3">
      <div className="flex items-center gap-2 text-[#69756F]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-[#F4F1EA]">{value}</p>
    </div>
  );
}