export default function SEOJsonLD() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FullyWorkout",
    url: "https://fullyworkout.com",
    logo: "https://fullyworkout.com/favicon.png",
    description:
      "AI-powered fitness platform for personalized workouts, nutrition, food scanning, body analysis and transformation tracking.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FullyWorkout",
    url: "https://fullyworkout.com",
    description:
      "AI fitness coach for personalized workouts, nutrition and body transformation.",
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FullyWorkout",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: "https://fullyworkout.com",
    description:
      "AI-powered fitness platform providing personalized workouts, AI fitness coaching, food scanning, body analysis and transformation tracking.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  );
}