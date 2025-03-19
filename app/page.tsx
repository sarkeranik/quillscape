import BlogList from "@/components/BlogList";
import BlogPostSkeleton from "@/components/BlogPostSkeleton";
import { Suspense } from "react";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts().catch(() => []);

  return (
    <div className="animate-in fade-in duration-500">
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogList initialPosts={posts} />
      </Suspense>
    </div>
  );
}
