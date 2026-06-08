import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewGenerationPage = async () => {
  const user = await getCurrentUser();

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between border-b border-white/6 pb-4">
        <div>
          <p className="text-sm text-[#859599]">Interviews</p>
          <h1 className="mt-1 text-xl font-semibold tracking-[-0.025em]">
            Interview Generation
          </h1>
        </div>

        <div className="rounded-md border border-white/6 bg-white/2.5 px-2.5 py-1 text-xs text-[#859599]">
          Voice setup
        </div>
      </div>

      <Agent userName={user?.name} userId={user?.id} type="generate" />
    </section>
  );
};

export default InterviewGenerationPage;