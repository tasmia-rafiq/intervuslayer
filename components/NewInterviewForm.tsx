"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import JobDescriptionAnalyzer from "./JobDescriptionAnalyzer";

const types = ["technical", "behavioral", "mixed"];
const levels = ["internship", "junior", "mid-level", "senior"];

export default function NewInterviewForm({ userId }: { userId?: string }) {
  const router = useRouter();

  const [role, setRole] = useState("");
  const [level, setLevel] = useState("junior");
  const [type, setType] = useState("technical");
  const [techstack, setTechstack] = useState("");
  const [amountMode, setAmountMode] = useState<"preset" | "custom">("preset");
  const [amount, setAmount] = useState("5");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [setupMode, setSetupMode] = useState<"manual" | "job">("manual");
  const [jdSummary, setJdSummary] = useState("");

  const selectedAmount = amountMode === "custom" ? customAmount : amount;

  const canSubmit =
    role.trim() &&
    techstack.trim() &&
    selectedAmount &&
    Number(selectedAmount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit || !userId) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          level,
          type,
          techstack,
          amount: Number(selectedAmount),
          userid: userId,
          jobDescriptionSummary: jdSummary,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data?.message || "Failed to create interview.");
      }

      router.push("/interview");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not create interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-white/6 bg-[#050607]/70 p-5 backdrop-blur"
    >
      <div className="mb-6">
        <p className="font-medium text-[#F4F1EA]">Interview details</p>
        <p className="mt-1 text-sm text-[#859599]">
          Keep it specific. Better inputs create better interview questions.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 rounded-md border border-white/6 bg-white/[0.018] p-1">
        <button
          type="button"
          onClick={() => setSetupMode("manual")}
          className={cn(
            "h-9 rounded-sm text-sm transition",
            setupMode === "manual"
              ? "bg-white/8 text-[#F4F1EA]"
              : "text-[#93a1a5] hover:text-[#F4F1EA]",
          )}
        >
          Manual setup
        </button>

        <button
          type="button"
          onClick={() => setSetupMode("job")}
          className={cn(
            "h-9 rounded-sm text-sm transition",
            setupMode === "job"
              ? "bg-(--color-accent)/15 text-[#a7ddf3]"
              : "text-[#93a1a5] hover:text-[#F4F1EA]",
          )}
        >
          Job description
        </button>
      </div>

      {setupMode === "job" ? (
        <JobDescriptionAnalyzer
          onApply={(data) => {
            setRole(data.role);
            setLevel(data.level);
            setType(data.type);
            setTechstack(data.techstack.join(", "));
            setAmountMode("preset");
            setAmount(String(data.suggestedQuestionCount));
            setJdSummary(data.summary);
            setSetupMode("manual");
          }}
        />
      ) : (
        <>
          <div className="space-y-5">
            <Field label="Target role">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="h-11 w-full rounded-sm border border-white/6 bg-white/2.5 px-3 text-sm text-[#F4F1EA] outline-none transition placeholder:text-[#798283] focus:border-(--color-accent)/40 focus:bg-white/[0.035]"
              />
            </Field>

            <div className="grid gap-4">
              <Field label="Experience level">
                <div className="grid grid-cols-2 sm:grid-cols-4 rounded-sm border border-white/6 bg-white/1.8 p-1">
                  {levels.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setLevel(item)}
                      className={cn(
                        "h-9 rounded-sm text-sm capitalize transition",
                        level === item
                          ? "bg-white/8 text-[#F4F1EA]"
                          : "text-[#93a1a5] hover:text-[#F4F1EA]",
                      )}
                    >
                      {item.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Interview type">
                <div className="grid grid-cols-3 rounded-sm border border-white/6 bg-white/[0.018] p-1">
                  {types.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setType(item)}
                      className={cn(
                        "h-9 rounded-sm text-sm capitalize transition",
                        type === item
                          ? "bg-(--color-accent)/15 text-[#a7ddf3]"
                          : "text-[#93a1a5] hover:text-[#F4F1EA]",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label="Tech stack / topics">
              <textarea
                value={techstack}
                onChange={(e) => setTechstack(e.target.value)}
                placeholder="React, Next.js, TypeScript, Node.js, PostgreSQL"
                rows={4}
                className="w-full resize-none rounded-sm border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none transition placeholder:text-[#798283] focus:border-(--color-accent)/40 focus:bg-white/[0.035]"
              />
            </Field>

            <Field label="Number of questions">
              <div className="space-y-3">
                <div className="grid grid-cols-4 rounded-sm border border-white/6 bg-white/[0.018] p-1">
                  {["5", "7", "10"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setAmountMode("preset");
                        setAmount(item);
                      }}
                      className={cn(
                        "h-9 rounded-sm text-sm transition",
                        amountMode === "preset" && amount === item
                          ? "bg-white/8 text-[#F4F1EA]"
                          : "text-[#93a1a5] hover:text-[#F4F1EA]",
                      )}
                    >
                      {item}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setAmountMode("custom");
                      setAmount("");
                    }}
                    className={cn(
                      "h-9 rounded-sm text-xs transition",
                      amountMode === "custom"
                        ? "bg-(--color-accent)/15 text-[#a7ddf3]"
                        : "text-[#93a1a5] hover:text-[#F4F1EA]",
                    )}
                  >
                    Custom
                  </button>
                </div>

                {amountMode === "custom" && (
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min={1}
                    max={20}
                    placeholder="Enter question count"
                    className="h-11 w-full rounded-sm border border-white/6 bg-white/2.5 px-3 text-sm text-[#F4F1EA] outline-none transition placeholder:text-[#798283] focus:border-(--color-accent)/40 focus:bg-white/[0.035]"
                  />
                )}

                <p className="text-xs text-[#798283]">
                  Recommended: 5-10 questions for a focused practice session.
                </p>
              </div>
            </Field>
          </div>
        </>
      )}

      <div className="mt-6 rounded-md border border-white/6 bg-white/[0.018] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#798283]">
          Output
        </p>
        <p className="mt-2 text-sm leading-6 text-[#a8b0b3]">
          A pending interview will be created and added to your interview queue.
          You can start it whenever you are ready.
        </p>
      </div>

      <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-4 text-sm font-medium text-[#03110F] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Creating
            </>
          ) : (
            <>
              <Plus size={15} />
              Create interview
              <ArrowRight size={14} />
            </>
          )}
        </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#a8b1b3]">
        {label}
      </span>
      {children}
    </label>
  );
}
