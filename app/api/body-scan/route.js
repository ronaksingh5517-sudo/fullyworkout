import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const imageBase64 = body.imageBase64 || body.image;
    const userId = body.userId;

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API Key in .env.local" }, { status: 500 });
    }

    let mimeType = "image/jpeg";
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }

    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    const prompt = `You are an expert AI fitness and biometric scanner. Analyze this user's physique/body image carefully.

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
    { "label": "Lower body", "value": "Not visible" },
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
}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
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

    if (!response.ok || !data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const errMessage = data?.error?.message || "Could not analyze physique image.";
      return NextResponse.json({ success: false, error: errMessage }, { status: 200 });
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(cleaned);

    if (resultJson.isBody === false) {
      return NextResponse.json({ success: false, error: resultJson.errorMessage });
    }

    if (resultJson.isBody === true) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        await db.collection("body_scans").insertOne({
          userId: userId || "default_user",
          analysis: resultJson,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("Failed to save body scan to MongoDB:", dbError);
      }
    }

    return NextResponse.json({ success: true, analysis: resultJson });
  } catch (error) {
    console.error("Body Scan Exception:", error);
    return NextResponse.json({ success: false, error: "Network issue while uploading image." }, { status: 500 });
  }
}