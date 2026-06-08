const steps = [
  ["01", "Choose your role", "Pick the interview track and difficulty."],
  ["02", "Start live session", "Answer through a focused voice interview."],
  ["03", "Review the report", "See scores, strengths, and weak areas."],
  ["04", "Retake smarter", "Practice the exact skill that needs work."],
];

export default function Timeline() {
  return (
    <section id="how" className="px-6 pt-28">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-[#69756F]">How it works</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
          A clean loop from practice to improvement.
        </h2>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {steps.map(([num, title, desc]) => (
            <div
              key={num}
              className="relative rounded-[20px] border border-white/[0.07] bg-white/2.5 p-5"
            >
              <div className="mb-8 text-sm text-[#2DD4BF]">{num}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#A8B3AD]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}