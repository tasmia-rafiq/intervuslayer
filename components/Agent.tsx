"use client";

import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import {
  Activity,
  Bot,
  CheckCircle2,
  Circle,
  Loader2,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  Sparkles,
  UserRound,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error: ", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });

    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/dashboard");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    } else {
      let formattedQuestions = "";

      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const messageCount = messages.length;

  const isCallInactiveOrFinished =
    callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  const statusLabel = useMemo(() => {
    if (callStatus === CallStatus.CONNECTING) return "Connecting";
    if (callStatus === CallStatus.ACTIVE) return "Live";
    if (callStatus === CallStatus.FINISHED) return "Finished";
    return "Ready";
  }, [callStatus]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <section className="overflow-hidden rounded-2xl border border-white/6 bg-(--color-surface-1)">
        <div className="flex items-center justify-between border-b border-white/6 px-4 py-3">
          <div>
            <p className="text-xs text-[#859599]">
              {type === "generate" ? "Voice setup" : "Interview room"}
            </p>
            <h2 className="mt-0.5 text-sm font-medium text-[#F4F1EA]">
              {type === "generate"
                ? "Answer a few setup questions"
                : "Live mock interview"}
            </h2>
          </div>

          <StatusPill status={callStatus} label={statusLabel} />
        </div>

        <div className="grid min-h-[430px] gap-3 p-3 lg:grid-cols-2">
          <ParticipantCard
            label="Assistant"
            description={
              type === "generate"
                ? "Asks for the role, level, stack, type, and question count."
                : "Guides the mock interview and asks follow-up questions."
            }
            icon={<Bot size={22} />}
            active={isSpeaking}
            state={isSpeaking ? "Speaking" : "Ready"}
          />

          <ParticipantCard
            label={userName || "Candidate"}
            description={
              type === "generate"
                ? "Respond naturally. Your answers are used to create the interview."
                : "Answer clearly and use examples from your experience."
            }
            icon={<UserRound size={22} />}
            active={callStatus === CallStatus.ACTIVE && !isSpeaking}
            state={callStatus === CallStatus.ACTIVE ? "Connected" : "Waiting"}
          />
        </div>

        <div className="border-t border-white/6 p-4">
          <TranscriptBox
            latestMessage={latestMessage}
            messageCount={messageCount}
          />

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="hidden text-xs text-[#69756F] sm:block">
              {type === "generate"
                ? "When the setup finishes, the interview will appear in your queue."
                : "Ending the session will generate feedback."}
            </p>

            {callStatus !== CallStatus.ACTIVE ? (
              <button
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-(--color-accent) px-3 text-sm font-medium text-[#03110F] transition hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleCall}
                disabled={callStatus === CallStatus.CONNECTING}
              >
                {callStatus === CallStatus.CONNECTING ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Connecting
                  </>
                ) : (
                  <>
                    <Phone size={15} />
                    {type === "generate" ? "Start voice setup" : "Start interview"}
                  </>
                )}
              </button>
            ) : (
              <button
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/8 bg-white/[0.035] px-3 text-sm font-medium text-[#F4F1EA] transition hover:bg-white/6"
                onClick={handleDisconnect}
              >
                <PhoneOff size={15} />
                End session
              </button>
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <SidePanel title="Setup checklist" icon={<CheckCircle2 size={15} />}>
          <ChecklistItem done label="Microphone ready" />
          <ChecklistItem
            done={callStatus !== CallStatus.INACTIVE}
            label="Session started"
          />
          <ChecklistItem done={messages.length > 0} label="Answers captured" />
        </SidePanel>

        <SidePanel title="What to prepare" icon={<Sparkles size={15} />}>
          <div className="space-y-3 text-sm text-[#A8B3AD]">
            <Tip number="1" text="Target role, like Frontend Engineer." />
            <Tip number="2" text="Experience level, like junior or senior." />
            <Tip number="3" text="Tech stack, like React, Node, Firebase." />
            <Tip number="4" text="Question focus: technical, behavioral, or mixed." />
          </div>
        </SidePanel>

        <SidePanel title="Session details" icon={<Activity size={15} />}>
          <div className="space-y-3 text-sm">
            <DetailRow
              label="Mode"
              value={type === "generate" ? "Generation" : "Interview"}
            />
            <DetailRow label="Status" value={statusLabel} />
            <DetailRow label="Messages" value={String(messages.length)} />
          </div>
        </SidePanel>
      </aside>
    </div>
  );
};

export default Agent;

function StatusPill({
  status,
  label,
}: {
  status: CallStatus;
  label: string;
}) {
  const isLive = status === CallStatus.ACTIVE;
  const isConnecting = status === CallStatus.CONNECTING;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs",
        isLive
          ? "border-(--color-accent)/20 bg-(--color-accent)/10 text-[#A7F3D0]"
          : isConnecting
            ? "border-white/8 bg-white/4 text-[#F4F1EA]"
            : "border-white/6 bg-white/2.5 text-[#859599]"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isLive
            ? "bg-(--color-accent)"
            : isConnecting
              ? "bg-[#F4F1EA]"
              : "bg-[#69756F]"
        )}
      />
      {label}
    </div>
  );
}

