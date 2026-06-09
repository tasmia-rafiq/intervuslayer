"use server";

import Groq from "groq-sdk";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
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
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
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

  return interview.data() as Interview | null;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
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
  userId: string
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