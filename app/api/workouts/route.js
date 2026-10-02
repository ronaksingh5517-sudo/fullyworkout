// import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongodb";

// // GET: Fetch user workouts history from MongoDB
// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId") || "default_user";

//     const client = await clientPromise;
//     const db = client.db("aurafit");

//     const workouts = await db.collection("workouts")
//       .find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .toArray();

//     return NextResponse.json({ success: true, workouts });
//   } catch (error) {
//     console.error("Workouts GET error:", error);
//     return NextResponse.json({ success: false, error: "Failed to fetch workouts" }, { status: 500 });
//   }
// }

// // POST: Save completed workout session to MongoDB
// export async function POST(req) {
//   try {
//     const { userId, title, durationMinutes, exercisesCompleted, notes } = await req.json();

//     const client = await clientPromise;
//     const db = client.db("aurafit");

//     const newWorkout = {
//       userId: userId || "default_user",
//       title: title || "Interactive AI Workout Session",
//       durationMinutes: Number(durationMinutes) || 30,
//       exercisesCompleted: exercisesCompleted || [],
//       notes: notes || "Completed via AuraFit Workout Tracker",
//       createdAt: new Date(),
//     };

//     await db.collection("workouts").insertOne(newWorkout);

//     return NextResponse.json({ success: true, message: "Workout saved to MongoDB successfully!" });
//   } catch (error) {
//     console.error("Workouts POST error:", error);
//     return NextResponse.json({ success: false, error: "Failed to save workout" }, { status: 500 });
//   }
// }













import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "aurafit";
const USERS = "users";
const WORKOUTS = "workouts";

function normalizeCompletedDays(value) {
  if (!Array.isArray(value)) return [];

  const numbers = [...new Set(
    value
      .map(Number)
      .filter(
        (day) =>
          Number.isInteger(day) &&
          day >= 1 &&
          day <= 365
      )
  )].sort((a, b) => a - b);

  // Only keep sequential progress.
  // Example:
  // [1,2,3] -> [1,2,3]
  // [1,3]   -> [1]
  const completed = [];

  for (let i = 0; i < numbers.length; i += 1) {
    const expected = i + 1;

    if (numbers[i] !== expected) {
      break;
    }

    completed.push(numbers[i]);
  }

  return completed;
}

async function getAuthorizedEmail(req, suppliedEmail) {
  const session = await getServerSession(authOptions);

  const sessionEmail = String(
    session?.user?.email || ""
  )
    .trim()
    .toLowerCase();

  if (!sessionEmail) {
    return null;
  }

  // Never trust a client email to access another user's progress.
  if (
    suppliedEmail &&
    String(suppliedEmail).trim().toLowerCase() !== sessionEmail
  ) {
    return null;
  }

  return sessionEmail;
}

/*
========================================================
GET
========================================================

Progress:
GET /api/workout?type=progress

Workout history:
GET /api/workout?userId=...
*/

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const type = url.searchParams.get("type");
    const suppliedEmail =
      url.searchParams.get("email") || "";

    /*
    ======================================================
    GET WORKOUT PROGRESS
    ======================================================
    */

    if (type === "progress") {
      const email = await getAuthorizedEmail(
        req,
        suppliedEmail
      );

      if (!email) {
        return NextResponse.json(
          {
            success: false,
            code: "AUTH_REQUIRED",
            error: "Please login first.",
          },
          { status: 401 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const user = await db
        .collection(USERS)
        .findOne(
          { email },
          {
            projection: {
              completedDays: 1,
            },
          }
        );

      return NextResponse.json({
        success: true,
        completedDays: normalizeCompletedDays(
          user?.completedDays
        ),
      });
    }

    /*
    ======================================================
    EXISTING WORKOUT HISTORY
    ======================================================
    */

    const userId =
      url.searchParams.get("userId") ||
      "default_user";

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const workouts = await db
      .collection(WORKOUTS)
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      success: true,
      workouts,
    });
  } catch (error) {
    console.error(
      "Workouts GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch workouts",
      },
      { status: 500 }
    );
  }
}

/*
========================================================
POST
========================================================

Progress:
POST /api/workout
{
  type: "progress",
  email: "...",
  completedDays: [1,2]
}

Existing workout session:
POST /api/workout
{
  userId,
  title,
  durationMinutes,
  exercisesCompleted,
  notes
}
*/

