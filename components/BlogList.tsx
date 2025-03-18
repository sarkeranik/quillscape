'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/contentful';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <Link 
            key={post.slug}
            href={`/post/${post.slug}`}
            className="block"
          >
            <article className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <div className="text-gray-600 mb-4">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              </div>
              <p className="text-gray-700">
                {post.content.substring(0, 200)}...
              </p>
            </article>
          </Link>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}