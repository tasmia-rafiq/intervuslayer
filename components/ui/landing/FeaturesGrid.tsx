"use client";

import { motion } from "framer-motion";

const features = [
  {
    label: "Voice",
    title: "Practice under real pacing.",
    desc: "Answer out loud, handle follow-ups, and build the rhythm needed for live interviews.",
  },
  {
    label: "Roles",
    title: "Question flows by track.",
    desc: "Frontend, backend, SQA, DevOps, UI/UX, and mixed interview paths.",
  },
  {
    label: "Feedback",
    title: "Reports that tell you what to fix.",
    desc: "Scores, weak areas, strengths, and next steps after every session.",
  },
  {
    label: "Loop",
    title: "Retake with intention.",
    desc: "Repeat the same skill area until your answers become clearer and sharper.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="px-6 pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm text-[#69756F]">Product system</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
            Built for deliberate interview practice.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06 }}
              className={`group rounded-[22px] border border-white/[0.07] bg-[#0B0F0D]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#2DD4BF]/25 hover:bg-[#0E1512] ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1 text-xs text-[#A7F3D0]">
                  {feature.label}
                </span>
                <span className="text-[#69756F] transition group-hover:text-[#2DD4BF]">
                  0{index + 1}
                </span>
              </div>

              <h3 className="max-w-md text-2xl font-semibold tracking-[-0.035em]">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-md leading-7 text-[#A8B3AD]">
                {feature.desc}
              </p>

              {index === 0 && (
                <div className="mt-10 rounded-2xl border border-white/6 bg-black/20 p-4">
                  <div className="flex h-20 items-end gap-1">
                    {[30, 52, 38, 70, 46, 88, 42, 60, 36, 74, 55, 40].map(
                      (height, i) => (
                        <span
                          key={i}
                          style={{ height: `${height}%` }}
                          className="w-full rounded-full bg-[#2DD4BF]/40"
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}