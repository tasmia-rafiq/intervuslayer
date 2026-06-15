"use server";

import Groq from "groq-sdk";

import { db } from "@/firebase/admin";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`,
      )
      .join("");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
            You are a professional interviewer analyzing a mock interview.

            Return ONLY valid JSON.
            No markdown.
            No explanation.
            No code fences.

            The JSON must match this exact shape:
            {
              "totalScore": 0,
              "categoryScores": [
                {
                  "name": "Communication Skills",
                  "score": 0,
                  "comment": ""
                },
                {
                  "name": "Technical Knowledge",
                  "score": 0,
                  "comment": ""
                },
                {
                  "name": "Problem-Solving",
                  "score": 0,
                  "comment": ""
                },
                {
                  "name": "Cultural & Role Fit",
                  "score": 0,
                  "comment": ""
                },
                {
                  "name": "Confidence & Clarity",
                  "score": 0,
                  "comment": ""
                }
              ],
              "skillScores": [
                {
                  "name": "",
                  "score": 0,
                  "reason": ""
                }
              ],
              "strengths": [],
              "areasForImprovement": [],
              "finalAssessment": ""
            }
          `,
        },
        {
          role: "user",
          content: `
            Evaluate the candidate based on this transcript.

            Be honest and specific. Do not be overly lenient.

            Transcript:
            ${formattedTranscript}

            Scoring rules:
            - totalScore must be from 0 to 100.
            - each category score must be from 0 to 100.
            - skillScores must include 5 to 8 specific skills from the interview.
            - include both technical and communication-related skills.
            - skill names should be short, for example: React, Next.js, JavaScript, APIs, Communication, Problem Solving, System Design, Behavioral.
            - each skill score must be from 0 to 100.
            - each skill reason should be concise.
            - strengths must be an array of strings.
            - areasForImprovement must be an array of strings.
            - finalAssessment must be a concise paragraph.
          `,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("Groq returned an empty feedback response.");
    }

    const object = JSON.parse(raw);

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      skillScores: object.skillScores ?? [],
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    await updateRoadmapProgressAfterFeedback({
      interviewId,
      userId,
    });

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: UserAndInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  if (!interview.exists) return null;

  return interview.data() as Interview | null;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function deleteInterviewById({
  interviewId,
  userId,
}: UserAndInterviewIdParams) {
  try {
    if (!interviewId || !userId) {
      return {
        success: false,
        message: "Missing interview or user information.",
      };
    }

    const interviewRef = db.collection("interviews").doc(interviewId);
    const interviewSnap = await interviewRef.get();

    if (!interviewSnap.exists) {
      return {
        success: false,
        message: "Interview not found.",
      };
    }

    const interview = interviewSnap.data() as Interview;

    if (interview.userId !== userId) {
      return {
        success: false,
        message: "You are not allowed to delete this interview.",
      };
    }

    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .get();

    const batch = db.batch();

    feedbackSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(interviewRef);

    await batch.commit();

    return {
      success: true,
      message: "Interview deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting interview:", error);

    return {
      success: false,
      message: "Could not delete interview. Please try again.",
    };
  }
}

