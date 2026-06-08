"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-40 sm:pt-44">

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.07),transparent_34%),linear-gradient(to_bottom,#050706,#060807_50%,#040504)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[72px_72px]" />
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.08 }}
        className="mx-auto max-w-[1180px]"
      >
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1.5 text-xs font-medium text-[#9EEAD8]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4BF]" />
            Voice interviews, scored like a real review loop
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-[46px] font-semibold leading-[0.96] tracking-[-0.065em] text-[#F4F1EA] sm:text-[72px]"
          >
            Interview practice that feels sharp, measured, and real.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-7 text-[#A8B3AD] sm:text-lg"
          >
            Practice live role-based interviews, speak your answers out loud,
            and get a clear performance report that tells you what to fix before
            the next round.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/interview"
              className="rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#02110F] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_6px_30px_rgba(45,212,191,0.16)] transition hover:-translate-y-0.5 hover:bg-[#5EEAD4]"
            >
              Start a mock interview
            </Link>

            <Link
              href="#feedback"
              className="rounded-xl border border-white/8 bg-white/3 px-5 py-3 text-sm font-semibold text-[#F4F1EA] transition hover:-translate-y-0.5 hover:bg-white/6"
            >
              View report sample
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-[#728079]"
          >
            {[
              "Technical",
              "Behavioral",
              "Mixed",
              "Frontend",
              "Backend",
              "SQA",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/6 bg-black/20 px-3 py-1.5"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
