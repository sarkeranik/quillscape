'use client';

import BlogPostSkeleton from '@/components/BlogPostSkeleton';

export default function Loading() {
  return (
    <div className="animate-in fade-in duration-500">
      <BlogPostSkeleton />
    </div>
  );
}