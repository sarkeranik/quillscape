"use client";

import { format } from "date-fns";
import type { BlogPost } from "@/lib/contentful";
import Link from "next/link";
import CommentSection from "./CommentSection";
import { ArrowLeft, Calendar, User } from "lucide-react";

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
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to posts
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            <span className="font-medium">{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            <time dateTime={post.date}>
              {format(new Date(post.date), "MMMM d, yyyy")}
            </time>
          </div>
        </div>
      </header>

      <div className="prose prose-lg md:prose-xl max-w-none">
        <div className="leading-relaxed space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <CommentSection postSlug={post.slug} />

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Browse more posts
        </Link>
      </footer>
    </article>
  );
}