export async function createInterviewRoadmap({
  userId,
  role,
  level,
  techstack,
  jobDescriptionSummary,
}: CreateRoadmapParams) {
  try {
    if (!userId || !role || !level || techstack.length === 0) {
      return {
        success: false,
        message: "Missing roadmap information.",
      };
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
            Return only valid JSON. No markdown.

            Create a structured interview preparation roadmap.

            The JSON must match this exact shape:
            {
              "title": "",
              "description": "",
              "modules": [
                {
                  "title": "",
                  "description": "",
                  "targetSkills": [],
                  "interviewCount": 5
                }
              ]
            }

            Rules:
            - Create 7 to 10 modules.
            - Each module should be practical for interview preparation.
            - Modules should progress from fundamentals to advanced topics.
            - Include behavioral/interview communication as a module.
            - Keep titles short and professional.
            - targetSkills must be an array of strings.
            - interviewCount should usually be 5.
          `,
        },
        {
          role: "user",
          content: `
            Create an interview roadmap for:

            Role: ${role}
            Level: ${level}
            Tech stack: ${techstack.join(", ")}
            ${
              jobDescriptionSummary
                ? `Job description summary: ${jobDescriptionSummary}`
                : ""
            }
          `,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("Groq returned an empty roadmap response.");
    }

    const parsed = JSON.parse(raw);

    const modules: RoadmapModule[] = parsed.modules.map(
      (module: any, index: number) => ({
        id: crypto.randomUUID(),
        title: module.title,
        description: module.description,
        targetSkills: module.targetSkills ?? [],
        interviewCount: module.interviewCount ?? 5,
        completedCount: 0,
        status: index === 0 ? "available" : "locked",
      }),
    );

    const roadmap = {
      userId,
      role,
      level,
      techstack,
      title: parsed.title,
      description: parsed.description,
      modules,
      progress: 0,
      jobDescriptionSummary: jobDescriptionSummary || null,
      createdAt: new Date().toISOString(),
    };

    const roadmapRef = await db.collection("roadmaps").add(roadmap);

    return {
      success: true,
      roadmapId: roadmapRef.id,
    };
  } catch (error) {
    console.error("Error creating roadmap:", error);

    return {
      success: false,
      message: "Could not create roadmap.",
    };
  }
}

export async function getRoadmapsByUserId(
  userId: string,
): Promise<Roadmap[] | null> {
  const roadmaps = await db
    .collection("roadmaps")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return roadmaps.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Roadmap[];
}

export async function getRoadmapById(id: string): Promise<Roadmap | null> {
  const roadmap = await db.collection("roadmaps").doc(id).get();

  if (!roadmap.exists) return null;

  return {
    id: roadmap.id,
    ...roadmap.data(),
  } as Roadmap;
}

export async function getInterviewsByRoadmapModule({
  userId,
  roadmapId,
  moduleId,
}: {
  userId: string;
  roadmapId: string;
  moduleId: string;
}): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .where("roadmapId", "==", roadmapId)
    .where("moduleId", "==", moduleId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

async function getModuleInterviewIds({
  userId,
  roadmapId,
  moduleId,
}: {
  userId: string;
  roadmapId: string;
  moduleId: string;
}) {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .where("roadmapId", "==", roadmapId)
    .where("moduleId", "==", moduleId)
    .get();

  return interviews.docs.map((doc) => doc.id);
}

export async function updateRoadmapProgressAfterFeedback({
  interviewId,
  userId,
}: {
  interviewId: string;
  userId: string;
}) {
  try {
    const interviewSnap = await db
      .collection("interviews")
      .doc(interviewId)
      .get();

    if (!interviewSnap.exists) return;

    const interview = {
      id: interviewSnap.id,
      ...interviewSnap.data(),
    } as Interview;

    if (
      interview.userId !== userId ||
      !interview.roadmapId ||
      !interview.moduleId
    ) {
      return;
    }

    const roadmapRef = db.collection("roadmaps").doc(interview.roadmapId);
    const roadmapSnap = await roadmapRef.get();

    if (!roadmapSnap.exists) return;

    const roadmap = {
      id: roadmapSnap.id,
      ...roadmapSnap.data(),
    } as Roadmap;

    if (roadmap.userId !== userId) return;

    const modules = [...roadmap.modules];

    const moduleIndex = modules.findIndex(
      (module) => module.id === interview.moduleId,
    );

    if (moduleIndex === -1) return;

    const moduleInterviewIds = await getModuleInterviewIds({
      userId,
      roadmapId: interview.roadmapId,
      moduleId: interview.moduleId,
    });

    let completedCount = 0;

    if (moduleInterviewIds.length > 0) {
      const completedFeedbackSnap = await db
        .collection("feedback")
        .where("userId", "==", userId)
        .where("interviewId", "in", moduleInterviewIds.slice(0, 30))
        .get();

      completedCount = completedFeedbackSnap.docs.length;
    }
    const currentModule = modules[moduleIndex];

    modules[moduleIndex] = {
      ...currentModule,
      completedCount,
      status:
        completedCount >= currentModule.interviewCount
          ? "completed"
          : "available",
    };

    const nextModule = modules[moduleIndex + 1];

    if (nextModule && completedCount >= 1 && nextModule.status === "locked") {
      modules[moduleIndex + 1] = {
        ...nextModule,
        status: "available",
      };
    }

    const totalTargetRounds = modules.reduce(
      (sum, module) => sum + module.interviewCount,
      0,
    );

    const totalCompletedRounds = modules.reduce(
      (sum, module) => sum + module.completedCount,
      0,
    );

    const progress =
      totalTargetRounds > 0
        ? Math.min(
            Math.round((totalCompletedRounds / totalTargetRounds) * 100),
            100,
          )
        : 0;

    await roadmapRef.update({
      modules,
      progress,
    });
  } catch (error) {
    console.error("Error updating roadmap progress:", error);
  }
}

export async function createRoadmapModuleInterview({
  userId,
  roadmapId,
  moduleId,
}: {
  userId: string;
  roadmapId: string;
  moduleId: string;
}) {
  try {
    const roadmap = await getRoadmapById(roadmapId);

    if (!roadmap || roadmap.userId !== userId) {
      return {
        success: false,
        message: "Roadmap not found.",
      };
    }

    const module = roadmap.modules.find((item) => item.id === moduleId);

    if (!module) {
      return { success: false, message: "Module not found." };
    }

    if (module.status === "locked") {
      return { success: false, message: "This module is locked." };
    }

    const existingInterviews = await getInterviewsByRoadmapModule({
      userId,
      roadmapId,
      moduleId,
    });

    if ((existingInterviews?.length ?? 0) >= module.interviewCount) {
      return {
        success: false,
        message: "This module already has all practice rounds created.",
      };
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
            Return only valid JSON. No markdown.

            Create interview questions for a roadmap module.

            JSON shape:
            {
              "questions": ["", "", "", "", ""]
            }

            Rules:
            - Return exactly 5 questions.
            - Questions should match the module topic.
            - Questions should match the user's role and level.
            - Include practical follow-up style questions.
            - Do not use markdown, slashes, bullets, or special formatting.
          `,
        },
        {
          role: "user",
          content: `
            Role: ${roadmap.role}
            Level: ${roadmap.level}
            Tech stack: ${roadmap.techstack.join(", ")}

            Module title: ${module.title}
            Module description: ${module.description}
            Target skills: ${module.targetSkills.join(", ")}
          `,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("Groq returned empty module interview response.");
    }

    const parsed = JSON.parse(raw);

    const interview = {
      userId,
      roadmapId,
      moduleId,
      role: `${roadmap.role} - ${module.title}`,
      level: roadmap.level,
      type: "technical",
      techstack: module.targetSkills?.length
        ? module.targetSkills
        : roadmap.techstack,
      questions: parsed.questions,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    const interviewRef = await db.collection("interviews").add(interview);

    return {
      success: true,
      interviewId: interviewRef.id,
    };
  } catch (error) {
    console.error("Error creating module interview:", error);

    return {
      success: false,
      message: "Could not create module interview.",
    };
  }
}

export async function getSkillGraphByUserId(userId: string) {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .get();

    const feedbacks = feedbackSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Feedback[];

    const skillMap = new Map<
      string,
      {
        name: string;
        scores: number[];
        reasons: string[];
        reportCount: number;
      }
    >();

    feedbacks.forEach((feedback) => {
      const skills =
        feedback.skillScores && feedback.skillScores.length > 0
          ? feedback.skillScores
          : feedback.categoryScores?.map((category) => ({
              name: category.name,
              score: category.score,
              reason: category.comment,
            })) ?? [];

      skills.forEach((skill) => {
        const normalizedName = normalizeSkillName(skill.name);

        const existing = skillMap.get(normalizedName) ?? {
          name: normalizedName,
          scores: [],
          reasons: [],
          reportCount: 0,
        };

        existing.scores.push(Number(skill.score) || 0);

        if (skill.reason) {
          existing.reasons.push(skill.reason);
        }

        existing.reportCount += 1;

        skillMap.set(normalizedName, existing);
      });
    });

    const skills = Array.from(skillMap.values())
      .map((skill) => {
        const averageScore =
          skill.scores.length > 0
            ? Math.round(
                skill.scores.reduce((sum, score) => sum + score, 0) /
                  skill.scores.length
              )
            : 0;

        const latestScore = skill.scores[skill.scores.length - 1] ?? 0;
        const previousScore = skill.scores[skill.scores.length - 2] ?? null;

        return {
          name: skill.name,
          averageScore,
          latestScore,
          previousScore,
          delta:
            previousScore === null
              ? null
              : Math.round(latestScore - previousScore),
          reportCount: skill.reportCount,
          latestReason: skill.reasons[skill.reasons.length - 1] ?? "",
        };
      })
      .sort((a, b) => a.averageScore - b.averageScore);

    const weakestSkill = skills[0] ?? null;
    const strongestSkill = [...skills].sort(
      (a, b) => b.averageScore - a.averageScore
    )[0] ?? null;

    return {
      skills,
      weakestSkill,
      strongestSkill,
      totalReports: feedbacks.length,
    };
  } catch (error) {
    console.error("Error creating skill graph:", error);

    return {
      skills: [],
      weakestSkill: null,
      strongestSkill: null,
      totalReports: 0,
    };
  }
}

