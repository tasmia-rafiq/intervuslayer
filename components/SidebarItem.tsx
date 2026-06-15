"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LucideIcon,
  Mic,
  Settings,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  roadmap: Map,
  interviews: Mic,
  reports: FileText,
  progress: BarChart3,
  billing: CreditCard,
  settings: Settings,
};

interface SidebarItemProps {
  label: string;
  href: string;
  icon: keyof typeof icons;
}

export default function SidebarItem({ label, href, icon }: SidebarItemProps) {
  const pathname = usePathname();
  const Icon = icons[icon];

  const isActive =
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex h-8 items-center gap-3 rounded-sm px-3 text-sm transition",
        isActive
          ? "bg-white/6 text-[#F4F1EA]"
          : "text-[#b6bcbe] hover:bg-white/4.5 hover:text-[#F4F1EA]"
      )}
    >
      <Icon size={15} />
      <span>{label}</span>
    </Link>
  );
}