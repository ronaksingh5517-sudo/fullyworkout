export const metadata = {
  title: "AI Food Scanner for Calories & Nutrition | FullyWorkout",

  description:
    "Scan meals with FullyWorkout AI Food Scanner to estimate calories, protein, carbohydrates, and fats and track your nutrition.",

  alternates: {
    canonical: "https://fullyworkout.com/food-scanner",
  },

  openGraph: {
    title: "AI Food Scanner for Calories & Nutrition | FullyWorkout",

    description:
      "Use AI-powered food recognition to estimate meal calories and macronutrients and keep your nutrition tracking on track.",

    url: "https://fullyworkout.com/food-scanner",

    siteName: "FullyWorkout",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "AI Food Scanner for Calories & Nutrition | FullyWorkout",

    description:
      "Scan meals with AI-powered food recognition and track estimated calories and macronutrients.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function FoodScannerLayout({ children }) {
  return children;
}