function normalizeSkillName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^js$/i, "JavaScript")
    .replace(/^react\.js$/i, "React")
    .replace(/^next\.js$/i, "Next.js")
    .replace(/^node\.js$/i, "Node.js");
}

export async function parseJobDescription({
  jobDescription,
}: {
  jobDescription: string;
}) {
  try {
    if (!jobDescription.trim()) {
      return {
        success: false,
        message: "Job description is required.",
      };
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
            Return only valid JSON. No markdown.

            Extract interview setup information from a job description.

            JSON shape:
            {
              "role": "",
              "level": "",
              "type": "",
              "techstack": [],
              "suggestedQuestionCount": 5,
              "summary": "",
              "focusAreas": []
            }

            Rules:
            - level must be one of: internship, junior, mid-level, senior.
            - type must be one of: technical, behavioral, mixed.
            - techstack must be an array of strings.
            - suggestedQuestionCount should be 5, 7, or 10.
            - focusAreas should include important topics from the job description.
            - If level is unclear, infer from responsibilities.
            - If type is unclear, use mixed.
          `,
        },
        {
          role: "user",
          content: jobDescription,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error("Groq returned an empty JD parse response.");
    }

    const parsed = JSON.parse(raw);

    return {
      success: true,
      data: {
        role: parsed.role || "",
        level: parsed.level || "junior",
        type: parsed.type || "mixed",
        techstack: parsed.techstack || [],
        suggestedQuestionCount: parsed.suggestedQuestionCount || 5,
        summary: parsed.summary || "",
        focusAreas: parsed.focusAreas || [],
      },
    };
  } catch (error) {
    console.error("Error parsing job description:", error);

    return {
      success: false,
      message: "Could not analyze job description.",
    };
  }
}