
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "../blogData";

const SITE_URL = "https://fullyworkout.com";

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return {
      title: "Article Not Found | FullyWorkout",
    };
  }

  return {
    title: `${blog.title} | FullyWorkout`,
    description: blog.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${SITE_URL}/blog/${blog.slug}`,
      type: "article",
      siteName: "FullyWorkout",
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-5 py-12 text-gray-900 sm:px-8">
      <article className="mx-auto max-w-3xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap gap-2 text-sm text-gray-500"
        >
          <Link href="/" className="hover:text-green-700 hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/blog"
            className="hover:text-green-700 hover:underline"
          >
            Blog
          </Link>
          <span>/</span>
          <span>{blog.category}</span>
        </nav>

        <header className="mb-10 border-b border-gray-200 pb-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-green-700">
            {blog.category}
          </p>

          <h1 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {blog.title}
          </h1>

          <p className="text-lg leading-8 text-gray-600">
            {blog.description}
          </p>
        </header>

        <div className="space-y-9">
          {blog.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-4 text-2xl font-bold tracking-tight">
                {section.heading}
              </h2>

              <div className="space-y-4 text-base leading-8 text-gray-700">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-3 text-xl font-bold">
            Explore More Fitness Guides
          </h2>

          <p className="mb-4 leading-7 text-gray-600">
            Discover more articles about workouts, nutrition, and fitness.
          </p>

          <Link
            href="/blog"
            className="font-semibold text-green-700 hover:underline"
          >
            Browse all articles →
          </Link>
        </aside>
      </article>
    </main>
  );
}
