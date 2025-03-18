'use client';

import { format } from 'date-fns';
import type { BlogPost } from '@/lib/contentful';
import Link from 'next/link';

interface BlogPostProps {
  post: BlogPost;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <Link
        href="/"
        className="mb-6 text-blue-500 hover:text-blue-600 flex items-center"
      >
        ← Back to posts
      </Link>

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-8">
        <span>{post.author}</span>
        <span className="mx-2">•</span>
        <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
      </div>
      
      <div className="prose max-w-none mb-12">
        {post.content}
      </div>
    </article>
  );
}