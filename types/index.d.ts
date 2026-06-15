interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  skillScores?: Array<{
    name: string;
    score: number;
    reason: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  roadmapId?: string;
  moduleId?: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  level: string;
  createdAt?: string;
  roadmapId?: string;
  moduleId?: string;
  feedback?: Feedback | null;
}

interface AgentProps {
  userName: string | undefined;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface UserAndInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface RoadmapModule {
  id: string;
  title: string;
  description: string;
  targetSkills: string[];
  interviewCount: number;
  completedCount: number;
  status: "locked" | "available" | "completed";
}

interface Roadmap {
  id: string;
  userId: string;
  role: string;
  level: string;
  techstack: string[];
  title: string;
  description: string;
  modules: RoadmapModule[];
  progress: number;
  createdAt: string;
}

interface CreateRoadmapParams {
  userId: string;
  role: string;
  level: string;
  techstack: string[];
  jobDescriptionSummary?: string;
}