'use client';

import { format } from 'date-fns';
import type { BlogPost } from '@/lib/contentful';
import Link from 'next/link';

interface BlogPostProps {
  post: BlogPost;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <Link
        href="/"
        className="inline-flex items-center mb-8 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to posts
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-600">
          <span className="font-medium">{post.author}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>
      
      <div className="prose prose-lg md:prose-xl max-w-none">
        <div className="leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M3 12h18M3 12l6-6M3 12l6 6"/>
          </svg>
          Browse more posts
        </Link>
      </footer>
    </article>
  );
}