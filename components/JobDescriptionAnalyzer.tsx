"use client";

import { useState } from "react";
import { ClipboardEdit, Loader2, Sparkles } from "lucide-react";
import { parseJobDescription } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";

type ParsedJobDescription = {
  role: string;
  level: string;
  type: string;
  techstack: string[];
  suggestedQuestionCount: number;
  summary: string;
  focusAreas: string[];
};

const levels = ["internship", "junior", "mid-level", "senior"];
const types = ["technical", "behavioral", "mixed"];

export default function JobDescriptionAnalyzer({
  onApply,
}: {
  onApply: (data: ParsedJobDescription) => void;
}) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsed, setParsed] = useState<ParsedJobDescription | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      const result = await parseJobDescription({ jobDescription });

      if (!result.success || !result.data) {
        throw new Error(result.message || "Could not analyze job description.");
      }

      setParsed(result.data);
    } catch (error) {
      console.error(error);
      alert("Could not analyze job description. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateParsed = <K extends keyof ParsedJobDescription>(
    key: K,
    value: ParsedJobDescription[K]
  ) => {
    setParsed((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  return (
    <div className="rounded-md border border-white/6 bg-[#050607]/70 p-5">
      <div className="mb-5">
        <div className="flex items-center gap-2 font-medium text-[#F4F1EA]">
          <ClipboardEdit size={16} className="text-[#a7e1f3]" />
          Paste job description
        </div>

        <p className="mt-1 text-sm leading-5 text-[#99a7aa]">
          Paste a job post and IntervU Slayer will extract the role, level,
          stack, and practice focus.
        </p>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={9}
        placeholder="Paste the job description here..."
        className="w-full resize-none rounded-md border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none placeholder:text-[#7b8586] focus:border-(--color-accent)/40"
      />

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!jobDescription.trim() || isAnalyzing}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-(--color-accent) px-4 text-sm font-medium text-[#030f11] transition hover:bg-(--color-accent)/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Analyzing
          </>
        ) : (
          <>
            <Sparkles size={15} />
            Analyze job description
          </>
        )}
      </button>

      {parsed && (
        <div className="mt-5 rounded-md border border-white/6 bg-white/[0.018] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#69756F]">
                Extracted setup
              </p>

              <p className="mt-1 text-sm text-[#99a7aa]">
                Review and edit the setup before applying it.
              </p>
            </div>

            <span className="rounded-md border border-(--color-accent)/20 bg-(--color-accent)/10 px-2 py-1 text-xs text-[#a7e1f3]">
              Editable
            </span>
          </div>

          <div className="mt-5 space-y-5">
            <Field label="Role">
              <input
                value={parsed.role}
                onChange={(e) => updateParsed("role", e.target.value)}
                className="h-10 w-full rounded-md border border-white/6 bg-white/2.5 px-3 text-sm text-[#F4F1EA] outline-none placeholder:text-[#69756F] focus:border-(--color-accent)/40"
              />
            </Field>

            <Field label="Experience level">
              <SegmentedControl
                options={levels}
                value={parsed.level}
                onChange={(value) => updateParsed("level", value)}
              />
            </Field>

            <Field label="Interview type">
              <SegmentedControl
                options={types}
                value={parsed.type}
                onChange={(value) => updateParsed("type", value)}
              />
            </Field>

            <Field label="Question count">
              <input
                value={parsed.suggestedQuestionCount}
                onChange={(e) =>
                  updateParsed(
                    "suggestedQuestionCount",
                    Number(e.target.value)
                  )
                }
                type="number"
                min={1}
                max={20}
                className="h-10 w-full rounded-md border border-white/6 bg-white/2.5 px-3 text-sm text-[#F4F1EA] outline-none placeholder:text-[#69756F] focus:border-(--color-accent)/40"
              />
            </Field>

            <Field label="Tech stack">
              <textarea
                value={parsed.techstack.join(", ")}
                onChange={(e) =>
                  updateParsed(
                    "techstack",
                    e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                rows={3}
                className="w-full resize-none rounded-md border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none placeholder:text-[#69756F] focus:border-(--color-accent)/40"
              />
            </Field>

            <Field label="Focus areas">
              <textarea
                value={parsed.focusAreas.join(", ")}
                onChange={(e) =>
                  updateParsed(
                    "focusAreas",
                    e.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
                rows={3}
                className="w-full resize-none rounded-md border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none placeholder:text-[#69756F] focus:border-(--color-accent)/40"
              />
            </Field>

            <Field label="Summary">
              <textarea
                value={parsed.summary}
                onChange={(e) => updateParsed("summary", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-white/6 bg-white/2.5 px-3 py-3 text-sm leading-6 text-[#F4F1EA] outline-none placeholder:text-[#69756F] focus:border-(--color-accent)/40"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={() => onApply(parsed)}
            className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/6 bg-white/[0.035] text-sm font-medium text-[#F4F1EA] transition hover:bg-white/6"
          >
            Use edited setup
          </button>
        </div>
      )}
    </div>
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

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-md border border-white/6 bg-white/[0.018] p-1 sm:grid-cols-4">
      {options.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "h-9 rounded-sm text-sm capitalize transition",
            value === item
              ? "bg-white/8 text-[#F4F1EA]"
              : "text-[#93a1a5] hover:text-[#F4F1EA]"
          )}
        >
          {item.replace("-", " ")}
        </button>
      ))}
    </div>
  );
}