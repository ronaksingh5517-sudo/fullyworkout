import Link from "next/link";
import { blogs } from "./blogData";

export const metadata = {
  title: "Fitness, Workout & Nutrition Blog | FullyWorkout",
  description:
    "Explore workout plans, nutrition guides, calorie tracking tips, and practical fitness advice.",
  alternates: {
    canonical: "https://fullyworkout.com/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#080a0e] px-5 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#ff5232]">
            FullyWorkout Journal
          </p>

          <h1 className="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Fitness, Workout & Nutrition Guides
          </h1>

          <p className="max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Discover practical guides to help you build better workout
            routines, understand nutrition, and develop sustainable habits.
          </p>
        </header>

        <section
          aria-label="Fitness blog articles"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogs.map((blog) => (
            <article
              key={blog.slug}
              className="flex flex-col rounded-2xl border border-gray-800 bg-[#121620] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff5232] hover:shadow-xl"
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#ff5232]">
                {blog.category}
              </p>

              <h2 className="mb-3 text-xl font-bold leading-snug text-white">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="transition hover:text-[#ff5232]"
                >
                  {blog.title}
                </Link>
              </h2>

              <p className="mb-6 flex-1 text-sm leading-7 text-gray-400">
                {blog.description}
              </p>

              <Link
                href={`/blog/${blog.slug}`}
                className="font-semibold text-[#ff5232] hover:underline"
              >
                Read article →
              </Link>
            </article>
          ))}
        </section>a
      </div>
    </main>
  );
}