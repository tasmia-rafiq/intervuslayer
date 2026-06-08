const metrics = [
  ["Communication", "84%"],
  ["Technical depth", "72%"],
  ["Structure", "78%"],
  ["Confidence", "69%"],
];

export default function FeedbackReport() {
  return (
    <section id="feedback" className="px-6 pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-[#69756F]">Feedback report</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
          Less vague advice. More exact next steps.
        </h2>

        <div className="mt-8 rounded-3xl border border-white/8 bg-[#0B0F0D]/90 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <div>
              <p className="text-sm text-[#69756F]">Overall score</p>
              <div className="mt-5 flex size-32 items-center justify-center rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-4xl font-semibold">
                78
              </div>
              <p className="mt-5 text-xl font-semibold">Good clarity</p>
              <p className="mt-2 text-sm leading-6 text-[#A8B3AD]">
                Strong answer structure, but needs deeper examples and more
                concise technical explanation.
              </p>
            </div>

            <div>
              <div className="grid gap-4 md:grid-cols-2">
                {metrics.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/6 bg-white/2.5 p-4"
                  >
                    <div className="mb-3 flex justify-between text-sm">
                      <span className="text-[#A8B3AD]">{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-[#2DD4BF]"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/6 bg-black/20 p-5">
                  <p className="text-sm text-[#69756F]">Strengths</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#A8B3AD]">
                    <li>Clear explanation flow</li>
                    <li>Good high-level understanding</li>
                    <li>Calm pacing</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/6 bg-black/20 p-5">
                  <p className="text-sm text-[#69756F]">Improve next</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#A8B3AD]">
                    <li>Use concrete implementation examples</li>
                    <li>Reduce vague API descriptions</li>
                    <li>Mention tradeoffs faster</li>
                  </ul>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#2DD4BF]/15 bg-[#2DD4BF]/5.5 p-5">
                <p className="text-sm text-[#A7F3D0]">
                  Recommended next practice
                </p>
                <p className="mt-2 font-semibold">
                  Retake Backend Fundamentals with timed follow-up questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}