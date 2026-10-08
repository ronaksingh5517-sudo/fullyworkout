import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import ClientLoaderWrapper from "@/components/ClientLoaderWrapper";

export const metadata = {
  metadataBase: new URL("https://fullyworkout.com"),

  title: {
    default:
      "FullyWorkout — AI Fitness Coach for Personalized Workouts & Nutrition",
    template: "%s | FullyWorkout",
  },

  description:
    "FullyWorkout is an AI-powered fitness platform for personalized workouts, AI fitness coaching, food scanning, body analysis, nutrition tracking, and fitness progress.",

  applicationName: "FullyWorkout",

  authors: [
    {
      name: "FullyWorkout",
      url: "https://fullyworkout.com",
    },
  ],

  creator: "FullyWorkout",
  publisher: "FullyWorkout",

  keywords: [
    "FullyWorkout",
    "AI fitness coach",
    "AI workout planner",
    "personalized workout plan",
    "AI fitness app",
    "AI food scanner",
    "AI nutrition tracking",
    "body scan fitness",
    "fitness progress tracking",
    "AI fitness coaching",
    "workout tracker",
    "AI diet planner",
  ],

  alternates: {
    canonical: "https://fullyworkout.com/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://fullyworkout.com/",
    siteName: "FullyWorkout",

    title:
      "FullyWorkout — AI Fitness Coach for Personalized Workouts & Nutrition",

    description:
      "Personalized workouts, AI fitness coaching, food scanning, body analysis, nutrition tracking, and fitness progress in one platform.",

    locale: "en_US",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FullyWorkout AI Fitness Coach",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "FullyWorkout — AI Fitness Coach for Personalized Workouts & Nutrition",

    description:
      "AI-powered workouts, nutrition tracking, food scanning, body analysis, and fitness progress tracking.",

    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FullyWorkout",
    url: "https://fullyworkout.com",
    logo: "https://fullyworkout.com/favicon.png",
    description:
      "FullyWorkout is an AI-powered fitness platform for personalized workouts, nutrition tracking, food scanning, body analysis, and fitness progress tracking.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FullyWorkout",
    url: "https://fullyworkout.com",
    description:
      "AI-powered fitness platform for personalized workouts, nutrition tracking, food scanning, body analysis, and fitness progress.",
  };

  return (
    <html
      lang="en"
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#080a0e",
      }}
    >
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          minHeight: "100vh",
          overflowX: "hidden",
          backgroundColor: "#080a0e",
        }}
      >
        <ClientLoaderWrapper>
          <Providers>{children}</Providers>
        </ClientLoaderWrapper>

        <Analytics />

        <GoogleAnalytics gaId="G-8RLGQKTD3R" />
      </body>
    </html>
  );
}