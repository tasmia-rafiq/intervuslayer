import Link from "next/link";

const productLinks = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
  { label: "Feedback", href: "#feedback" },
  { label: "Pricing", href: "#pricing" },
];

const practiceLinks = [
  { label: "Frontend Interview", href: "/interview" },
  { label: "Backend Interview", href: "/interview" },
  { label: "SQA Interview", href: "/interview" },
  { label: "DevOps Interview", href: "/interview" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,0.08),transparent_34%)]" />

      <div className="mx-auto max-w-6xl py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.7fr_0.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="IntervU Slayer" className="size-8" />
              <span className="text-sm font-semibold text-[#F4F1EA]">
                IntervU Slayer
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#A8B3AD]">
              A focused interview practice system for developers who want
              measurable feedback, sharper answers, and better retake loops.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["Voice", "Technical", "Behavioral", "Mixed"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.07] bg-white/2.5 px-3 py-1 text-xs text-[#A8B3AD]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#F4F1EA]">Product</h4>
            <div className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[#A8B3AD] transition hover:text-[#F4F1EA]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#F4F1EA]">Practice</h4>
            <div className="mt-4 space-y-3">
              {practiceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-[#A8B3AD] transition hover:text-[#F4F1EA]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-6 text-xs text-[#69756F] md:flex-row">
          <p>© {new Date().getFullYear()} IntervU Slayer. All rights reserved.</p>
          <p>Built for focused interview practice.</p>
        </div>
      </div>
    </footer>
  );
}