import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
  return Response.json({ success: true, data: "Vapi generate route is working" });
}

function extractJsonArray(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);

    if (!match) {
      throw new Error(`Gemini did not return a JSON array. Output: ${text}`);
    }

    return JSON.parse(match[0]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("VAPI GENERATE BODY:", JSON.stringify(body, null, 2));

    const type = body.type;
    const role = body.role;
    const level = body.level;
    const techstack = body.techstack;
    const amount = body.amount;
    const userid = body.userid || body.userId || body.user_id;

    if (!type || !role || !level || !techstack || !amount || !userid) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
          received: body,
        },
        { status: 400 }
      );
    }

    const techstackArray = Array.isArray(techstack)
      ? techstack
      : String(techstack)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
Prepare job interview questions.

Return ONLY a valid JSON array of strings.
Do not use markdown.
Do not use code fences.
Do not add explanation before or after the array.

Interview details:
Role: ${role}
Experience level: ${level}
Tech stack: ${techstackArray.join(", ")}
Question type focus: ${type}
Number of questions: ${amount}

Example output:
["Question 1", "Question 2", "Question 3"]
      `,
    });

    console.log("GEMINI RAW QUESTIONS:", text);

    const parsedQuestions = extractJsonArray(text);

    if (!Array.isArray(parsedQuestions)) {
      throw new Error("Generated questions are not an array.");
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstackArray,
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    console.log("INTERVIEW CREATED:", docRef.id);

    return Response.json(
      {
        success: true,
        interviewId: docRef.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("VAPI GENERATE ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}