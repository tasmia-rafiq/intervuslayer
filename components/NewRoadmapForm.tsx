"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Map } from "lucide-react";
import { createInterviewRoadmap } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import JobDescriptionAnalyzer from "./JobDescriptionAnalyzer";

const levels = ["internship", "junior", "mid-level", "senior"];

export default function NewRoadmapForm({ userId }: { userId?: string }) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("junior");
  const [techstack, setTechstack] = useState("");
  const [setupMode, setSetupMode] = useState<"manual" | "job">("manual");
  const [jdSummary, setJdSummary] = useState("");

  const canSubmit = role.trim() && techstack.trim() && userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit || !userId || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await createInterviewRoadmap({
        userId,
        role,
        level,
        techstack: techstack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
        jobDescriptionSummary: jdSummary,
      });

      if (!result.success || !result.roadmapId) {
        throw new Error(result.message || "Could not create roadmap.");
      }

      router.replace(`/roadmaps/${result.roadmapId}`);
    } catch (error) {
      console.error(error);
      alert("Could not create roadmap. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md border border-white/6 bg-[#050607]/70 p-5 backdrop-blur"
    >
      <div className="mb-6">
        <p className="font-medium text-[#F4F1EA]">Roadmap details</p>
        <p className="mt-1 text-sm text-[#859599]">
          Create a structured preparation path for your target role.
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
            setTechstack(data.techstack.join(", "));
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
                placeholder="e.g. Frontend Developer"
                className="h-11 w-full rounded-sm border border-white/6 bg-white/2.5 px-3 text-sm text-[#F4F1EA] outline-none placeholder:text-[#798283] focus:border-(--color-accent)/40"
              />
            </Field>

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

            <Field label="Tech stack / focus areas">
              <textarea
                value={techstack}
                onChange={(e) => setTechstack(e.target.value)}
                placeholder="React, Next.js, TypeScript, APIs"
                rows={4}
                className="w-full resize-none rounded-sm border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none placeholder:text-[#798283] focus:border-(--color-accent)/40"
              />
            </Field>
          </div>
        </>
      )}

      <div className="mt-6 rounded-md border border-white/6 bg-white/2.5 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[#798283]">
          Output
        </p>
        <p className="mt-2 text-sm leading-6 text-[#a8b0b3]">
          A complete roadmap with modules, target skills, and interview tracks
          will be created.
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
            Creating roadmap
          </>
        ) : (
          <>
            <Map size={15} />
            Create roadmap
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
