// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const imageBase64 = body.imageBase64 || body.image;
//     const userId = body.userId;

//     if (!imageBase64) {
//       return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json({ success: false, error: "Missing API Key in .env.local" }, { status: 500 });
//     }

//     let mimeType = "image/jpeg";
//     const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
//     if (mimeMatch) {
//       mimeType = mimeMatch[1];
//     }

//     const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

//     const prompt = `You are an expert AI fitness and biometric scanner. Analyze this user's physique/body image carefully.

// STEP 1: Check if the image contains a human body, physique, or fitness posture. 
// If the image contains food, rooms, laptops, cars, or ANY non-body items, you MUST return ONLY this JSON:
// {
//   "isBody": false,
//   "errorMessage": "Only scan a physique or body image! Please upload a valid fitness photo."
// }

// STEP 2: If it IS a human body/physique, calculate realistic biometrics and posture points based on visual estimation.
// Return ONLY valid JSON in this exact structure (no backticks, no markdown):
// {
//   "isBody": true,
//   "posturePoints": [
//     { "label": "Muscle", "value": "High" },
//     { "label": "Chest", "value": "Well developed" },
//     { "label": "Arms", "value": "Highly defined" },
//     { "label": "Posture", "value": "Good" },
//     { "label": "Lower body", "value": "Not visible" },
//     { "label": "Symmetry", "value": "Good" },
//     { "label": "Overall", "value": "Athletic physique" }
//   ],
//   "bodyFat": 14.5,
//   "maxBodyFat": 30,
//   "bodyScore": 8.8,
//   "maxBodyScore": 10,
//   "chest": 41.5,
//   "maxChest": 50,
//   "rmr": 1850,
//   "maxRmr": 2500,
//   "testosterone": 780,
//   "maxTestosterone": 1000,
//   "waist": 31,
//   "maxWaist": 45,
//   "neckShoulder": 1.2,
//   "maxNeckShoulder": 2.0,
//   "biceps": 15.2,
//   "maxBiceps": 20,
//   "hip": 38.0,
//   "maxHip": 50,
//   "coachTip": "Focus on upper back strength and core stability."
// }`;

//     const payload = {
//       contents: [
//         {
//           parts: [
//             { text: prompt },
//             {
//               inlineData: {
//                 data: base64Data,
//                 mimeType: mimeType,
//               },
//             },
//           ],
//         },
//       ],
//     };

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-goog-api-key": apiKey.trim(),
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok || !data?.candidates?.[0]?.content?.parts?.[0]?.text) {
//       const errMessage = data?.error?.message || "Could not analyze physique image.";
//       return NextResponse.json({ success: false, error: errMessage }, { status: 200 });
//     }

//     const rawText = data.candidates[0].content.parts[0].text;
//     const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
//     const resultJson = JSON.parse(cleaned);

//     if (resultJson.isBody === false) {
//       return NextResponse.json({ success: false, error: resultJson.errorMessage });
//     }

//     if (resultJson.isBody === true) {
//       try {
//         const client = await clientPromise;
//         const db = client.db("aurafit");
//         await db.collection("body_scans").insertOne({
//           userId: userId || "default_user",
//           analysis: resultJson,
//           createdAt: new Date(),
//         });
//       } catch (dbError) {
//         console.error("Failed to save body scan to MongoDB:", dbError);
//       }
//     }

//     return NextResponse.json({ success: true, analysis: resultJson });
//   } catch (error) {
//     console.error("Body Scan Exception:", error);
//     return NextResponse.json({ success: false, error: "Network issue while uploading image." }, { status: 500 });
//   }
// }

















import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import {
  consumeDailyQuota,
  getDailyUsage,
} from "@/lib/dailyUsage";

// ==================================================
// GET: CURRENT USER BODY SCAN USAGE
// ==================================================

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
    const dailyUsage = await getDailyUsage(email);

    return NextResponse.json({
      success: true,
      usage: {
        feature: "bodyScan",
        plan: dailyUsage.plan,
        used: dailyUsage.usage.bodyScans,
        limit: dailyUsage.limits.bodyScans,
        remaining: dailyUsage.remaining.bodyScans,
        date: dailyUsage.date,
      },
    });
  } catch (error) {
    console.error("Body Scan Usage Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Could not load Body Scan usage.",
      },
      { status: 500 }
    );
  }
}

// ==================================================
// POST: ANALYZE BODY IMAGE
// ==================================================