export async function POST(req) {
  try {
    const body = await req.json();

    /*
    ======================================================
    SAVE WORKOUT PROGRESS
    ======================================================
    */

    if (body?.type === "progress") {
      const suppliedEmail = String(
        body?.email || ""
      ).trim();

      const email = await getAuthorizedEmail(
        req,
        suppliedEmail
      );

      if (!email) {
        return NextResponse.json(
          {
            success: false,
            code: "AUTH_REQUIRED",
            error: "Please login first.",
          },
          { status: 401 }
        );
      }

      const client = await clientPromise;
      const db = client.db(DB_NAME);

      /*
      Get existing progress
      */

      const user = await db
        .collection(USERS)
        .findOne(
          { email },
          {
            projection: {
              completedDays: 1,
            },
          }
        );

      const currentDays =
        normalizeCompletedDays(
          user?.completedDays
        );

      const requestedDays =
        normalizeCompletedDays(
          body?.completedDays
        );

      /*
      ====================================================
      NEVER ALLOW PROGRESS TO GO BACKWARD
      ====================================================
      */

      if (
        requestedDays.length <
        currentDays.length
      ) {
        return NextResponse.json({
          success: true,
          completedDays: currentDays,
        });
      }

      /*
      ====================================================
      NEVER ALLOW SKIPPING DAYS
      ====================================================
      */

      if (
        requestedDays.length >
        currentDays.length + 1
      ) {
        return NextResponse.json(
          {
            success: false,
            code: "SEQUENTIAL_DAY_REQUIRED",
            error:
              "Complete the previous workout before unlocking another day.",
            completedDays: currentDays,
          },
          { status: 409 }
        );
      }

      /*
      Make sure old progress is unchanged.
      */

      for (
        let i = 0;
        i < currentDays.length;
        i += 1
      ) {
        if (
          requestedDays[i] !==
          currentDays[i]
        ) {
          return NextResponse.json(
            {
              success: false,
              code: "INVALID_PROGRESS",
              error:
                "Invalid workout progress.",
              completedDays: currentDays,
            },
            { status: 400 }
          );
        }
      }

      /*
      ====================================================
      NEXT DAY MUST BE EXACTLY CURRENT + 1
      ====================================================
      */

      const nextDay =
        currentDays.length + 1;

      if (
        requestedDays.length ===
          currentDays.length + 1 &&
        requestedDays[
          currentDays.length
        ] !== nextDay
      ) {
        return NextResponse.json(
          {
            success: false,
            code: "SEQUENTIAL_DAY_REQUIRED",
            error:
              "Complete the previous workout before unlocking another day.",
            completedDays: currentDays,
          },
          { status: 409 }
        );
      }

      const finalDays = requestedDays;

      /*
      ====================================================
      SAVE TO USER DOCUMENT
      ====================================================
      */

      await db
        .collection(USERS)
        .updateOne(
          { email },
          {
            $set: {
              completedDays: finalDays,

              // If Day 1 is completed:
              // currentWorkoutDay = 2
              //
              // If Day 2 is completed:
              // currentWorkoutDay = 3
              currentWorkoutDay:
                finalDays.length + 1,

              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

      return NextResponse.json({
        success: true,
        completedDays: finalDays,
        currentWorkoutDay:
          finalDays.length + 1,
      });
    }

    /*
    ======================================================
    EXISTING WORKOUT SESSION SAVE
    ======================================================
    */

    const {
      userId,
      title,
      durationMinutes,
      exercisesCompleted,
      notes,
    } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const newWorkout = {
      userId:
        userId || "default_user",

      title:
        title ||
        "Interactive AI Workout Session",

      durationMinutes:
        Number(durationMinutes) || 30,

      exercisesCompleted:
        exercisesCompleted || [],

      notes:
        notes ||
        "Completed via AuraFit Workout Tracker",

      createdAt: new Date(),
    };

    await db
      .collection(WORKOUTS)
      .insertOne(newWorkout);

    return NextResponse.json({
      success: true,
      message:
        "Workout saved to MongoDB successfully!",
    });
  } catch (error) {
    console.error(
      "Workouts POST error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save workout",
      },
      { status: 500 }
    );
  }
}