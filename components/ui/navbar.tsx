"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed left-0 right-0 top-5 z-50 px-6"
    >
      <div className="mx-auto max-w-6xl rounded-2xl border border-white/8 bg-[#070A09]/75 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="IntervU Slayer" className="size-8" />
            <span className="text-sm font-semibold text-[#F4F1EA]">
              IntervU Slayer
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-[#A8B3AD] md:flex">
            <Link href="#product" className="transition hover:text-[#F4F1EA]">
              Product
            </Link>
            <Link href="#how" className="transition hover:text-[#F4F1EA]">
              How it works
            </Link>
            <Link href="#feedback" className="transition hover:text-[#F4F1EA]">
              Feedback
            </Link>
            <Link href="#pricing" className="transition hover:text-[#F4F1EA]">
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden text-sm text-[#A8B3AD] transition hover:text-[#F4F1EA] sm:block"
            >
              Login
            </Link>

            <Link
              href="/sign-up"
              className="flex items-center gap-2 rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/15 px-4 py-2 text-sm font-semibold text-[#A7F3D0] transition hover:bg-[#2DD4BF] hover:text-[#03110F]"
            >
              Get started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}