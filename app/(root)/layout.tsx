import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import DashboardShell from "@/components/DashboardShell";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();
  const userInterviews = await getInterviewsByUserId(user?.id!);

  return (
    <DashboardShell user={user} recentInterviews={userInterviews ?? []}>
      {children}
    </DashboardShell>
  );
};

export default RootLayout;