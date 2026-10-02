import { NextResponse } from "next/server";
import { consumeDailyQuota } from "@/lib/dailyUsage";

export async function POST(req) {
  try {
    // ============================================
    // 1. READ REQUEST
    // ============================================
    const body = await req.json();

    const message = String(body?.message || "").trim();
    const userName = String(body?.userName || "User").trim();
    const email = String(body?.email || "").trim();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          code: "MESSAGE_REQUIRED",
          error: "Message is required.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          code: "AUTH_REQUIRED",
          error: "Please login to use AI Coach.",
        },
        { status: 401 }
      );
    }

    // ============================================
    // 2. CHECK DAILY AI CHAT QUOTA
    // ============================================
    let quota;

    try {
      quota = await consumeDailyQuota(email, "aiChat");
    } catch (quotaError) {
      console.error("AI quota error:", quotaError);

      return NextResponse.json(
        {
          success: false,
          code: "QUOTA_ERROR",
          error:
            quotaError?.message ||
            "Unable to check your AI Coach usage.",
        },
        { status: 500 }
      );
    }

    // ============================================
    // 3. DAILY LIMIT REACHED
    // ============================================
    if (!quota?.allowed) {
      if (quota?.reason === "DAILY_LIMIT_REACHED") {
        return NextResponse.json(
          {
            success: false,
            code: "DAILY_LIMIT_REACHED",
            error: `Daily AI Coach limit reached. Used ${quota.used}/${quota.limit}. Remaining: 0.`,
            plan: quota.plan,
            feature: "aiChat",
            used: quota.used,
            limit: quota.limit,
            remaining: 0,
            date: quota.date,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: quota?.reason || "QUOTA_NOT_ALLOWED",
          error: "You are not allowed to use AI Coach right now.",
        },
        { status: 401 }
      );
    }

    // ============================================
    // 4. GEMINI API KEY
    // ============================================
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing.");

      return NextResponse.json(
        {
          success: false,
          code: "GEMINI_KEY_MISSING",
          error:
            "GEMINI_API_KEY is missing in .env.local.",
        },
        { status: 500 }
      );
    }

    // ============================================
    // 5. GEMINI PROMPT
    // ============================================
    const prompt = `
You are Brad, a personal AI fitness and diet coach inside FullyWorkout.

User name: ${userName}

Your job:
- Give useful fitness advice.
- Give nutrition and diet guidance.
- Help with workouts.
- Help with recovery and healthy habits.
- Keep answers concise and practical.
- Use simple language.
- Do not add unnecessary fluff.
- Do not claim to diagnose medical conditions.
- If a question is outside fitness, nutrition, workouts, recovery or healthy habits, politely say that you are focused on those areas.

User's question:
${message}
`;

    // ============================================
    // 6. CALL GEMINI
    // ============================================
    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    // ============================================
    // 7. READ GEMINI RESPONSE
    // ============================================
    let geminiData;

    try {
      geminiData = await geminiRes.json();
    } catch (jsonError) {
      console.error("Gemini JSON parse error:", jsonError);

      return NextResponse.json(
        {
          success: false,
          code: "GEMINI_INVALID_RESPONSE",
          error: "Gemini returned an invalid response.",
        },
        { status: 502 }
      );
    }

    // ============================================
    // 8. GEMINI ERROR
    // ============================================
    if (!geminiRes.ok) {
      console.error(
        "Gemini API Error:",
        geminiRes.status,
        geminiData
      );

      return NextResponse.json(
        {
          success: false,
          code: "GEMINI_API_ERROR",
          error:
            geminiData?.error?.message ||
            `Gemini API error (${geminiRes.status}).`,
        },
        { status: 502 }
      );
    }

    // ============================================
    // 9. EXTRACT AI TEXT
    // ============================================
    const reply = geminiData?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error(
        "Gemini returned no text:",
        JSON.stringify(geminiData, null, 2)
      );

      return NextResponse.json(
        {
          success: false,
          code: "EMPTY_AI_RESPONSE",
          error:
            "Gemini returned an empty response. Please try again.",
        },
        { status: 502 }
      );
    }

    // ============================================
    // 10. SUCCESS RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,

      reply,

      plan: quota.plan,

      usage: {
        feature: "aiChat",
        used: quota.used,
        limit: quota.limit,
        remaining: quota.remaining,
        date: quota.date,
      },

      remainingChats: quota.remaining,
    });
  } catch (error) {
    // ============================================
    // 11. FINAL SERVER ERROR
    // ============================================
    console.error("AI Coach Server Error:", error);

    return NextResponse.json(
      {
        success: false,
        code: "AI_COACH_SERVER_ERROR",
        error:
          error?.message ||
          "AI Coach server error. Please try again.",
      },
      { status: 500 }
    );
  }
}