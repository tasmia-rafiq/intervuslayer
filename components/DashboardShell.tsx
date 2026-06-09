import Image from "next/image";
import Link from "next/link";
import {
  History,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import UserMenu from "@/components/UserMenu";
import SidebarItem from "./SidebarItem";

const workspaceItems = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Interviews", href: "/interview", icon: "interviews" },
  { label: "Reports", href: "/dashboard#reports", icon: "reports" },
  { label: "Progress", href: "/dashboard#progress", icon: "progress" },
];

const manageItems = [
  { label: "Billing", href: "/billing", icon: "billing" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

export default function DashboardShell({
  children,
  user,
  recentInterviews = [],
}: {
  children: React.ReactNode;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
  recentInterviews?: InterviewCardProps[];
}) {
  const visibleRecent = recentInterviews.slice(0, 4);
  const hasMoreRecent = recentInterviews.length > 4;

  return (
    <main className="min-h-screen bg-[#050607] text-[#F4F1EA]">
      <aside className="fixed left-0 top-0 hidden h-screen w-[260px] bg-[#050607] lg:flex lg:flex-col">
        <div className="flex h-14 items-center justify-between px-3">
          <Link
            href="/dashboard"
            className="flex min-w-0 items-center gap-2 px-2 py-1.5"
          >
            <Image src="/logo.svg" alt="Logo" width={28} height={24} />
            <span className="truncate text-sm font-semibold">
              IntervU Slayer
            </span>
          </Link>

          <Link
            href="/interview/new"
            title="Create new interview"
            className="flex size-8 items-center justify-center rounded-sm text-[#b0b7bb] transition hover:bg-white/5.5 hover:text-[#F4F1EA]"
          >
            <Plus size={16} />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          <SidebarSection title="Workspace">
            {workspaceItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </SidebarSection>

          <SidebarSection title="History">
            {visibleRecent.length > 0 ? (
              <>
                {visibleRecent.map((interview) => (
                  <RecentInterviewItem
                    key={interview.id}
                    interview={interview}
                  />
                ))}

                {hasMoreRecent && (
                  <Link
                    href="/dashboard#history"
                    className="mt-1 flex h-8 items-center gap-3 rounded-sm px-3 text-sm text-[#b6bcbe] transition hover:bg-white/4.5 hover:text-[#F4F1EA]"
                  >
                    <MoreHorizontal size={15} />
                    More
                  </Link>
                )}
              </>
            ) : (
              <div className="rounded-sm px-3 py-2 text-sm leading-5 text-[#7d878a]">
                No recent interviews yet.
              </div>
            )}
          </SidebarSection>

          <SidebarSection title="Manage">
            {manageItems.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </SidebarSection>
        </div>

        <div className="border-t border-white/6 p-2">
          <UserMenu user={user} />
        </div>
      </aside>

      <section className="min-h-screen bg-[#050607] lg:pl-[260px]">
        <div className="py-3 pr-3 ">
          <div className="min-h-screen bg-(--color-bg) border border-white/6 rounded-2xl px-5 py-4">{children}</div>
        </div>
      </section>
    </main>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#7f8688]">
        {title}
      </p>

      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function RecentInterviewItem({
  interview,
}: {
  interview: InterviewCardProps;
}) {
  return (
    <Link
      href={`/interview/${interview.id}`}
      className="group flex h-8 min-w-0 items-center gap-3 rounded-sm px-3 text-sm text-[#b6bcbe] transition hover:bg-white/4.5 hover:text-[#F4F1EA]"
    >
      <History size={14} className="shrink-0" />

      <span className="truncate capitalize">
        {interview.role} Interview
      </span>
    </Link>
  );
}