function ParticipantCard({
  label,
  description,
  icon,
  active,
  state,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  state: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[390px] flex-col justify-between rounded-xl border p-4 transition",
        active
          ? "border-(--color-accent)/25 bg-(--color-accent)/4.5"
          : "border-white/6 bg-[#050607]"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#859599]">{state}</span>

        {active ? (
          <span className="flex items-center gap-1.5 text-xs text-[#a7e4f3]">
            <Radio size={13} />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-[#69756F]">
            <Circle size={13} />
            Idle
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div
          className={cn(
            "relative flex size-20 items-center justify-center rounded-2xl border",
            active
              ? "border-(--color-accent)/25 bg-(--color-accent)/10 text-[#A7F3D0]"
              : "border-white/8 bg-white/2.5 text-[#A8B3AD]"
          )}
        >
          {icon}

          {active && (
            <span className="absolute inset-0 rounded-2xl border border-(--color-accent)/30 animate-ping" />
          )}
        </div>

        <h3 className="mt-5 text-base font-semibold">{label}</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-[#859599]">
          {description}
        </p>

        {active && (
          <div className="mt-10 flex h-8 items-end gap-1">
            {[14, 30, 18, 42, 26, 54, 22, 38, 16].map((height, index) => (
              <span
                key={index}
                style={{ height }}
                className="w-1 rounded-full bg-(--color-accent)/70"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/6 pt-4">
        <span className="flex items-center gap-2 text-xs text-[#69756F]">
          {active ? <Mic size={14} /> : <MicOff size={14} />}
          {active ? "Audio active" : "Audio standby"}
        </span>

        <Volume2 size={14} className="text-[#69756F]" />
      </div>
    </div>
  );
}

function TranscriptBox({
  latestMessage,
  messageCount,
}: {
  latestMessage?: string;
  messageCount: number;
}) {
  return latestMessage ? (
    <div className="rounded-xl border border-white/6 bg-[#050607] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-[#859599]">Latest transcript</span>
        <span className="text-xs text-[#69756F]">
          {messageCount} messages
        </span>
      </div>

      <p
        key={latestMessage}
        className="animate-fadeIn text-sm leading-6 text-[#A8B3AD]"
      >
        {latestMessage}
      </p>
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-white/8 bg-white/1.5 p-4 text-sm leading-6 text-[#859599]">
      Transcript will appear here once the conversation starts.
    </div>
  );
}

function SidePanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/6 bg-(--color-surface-1)">
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
        <span className="text-[#859599]">{icon}</span>
        <h3 className="text-sm font-medium">{title}</h3>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 py-2 last:border-b-0">
      <span className="text-sm text-[#A8B3AD]">{label}</span>
      <span
        className={cn(
          "size-2 rounded-full",
          done ? "bg-(--color-accent)" : "bg-[#3A4240]"
        )}
      />
    </div>
  );
}

function Tip({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/6 bg-white/2.5 text-xs text-[#A7F3D0]">
        {number}
      </span>
      <span className="leading-6">{text}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/6 pb-2 last:border-b-0 last:pb-0">
      <span className="text-[#859599]">{label}</span>
      <span className="font-medium text-[#F4F1EA]">{value}</span>
    </div>
  );
}