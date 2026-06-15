"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  GitBranch,
  Mic2,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    label: "Voice sessions",
    title: "Practice with real interview pressure.",
    desc: "Answer out loud, handle pauses, and get comfortable explaining technical decisions in real time.",
    icon: Mic2,
    visual: "voice",
  },
  {
    label: "Role targeting",
    title: "Build interviews around the job you want.",
    desc: "Choose role, level, question type, and stack so every session feels relevant to your target position.",
    icon: Target,
    visual: "roles",
  },
  {
    label: "Feedback reports",
    title: "Know exactly what weakened your answer.",
    desc: "Every completed session turns into a scored report with strengths, weak areas, and next steps.",
    icon: BarChart3,
    visual: "score",
  },
  {
    label: "Practice loop",
    title: "Retake with a specific improvement goal.",
    desc: "Use reports to identify one weak category, retake similar interviews, and track progress over time.",
    icon: RotateCcw,
    visual: "loop",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="product" className="relative px-6 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="text-[#869294]">Product system</p>
            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              A focused loop for getting interview-ready.
            </h2>
          </div>

          <p className="max-w-xl leading-6 text-[#b7c0c2] md:justify-self-end">
            IntervU Slayer is built around one flow: generate a targeted
            interview, take it under realistic pacing, review the report, and
            retake with sharper answers.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className={`group relative overflow-hidden rounded-md border border-white/6 bg-(--color-bg) transition duration-300 hover:border-white/10 hover:bg-(--color-surface-1)/20 ${
                  index === 0
                    ? "lg:col-span-7"
                    : index === 1
                      ? "lg:col-span-5"
                      : "lg:col-span-6"
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.05),transparent_30%)] opacity-80" />

                <div className="relative flex min-h-[360px] flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-[#a7e4f3]">
                          <Icon size={16} />
                        </span>

                        <span className="text-sm text-[#99a7aa]">
                          {feature.label}
                        </span>
                      </div>

                      <span className="text-xs text-[#7b8488]">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-8 max-w-md text-2xl font-semibold tracking-[-0.04em] text-[#F4F1EA]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#b4bcbe]">
                      {feature.desc}
                    </p>
                  </div>

                  <FeatureVisual type={feature.visual} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({ type }: { type: string }) {
  if (type === "voice") {
    return (
      <div className="mt-10 rounded-xl border border-white/6 bg-[#050607]/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-[#869294]">Live answer rhythm</span>
          <span className="flex items-center gap-1.5 text-xs text-[#a7e4f3]">
            <span className="size-1.5 rounded-full bg-(--color-accent)" />
            Active
          </span>
        </div>

        <div className="flex h-24 items-end gap-1.5">
          {[32, 54, 38, 76, 46, 92, 58, 70, 42, 84, 50, 66, 36, 74].map(
            (height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className="w-3 rounded-full bg-(--color-accent)/35 transition group-hover:bg-(--color-accent)/55"
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (type === "roles") {
    return (
      <div className="mt-10 space-y-2">
        {["Frontend Engineer", "Backend Developer", "SQA Engineer"].map(
          (role, index) => (
            <div
              key={role}
              className="flex items-center justify-between rounded-lg border border-white/6 bg-[#050607]/70 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#a7e4f3]">
                  {index + 1}
                </span>
                <span className="text-sm text-[#C9D2CF]">{role}</span>
              </div>

              <span className="text-xs text-[#869294]">Custom flow</span>
            </div>
          )
        )}
      </div>
    );
  }

  if (type === "score") {
    return (
      <div className="mt-10 rounded-xl border border-white/6 bg-[#050607]/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-[#869294]">Report snapshot</span>
          <span className="text-xs text-[#a7e4f3]">78/100</span>
        </div>

        <div className="space-y-3">
          {[
            ["Communication", 82],
            ["Technical depth", 74],
            ["Confidence", 69],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-[#a8b1b3]">{label}</span>
                <span className="text-[#869294]">{value}</span>
              </div>

              <div className="h-1.5 rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-(--color-accent)"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-xl border border-white/6 bg-[#050607]/80 p-4">
      <div className="space-y-3">
        {[
          ["Generate", "Targeted questions"],
          ["Practice", "Voice session"],
          ["Review", "Feedback report"],
          ["Retake", "Focused improvement"],
        ].map(([title, desc], index) => (
          <div key={title} className="flex gap-3">
            <span
              className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border text-xs ${
                index < 3
                  ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#a7e4f3]"
                  : "border-white/6 bg-white/2.5 text-[#869294]"
              }`}
            >
              {index < 3 ? <CheckCircle2 size={13} /> : index + 1}
            </span>

            <div>
              <p className="text-sm font-medium text-[#F4F1EA]">{title}</p>
              <p className="mt-0.5 text-xs text-[#869294]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}