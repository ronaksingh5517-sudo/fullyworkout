export const metadata = {
  title: "AI Body Scan & Posture Analysis | FullyWorkout",

  description:
    "Analyze posture, body composition indicators, symmetry, and areas to improve with FullyWorkout AI Body Scan.",

  alternates: {
    canonical: "https://fullyworkout.com/body-scan",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Body Scan & Posture Analysis | FullyWorkout",
    description:
      "Use AI-powered body analysis to understand posture, symmetry, body composition indicators, and fitness areas to improve.",
    url: "https://fullyworkout.com/body-scan",
    siteName: "FullyWorkout",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Body Scan & Posture Analysis | FullyWorkout",
    description:
      "Analyze posture, symmetry, body composition indicators, and areas to improve with AI-powered body analysis.",
  },
};

export default function BodyScanLayout({ children }) {
  return children;
}