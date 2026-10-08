export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/signup",
        "/dashboard",
        "/profile",
        "/settings",
        "/checkout",
      ],
    },

    sitemap: "https://fullyworkout.com/sitemap.xml",
  };
}