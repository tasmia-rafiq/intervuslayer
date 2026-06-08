import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-5xl rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
        <p className="text-sm text-[#A7F3D0]">Ready when you are</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.045em]">
          Practice once. Improve every round.
        </h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#A8B3AD]">
          Start a focused interview session and leave with a clear report on
          what to fix next.
        </p>

        <div className="mt-8">
          <Link
            href="/interview"
            className="inline-flex rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#03110F] transition hover:-translate-y-0.5 hover:bg-[#5EEAD4]"
          >
            Start practicing
          </Link>
        </div>
      </div>
    </section>
  );
}