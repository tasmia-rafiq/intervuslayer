import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For trying focused interview practice.",
    cta: "Start free",
    href: "/sign-up",
    featured: false,
    features: [
      "Generate role-based interviews",
      "Take practice sessions",
      "Basic feedback reports",
      "Progress overview",
    ],
  },
  {
    name: "Pro",
    price: "$8",
    period: "/month",
    description: "For serious job preparation and repeated practice.",
    cta: "Join waitlist",
    href: "/sign-up",
    featured: true,
    features: [
      "Unlimited interview generation",
      "Advanced feedback reports",
      "Skill trend analytics",
      "Retake recommendations",
      "Priority model quality",
    ],
  },
  {
    name: "Team",
    price: "Custom",
    description: "For bootcamps, mentors, and hiring prep groups.",
    cta: "Contact us",
    href: "/sign-up",
    featured: false,
    features: [
      "Shared team workspace",
      "Candidate progress reports",
      "Admin overview",
      "Custom interview tracks",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-6 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[0.8fr_1fr] md:items-end">
          <div>
            <p className="text-[#869294]">Pricing</p>
            <h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-[-0.045em] md:text-4xl">
              Start free. Upgrade when practice becomes routine.
            </h2>
          </div>

          <p className="max-w-xl leading-6 text-[#b7c0c2] md:justify-self-end">
            Keep the core practice loop accessible while leaving room for deeper
            analytics, stronger reports, and team workflows later.
          </p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-xl border p-5 transition duration-300 ${
                plan.featured
                  ? "border-(--color-accent)/25 bg-(--color-accent)/7.5"
                  : "border-white/6 bg-(--color-bg) hover:border-white/10"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.055),transparent_30%)]" />

              {plan.featured && (
                <div className="absolute -right-12 -top-12 size-36 rounded-full bg-(--color-accent)/10 blur-2xl" />
              )}

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div
                    className={`flex size-10 items-center justify-center rounded-md border ${
                      plan.featured
                        ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#a7e4f3]"
                        : "border-white/6 bg-white/2.5 text-[#b7c0c2]"
                    }`}
                  >
                    {plan.name === "Starter" ? (
                      <Zap size={17} />
                    ) : plan.name === "Team" ? (
                      <Users size={17} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                  </div>

                  {plan.featured && (
                    <span className="rounded-full border border-(--color-accent)/20 bg-(--color-accent)/10 px-2.5 py-1 text-[11px] font-medium text-[#a7e4f3]">
                      Best fit
                    </span>
                  )}
                </div>

                <div className="mt-7">
                  <h3 className="text-sm font-medium text-[#F4F1EA]">
                    {plan.name}
                  </h3>

                  <div className="mt-3 flex items-end gap-1">
                    <span className="text-4xl font-semibold tracking-[-0.06em] text-[#F4F1EA]">
                      {plan.price}
                    </span>

                    {plan.period && (
                      <span className="mb-1 text-sm text-[#869294]">
                        {plan.period}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-[#b7c0c2]">
                    {plan.description}
                  </p>
                </div>

                <Link
                  href={plan.href}
                  className={`mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition ${
                    plan.featured
                      ? "bg-(--color-accent) text-[#030e11] hover:bg-[#5ee1ea]"
                      : "border border-white/6 bg-white/2.5 text-[#F4F1EA] hover:bg-white/6"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>

                <div className="mt-6 border-t border-white/6 pt-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#869294]">
                    Includes
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-sm leading-6 text-[#b7c0c2]"
                      >
                        <CheckCircle2
                          size={15}
                          className={
                            plan.featured
                              ? "mt-1 shrink-0 text-[#a7e4f3]"
                              : "mt-1 shrink-0 text-[#869294]"
                          }
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.018] px-4 py-3 text-sm text-[#a4b2b6]">
          Payments are not enabled yet. Pricing is shown as a product direction
          and can be connected later.
        </div>
      </div>
    </section>
  );
}