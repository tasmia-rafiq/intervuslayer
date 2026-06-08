const roles = [
  "Frontend",
  "Backend",
  "Full Stack",
  "SQA",
  "DevOps",
  "UI/UX",
  "Behavioral",
];

export default function RoleStrip() {
  return (
    <section className="px-6 pt-12">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
        {roles.map((role) => (
          <span
            key={role}
            className="rounded-full border border-white/[0.07] bg-white/2.5 px-4 py-2 text-xs text-[#A8B3AD]"
          >
            {role}
          </span>
        ))}
      </div>
    </section>
  );
}