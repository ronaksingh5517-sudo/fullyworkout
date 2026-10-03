import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import ClientLoaderWrapper from "@/components/ClientLoaderWrapper";

export const metadata = {
  title: "FullyWorkout - AI Fitness & Diet Planner",
  description:
    "Transform your body with FullyWorkout AI coach, vision food scanner, and posture analyzer.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
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

        {/* Vercel Analytics */}
        <Analytics />

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-8RLGQKTD3R" />
      </body>
    </html>
  );
}