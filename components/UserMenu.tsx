"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/firebase/client";

export default function UserMenu({
  user,
}: {
  user?: {
    name?: string;
    email?: string;
  } | null;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = async () => {
    await firebaseSignOut(auth);
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-11 left-2 right-2 overflow-hidden rounded-md border border-white/8 bg-(--color-bg) shadow-2xl">
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#A8B3AD] transition hover:bg-white/4.5 hover:text-[#F4F1EA]">
            <User size={15} />
            Profile
          </button>

          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[#A8B3AD] transition hover:bg-white/4.5 hover:text-[#F4F1EA]">
            <Settings size={15} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-white/6 px-3 py-2 text-sm text-[#A8B3AD] transition hover:bg-white/4.5 hover:text-[#F4F1EA]"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full items-center gap-2 rounded-sm px-2 text-left transition hover:bg-white/4.5"
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-white/6 text-[11px] font-semibold text-[#A7F3D0]">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[#F4F1EA]">
            {user?.name || "User"}
          </p>
          <p className="truncate text-[11px] text-[#69756F]">
            {user?.email || "Signed in"}
          </p>
        </div>
      </button>
    </div>
  );
}
