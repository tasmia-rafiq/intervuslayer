"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Mic2,
  RotateCcw,
  Target,
} from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Choose your role",
    desc: "Set the role, level, question style, and stack you want to practice.",
    icon: Target,
  },
  {
    num: "02",
    title: "Take the interview",
    desc: "Answer through a focused voice session with realistic pacing.",
    icon: Mic2,
  },
  {
    num: "03",
    title: "Review the report",
    desc: "See scores, strengths, weak areas, and specific feedback.",
    icon: FileText,
  },
  {
    num: "04",
    title: "Retake smarter",
    desc: "Repeat the exact skill area that needs sharper answers.",
    icon: RotateCcw,
  },
];

export default function Timeline() {
  return (
    <section id="how" className="relative px-6 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="text-[#869294]">How it works</p>
            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              One focused loop from practice to progress.
            </h2>
          </div>

          <p className="max-w-xl leading-6 text-[#b7c0c2] md:justify-self-end">
            Every session connects to the next one. Generate, practice, review,
            and retake with a clear reason instead of guessing what to improve.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-white/6 bg-(--color-bg)">
          <div className="grid divide-y divide-white/6 md:grid-cols-4 md:divide-x md:divide-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.06, duration: 0.45 }}
                  className="group relative min-h-[300px] overflow-hidden p-5 transition hover:bg-(--color-surface-1)/20"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.025),transparent_32%)] opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex size-9 items-center justify-center rounded-lg border border-white/6 bg-white/2.5 text-[#a7e4f3]">
                          <Icon size={16} />
                        </span>

                        <span className="text-xs text-[#7b8488]">
                          {step.num}
                        </span>
                      </div>

                      <h3 className="mt-8 text-xl font-semibold tracking-[-0.035em] text-[#F4F1EA]">
                        {step.title}
                      </h3>

                      <p className="mt-3 leading-6 text-[#b4bcbe]">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-sm text-[#7b8488]">
                      {index < steps.length - 1 ? (
                        <>
                          Next step
                          <ArrowRight
                            size={13}
                            className="transition group-hover:translate-x-0.5 group-hover:text-[#a7e4f3]"
                          />
                        </>
                      ) : (
                        <>
                          Repeat loop
                          <CheckCircle2 size={13} className="text-[#a7e4f3]" />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}