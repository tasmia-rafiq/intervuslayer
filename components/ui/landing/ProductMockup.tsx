"use client";

import { motion } from "framer-motion";

const bars = [42, 64, 38, 76, 52, 88, 46, 69, 34, 58, 80, 44];

export default function ProductMockup() {
  return (
    <section id="product" className="relative px-6 pt-10">
      <div
        className="
            absolute
            left-1/2
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            h-[500px]
            w-[900px]
            rounded-full
            blur-[140px]
            opacity-30
            pointer-events-none
        "
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.18), transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative rounded-[26px] border border-white/10 bg-[#0B0F0D]/90 p-2 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="absolute -inset-px rounded-[26px] bg-linear-to-b from-white/10 via-transparent to-transparent opacity-60" />

          <div className="relative overflow-hidden rounded-[20px] border border-white/6 bg-[#070A09]">
            <div className="flex items-center justify-between border-b border-white/6 px-5 py-3">
              <div className="flex gap-2">
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/10" />
                <span className="size-2.5 rounded-full bg-white/10" />
              </div>

              <div className="hidden rounded-full border border-white/6 bg-white/3 px-4 py-1 text-xs text-[#69756F] md:block">
                intervuslayer.app/session/frontend
              </div>

              <div className="flex items-center gap-2 text-xs text-[#A7F3D0]">
                <span className="size-2 rounded-full bg-[#2DD4BF]" />
                Live
              </div>
            </div>

            <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[230px_1fr_280px]">
              <aside className="hidden border-r border-white/6 bg-white/1.5 p-5 lg:block">
                <p className="mb-5 text-xs uppercase tracking-[0.18em] text-[#69756F]">
                  Practice room
                </p>

                {["Live session", "Question flow", "Transcript", "Reports"].map(
                  (item, index) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-xl px-3 py-2 text-sm ${
                        index === 0
                          ? "bg-[#2DD4BF]/10 text-[#A7F3D0]"
                          : "text-[#69756F]"
                      }`}
                    >
                      {item}
                    </div>
                  ),
                )}

                <div className="mt-10 rounded-2xl border border-white/6 bg-[#0D1310] p-4">
                  <p className="text-xs text-[#69756F]">Readiness</p>
                  <div className="mt-3 text-3xl font-semibold">78%</div>
                  <p className="mt-1 text-xs text-[#A7F3D0]">+12 this week</p>
                </div>
              </aside>

              <main className="relative p-5 md:p-7">
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm text-[#69756F]">Frontend Engineer</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                      Explain the JavaScript event loop.
                    </h3>
                  </div>

                  <div className="rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 px-3 py-1 text-xs text-[#A7F3D0]">
                    In progress
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#2DD4BF]/20 bg-[#0D1512] p-5 shadow-[0_0_50px_rgba(45,212,191,0.06)]">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-lg font-semibold">
                      AI
                    </div>
                    <p className="mt-4 text-center font-semibold">
                      AI Interviewer
                    </p>

                    <div className="mt-6 flex h-12 items-center justify-center gap-1">
                      {bars.map((height, index) => (
                        <motion.span
                          key={index}
                          animate={{
                            height: [
                              `${height * 0.45}%`,
                              `${height}%`,
                              `${height * 0.55}%`,
                            ],
                          }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: index * 0.05,
                          }}
                          className="w-1 rounded-full bg-[#2DD4BF]/70"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
                    <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-[#111714] text-lg font-semibold">
                      TR
                    </div>
                    <p className="mt-4 text-center font-semibold">You</p>
                    <p className="mt-6 rounded-xl border border-white/6 bg-black/20 p-3 text-sm leading-6 text-[#A8B3AD]">
                      “The event loop handles async callbacks through phases,
                      but promises run through the microtask queue first...”
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/6 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm text-[#69756F]">Live transcript</p>
                    <p className="text-xs text-[#69756F]">00:32</p>
                  </div>

                  <div className="space-y-2 text-sm leading-6 text-[#A8B3AD]">
                    <p>
                      Interviewer: Can you explain the event loop in Node.js?
                    </p>
                    <p>
                      You: It coordinates asynchronous work between the call
                      stack...
                    </p>
                  </div>
                </div>
              </main>

              <aside className="border-t border-white/6 bg-white/1.5 p-5 lg:border-l lg:border-t-0">
                <p className="text-xs uppercase tracking-[0.18em] text-[#69756F]">
                  Report preview
                </p>

                <div className="mt-5 rounded-2xl border border-white/6 bg-[#0D1310] p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-[#2DD4BF]/10 text-2xl font-semibold text-[#F4F1EA]">
                      78
                    </div>
                    <div>
                      <p className="text-xs text-[#69756F]">Overall</p>
                      <h4 className="font-semibold">Good clarity</h4>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    ["Structure", "82%"],
                    ["Technical depth", "74%"],
                    ["Confidence", "69%"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between text-xs text-[#A8B3AD]">
                        <span>{label}</span>
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

                <div className="mt-5 rounded-2xl border border-white/6 bg-black/20 p-4 text-sm leading-6 text-[#A8B3AD]">
                  Improve by using one concrete callback example before moving
                  into promises and microtasks.
                </div>
              </aside>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
