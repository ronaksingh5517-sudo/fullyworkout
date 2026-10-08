export const metadata = {
  title: "AI Fitness Coach | Personalized Fitness Guidance | FullyWorkout",

  description:
    "Get AI-powered fitness guidance for workouts, nutrition, recovery, training routines, and your personal fitness goals with FullyWorkout.",

  alternates: {
    canonical: "https://fullyworkout.com/ai-coach",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Fitness Coach | FullyWorkout",
    description:
      "Your AI-powered fitness coach for personalized workouts, nutrition guidance, recovery, and fitness goals.",
    url: "https://fullyworkout.com/ai-coach",
    siteName: "FullyWorkout",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Fitness Coach | FullyWorkout",
    description:
      "Get personalized AI fitness guidance for workouts, nutrition, recovery, and your fitness goals.",
  },
};

export default function AICoachLayout({ children }) {
  return children;
}