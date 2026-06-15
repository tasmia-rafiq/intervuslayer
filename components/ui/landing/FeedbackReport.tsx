import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  RotateCcw,
  Sparkles,
  Trophy,
} from "lucide-react";

const metrics = [
  ["Communication", 84],
  ["Technical depth", 72],
  ["Structure", 78],
  ["Confidence", 69],
];

const strengths = [
  "Clear explanation flow",
  "Good high-level understanding",
  "Calm pacing",
];

const improvements = [
  "Use concrete implementation examples",
  "Reduce vague API descriptions",
  "Mention tradeoffs faster",
];

export default function FeedbackReport() {
  return (
    <section id="feedback" className="relative px-6 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="text-[#869294]">Feedback report</p>
            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              Know exactly what to improve after every session.
            </h2>
          </div>

          <p className="max-w-xl leading-6 text-[#b7c0c2] md:justify-self-end">
            Reports turn your answers into a practical improvement plan: scores,
            strengths, weak areas, and the next interview to retake.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-md border border-white/6 bg-(--color-bg)">
          <div className="grid lg:grid-cols-[320px_1fr]">
            <div className="border-b border-white/6 p-6 lg:border-b-0 lg:border-r">
              <div className="mb-4 inline-flex items-center gap-2 text-[#a7e4f3]">
                <Trophy size={18} />
                Overall result
              </div>

              <div className="mt-8 flex items-end gap-3">
                <span className="text-7xl font-semibold tracking-[-0.075em] text-[#F4F1EA]">
                  78
                </span>
                <span className="mb-3 text-sm text-[#869294]">/100</span>
              </div>

              <div className="mt-5 h-2 rounded-full bg-white/6">
                <div className="h-full w-[78%] rounded-full bg-(--color-accent)" />
              </div>

              <p className="mt-6 text-xl font-semibold">Good clarity</p>

              <p className="mt-2 text-sm leading-6 text-[#b7c0c2]">
                Strong answer structure, but examples need more technical depth
                and tighter explanation.
              </p>

              <div className="mt-6 rounded-md border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[#a7e4f3]">
                  Recommended next
                </p>

                <p className="mt-2 text-sm font-medium text-[#F4F1EA]">
                  Retake Backend Fundamentals with timed follow-ups.
                </p>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-[#869294]">Score breakdown</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.035em]">
                    Category performance
                  </h3>
                </div>

                <div className="hidden rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#b7c0c2] sm:block">
                  4 categories
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <MetricCard
                    key={label as string}
                    label={label as string}
                    value={value as number}
                  />
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <InsightCard
                  icon={<CheckCircle2 size={16} />}
                  title="Strengths"
                  items={strengths}
                  tone="positive"
                />

                <InsightCard
                  icon={<CircleAlert size={16} />}
                  title="Improve next"
                  items={improvements}
                  tone="warning"
                />
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 rounded-md border border-white/6 bg-white/[0.018] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-[#a7e4f3]">
                    <RotateCcw size={15} />
                  </span>

                  <div>
                    <p className="text-sm font-medium">Practice loop</p>
                    <p className="mt-1 text-sm leading-6 text-[#b7c0c2]">
                      Use the report to retake only what needs work.
                    </p>
                  </div>
                </div>

                <ArrowRight size={16} className="text-[#869294]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/6 bg-white/[0.018] p-4">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-[#b7c0c2]">{label}</span>
        <span className="font-medium text-[#F4F1EA]">{value}%</span>
      </div>

      <div className="h-1.5 rounded-full bg-white/6">
        <div
          className="h-full rounded-full bg-(--color-accent)"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone: "positive" | "warning";
}) {
  return (
    <div className="rounded-md border border-white/6 bg-[#050607]/70 p-5">
      <div className="flex items-center gap-2">
        <span
          className={
            tone === "positive" ? "text-[#a7e4f3]" : "text-[#f3d7a7]"
          }
        >
          {icon}
        </span>
        <p className="text-sm font-medium">{title}</p>
      </div>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-[#b7c0c2]">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-white/25" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}