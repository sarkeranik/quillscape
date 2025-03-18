import BlogList from '@/components/BlogList';
import { getAllPosts } from '@/lib/contentful';
import { Suspense } from 'react';
import BlogPostSkeleton from '@/components/BlogPostSkeleton';

export default async function Home() {
  const posts = await getAllPosts();
  
  return (
    <div className="animate-in fade-in duration-500">
      <Suspense fallback={<BlogPostSkeleton />}>
        <BlogList posts={posts} />
      </Suspense>
    </div>
  );
}