export async function POST(req) {
  try {
    // ----------------------------------------------
    // 1. AUTHENTICATION
    // ----------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please login to use Body Scanner.",
          code: "AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }

    // Always use the authenticated user's email.
    const email = session.user.email;

    // ----------------------------------------------
    // 2. REQUEST BODY
    // ----------------------------------------------

    const body = await req.json();
    const imageBase64 = body.imageBase64 || body.image;

    if (
      !imageBase64 ||
      typeof imageBase64 !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid image provided.",
        },
        { status: 400 }
      );
    }

    // ----------------------------------------------
    // 3. GEMINI API KEY
    // ----------------------------------------------

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

    // ----------------------------------------------
    // 4. IMAGE MIME TYPE
    // ----------------------------------------------

    const mimeMatch = imageBase64.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,/
    );

    const mimeType = mimeMatch?.[1] || "image/jpeg";

    const base64Data = imageBase64.replace(
      /^data:image\/[a-zA-Z0-9.+-]+;base64,/,
      ""
    );

    if (!base64Data) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid image data.",
        },
        { status: 400 }
      );
    }
    // ----------------------------------------------
    // 5. BODY SCAN PROMPT
    // ----------------------------------------------

    const prompt = `
You are an expert AI fitness and biometric scanner. Analyze this user's physique/body image carefully.

STEP 1: Check if the image contains a human body, physique, or fitness posture. 
If the image contains food, rooms, laptops, cars, or ANY non-body items, you MUST return ONLY this JSON:
{
  "isBody": false,
  "errorMessage": "Only scan a physique or body image! Please upload a valid fitness photo."
}

STEP 2: If it IS a human body/physique, calculate realistic biometrics and posture points based on visual estimation.
Return ONLY valid JSON in this exact structure (no backticks, no markdown):
{
  "isBody": true,
  "posturePoints": [
    { "label": "Muscle", "value": "High" },
    { "label": "Chest", "value": "Well developed" },
    { "label": "Arms", "value": "Highly defined" },
    { "label": "Posture", "value": "Good" },
    { "label": "Lower body", "value": "Visible" },
    { "label": "Symmetry", "value": "Good" },
    { "label": "Overall", "value": "Athletic physique" }
  ],
  "bodyFat": 14.5,
  "maxBodyFat": 30,
  "bodyScore": 8.8,
  "maxBodyScore": 10,
  "chest": 41.5,
  "maxChest": 50,
  "rmr": 1850,
  "maxRmr": 2500,
  "testosterone": 780,
  "maxTestosterone": 1000,
  "waist": 31,
  "maxWaist": 45,
  "neckShoulder": 1.2,
  "maxNeckShoulder": 2.0,
  "biceps": 15.2,
  "maxBiceps": 20,
  "hip": 38.0,
  "maxHip": 50,
  "coachTip": "Focus on upper back strength and core stability."
}
`;
    // ----------------------------------------------
    // 6. CALL GEMINI
    // ----------------------------------------------

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await response.json();

    if (
      !response.ok ||
      !geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      console.error("Gemini API Error:", geminiData);

      return NextResponse.json(
        {
          success: false,
          error:
            geminiData?.error?.message ||
            "Could not analyze physique image. Please try again.",
        },
        { status: 502 }
      );
    }

    // ----------------------------------------------
    // 7. PARSE GEMINI RESPONSE
    // ----------------------------------------------

    const rawText =
      geminiData.candidates[0].content.parts[0].text;

    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let resultJson;

    try {
      resultJson = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Body Scan JSON Parse Error:", parseError);

      return NextResponse.json(
        {
          success: false,
          error: "AI returned an invalid result. Please try again.",
        },
        { status: 502 }
      );
    }

    // ----------------------------------------------
    // 8. REJECT NON-BODY IMAGES
    // Non-body images do not consume quota.
    // ----------------------------------------------

    if (resultJson.isBody === false) {
      return NextResponse.json(
        {
          success: false,
          error:
            resultJson.errorMessage ||
            "Only scan a body image.",
        },
        { status: 200 }
      );
    }

    if (resultJson.isBody !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not identify a valid body image.",
        },
        { status: 200 }
      );
    }

    // ----------------------------------------------
    // 9. ENFORCE CENTRAL DAILY BODY SCAN QUOTA
    // ----------------------------------------------

    const quota = await consumeDailyQuota(
      email,
      "bodyScan"
    );

    if (!quota.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily Body Scan limit reached.",
          code: "DAILY_LIMIT_REACHED",
          plan: quota.plan,
          used: quota.used,
          limit: quota.limit,
          remaining: 0,
          date: quota.date,
        },
        { status: 429 }
      );
    }

    // ----------------------------------------------
    // 10. SAVE SCAN TO MONGODB
    // ----------------------------------------------

    try {
      const client = await clientPromise;
      const db = client.db("aurafit");

      await db.collection("body_scans").insertOne({
        userId: email,
        email,
        analysis: resultJson,
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error(
        "Failed to save body scan to MongoDB:",
        dbError
      );

      // The scan succeeded and quota was consumed.
      // A history-save failure should not discard
      // the successful analysis.
    }

    // ----------------------------------------------
    // 11. SUCCESS RESPONSE + UPDATED QUOTA
    // ----------------------------------------------

    return NextResponse.json({
      success: true,
      analysis: resultJson,
      usage: {
        feature: "bodyScan",
        plan: quota.plan,
        used: quota.used,
        limit: quota.limit,
        remaining: quota.remaining,
        date: quota.date,
      },
    });
  } catch (error) {
    console.error("Body Scan Exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Network issue while uploading image.",
      },
      { status: 500 }
    );
  }
}
