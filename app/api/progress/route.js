import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

function normalizeDays(days) {
  if (!Array.isArray(days)) return [];

  return [...new Set(
    days
      .map(Number)
      .filter(
        (day) =>
          Number.isInteger(day) &&
          day >= 1 &&
          day <= 30
      )
  )].sort((a, b) => a - b);
}

// GET — MongoDB se workout progress load
export async function GET(req) {
  try {
    const url = new URL(req.url);

    const email = String(
      url.searchParams.get("email") || ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const user = await db
      .collection("users")
      .findOne(
        { email },
        {
          projection: {
            completedDays: 1,
            currentWorkoutDay: 1,
          },
        }
      );

    const completedDays = normalizeDays(
      user?.completedDays
    );

    return NextResponse.json({
      success: true,
      completedDays,
      currentWorkoutDay:
        user?.currentWorkoutDay ||
        completedDays.length + 1,
    });
  } catch (error) {
    console.error(
      "Get progress error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to load workout progress",
      },
      { status: 500 }
    );
  }
}

// POST — Workout complete hone par progress save
export async function POST(req) {
  try {
    const body = await req.json();

    const email = String(
      body?.email || ""
    )
      .trim()
      .toLowerCase();

    const requestedDays = normalizeDays(
      body?.completedDays
    );

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const existingUser = await db
      .collection("users")
      .findOne(
        { email },
        {
          projection: {
            completedDays: 1,
          },
        }
      );

    const currentDays = normalizeDays(
      existingUser?.completedDays
    );

    // Progress ko peeche nahi jaane dena
    if (
      requestedDays.length <
      currentDays.length
    ) {
      return NextResponse.json({
        success: true,
        completedDays: currentDays,
        currentWorkoutDay:
          currentDays.length + 1,
      });
    }

    // Purane completed days change nahi hone chahiye
    for (let i = 0; i < currentDays.length; i++) {
      if (requestedDays[i] !== currentDays[i]) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid workout progress.",
            completedDays: currentDays,
          },
          { status: 400 }
        );
      }
    }

    // Ek baar me sirf next day complete ho sakta hai
    if (
      requestedDays.length >
      currentDays.length + 1
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Complete the previous day first.",
          completedDays: currentDays,
        },
        { status: 409 }
      );
    }

    await db
      .collection("users")
      .updateOne(
        { email },
        {
          $set: {
            completedDays: requestedDays,
            currentWorkoutDay:
              requestedDays.length + 1,
            updatedAt: new Date(),
          },
        },
        {
          upsert: true,
        }
      );

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully!",
      completedDays: requestedDays,
      currentWorkoutDay:
        requestedDays.length + 1,
    });
  } catch (error) {
    console.error(
      "Save progress error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Failed to save workout progress",
      },
      { status: 500 }
    );
  }
}