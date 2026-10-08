export const metadata = {
  title: "AI Workout Planner & Personalized Workout Plans | FullyWorkout",

  description:
    "Get personalized workout plans for fat loss, muscle gain, fitness, and body transformation with FullyWorkout.",

  alternates: {
    canonical: "https://fullyworkout.com/workout",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Workout Planner & Personalized Workout Plans | FullyWorkout",
    description:
      "Follow structured personalized workouts designed around your fitness goals, experience, and training preferences.",
    url: "https://fullyworkout.com/workout",
    siteName: "FullyWorkout",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Workout Planner & Personalized Workout Plans | FullyWorkout",
    description:
      "Get personalized workout plans for fat loss, muscle gain, fitness, and body transformation with FullyWorkout.",
  },
};

export default function WorkoutLayout({ children }) {
  return children;
}