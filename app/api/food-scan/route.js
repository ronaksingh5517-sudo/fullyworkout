import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  consumeDailyQuota,
  getDailyUsage,
} from "@/lib/dailyUsage";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please login.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const email = session.user.email;

    const usage = await getDailyUsage(email);

    return NextResponse.json({
      success: true,
      usage: {
        feature: "foodScan",
        plan: usage.plan,
        used: usage.usage.foodScans,
        limit: usage.limits.foodScans,
        remaining: usage.remaining.foodScans,
        date: usage.date,
      },
    });
  } catch (error) {
    console.error("Food Scan Usage Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load Food Scan usage.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please login to use Food Scanner.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // --------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------

    const body = await req.json();

    const imageBase64 = body.imageBase64 || body.image;

    if (!imageBase64) {
      return NextResponse.json(
        {
          success: false,
          error: "No image provided.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // GEMINI API KEY
    // --------------------------------------------------

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing API Key in .env.local",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // MIME TYPE
    // --------------------------------------------------

    let mimeType = "image/jpeg";

    const mimeMatch = imageBase64.match(
      /^data:(image\/[a-zA-Z+]+);base64,/
    );

    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }

    const base64Data = imageBase64.replace(
      /^data:image\/[a-zA-Z+]+;base64,/,
      ""
    );

    // --------------------------------------------------
    // GEMINI PROMPT
    // --------------------------------------------------

    const prompt = `
You are a strict food and nutrition scanner AI.

Analyze this image carefully.

STEP 1:
Check if the image contains edible food, dishes, snacks, or drinks.

If the image contains clothes, human body parts, shoes, rooms, laptops,
or ANY non-food items, return ONLY this JSON:

{
  "isFood": false,
  "errorMessage": "Only scan a food item! Please upload a valid meal or snack."
}

STEP 2:
If it IS food, break down EVERY individual item visible on the plate/bowl
with its estimated macros.

Return ONLY valid JSON in this exact structure.
No markdown.
No backticks.

{
  "isFood": true,
  "dishName": "Overall Meal Name",
  "items": [
    {
      "name": "Item Name",
      "protein": "4g",
      "carbs": "5g",
      "fat": "3g",
      "calories": 60
    }
  ],
  "totalCalories": 450,
  "totalProtein": "15g",
  "totalCarbs": "60g",
  "totalFats": "12g",
  "coachTip": "A helpful nutrition tip for this meal."
}
`;

    // --------------------------------------------------
    // GEMINI PAYLOAD
    // --------------------------------------------------

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    // --------------------------------------------------
    // GEMINI REQUEST
    // --------------------------------------------------

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },

        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // --------------------------------------------------
    // GEMINI ERROR
    // --------------------------------------------------

    if (
      !response.ok ||
      !data?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      const errMessage =
        data?.error?.message ||
        "Could not analyze image.";

      console.error("Gemini API Error:", data);

      return NextResponse.json(
        {
          success: false,
          error: errMessage,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // PARSE GEMINI RESPONSE
    // --------------------------------------------------

    const rawText =
      data.candidates[0].content.parts[0].text;

    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let resultJson;

    try {
      resultJson = JSON.parse(cleaned);
    } catch (parseError) {
      console.error(
        "Gemini JSON Parse Error:",
        parseError
      );

      console.error("Gemini Raw Response:", rawText);

      return NextResponse.json(
        {
          success: false,
          error:
            "AI returned an invalid result. Please try again.",
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // NON-FOOD IMAGE
    // --------------------------------------------------

    if (resultJson.isFood === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            resultJson.errorMessage ||
            "Only scan a food item! Please upload a valid meal or snack.",
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // FOOD VALIDATION
    // --------------------------------------------------

    if (resultJson.isFood !== true) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not identify this image as food.",
        },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // DAILY FOOD SCAN QUOTA
    //
    // Successful food scan consumes 1 daily quota.
    // Non-food images do NOT consume quota.
    // Quota is stored and enforced server-side.
    // --------------------------------------------------

    const quota = await consumeDailyQuota(
      email,
      "foodScan"
    );

    if (!quota.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Daily Food Scan limit reached.",
          code: "DAILY_LIMIT_REACHED",
          plan: quota.plan,
          limit: quota.limit,
          used: quota.used,
          remaining: 0,
          date: quota.date,
        },
        { status: 429 }
      );
    }

    // --------------------------------------------------
    // SAVE MEAL TO MONGODB
    // --------------------------------------------------

    try {
      const client = await clientPromise;

      const db = client.db("aurafit");

      await db.collection("meals").insertOne({
        userId: email,

        email,

        dishName: resultJson.dishName,

        items: resultJson.items,

        totalCalories:
          resultJson.totalCalories,

        totalMacros: {
          protein:
            resultJson.totalProtein,

          carbs:
            resultJson.totalCarbs,

          fat:
            resultJson.totalFats,
        },

        coachTip:
          resultJson.coachTip,

        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error(
        "Failed to save meal to MongoDB:",
        dbError
      );

      // The AI scan was successful and quota
      // has already been consumed.
      // Meal history failure should not
      // invalidate the successful scan.
    }

    // --------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      analysis: resultJson,

      usage: {
        feature: "foodScan",

        used: quota.used,

        limit: quota.limit,

        remaining: quota.remaining,

        date: quota.date,
      },
    });
  } catch (error) {
    console.error(
      "Food Scanner Exception:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Network issue while uploading image.",
      },
      { status: 500 }
    );
  }
}