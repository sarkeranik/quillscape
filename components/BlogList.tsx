'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import type { BlogPost } from '@/lib/contentful';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const title = post?.title?.toLowerCase() || '';
    const content = post?.content?.toLowerCase() || '';
    const author = post?.author?.toLowerCase() || '';
    
    return title.includes(searchLower) || 
           content.includes(searchLower) || 
           author.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search posts"
        />
      </div>

      <div className="space-y-8">
        {paginatedPosts.map((post) => (
          <Link 
            key={post.slug}
            href={`/post/${post.slug}`}
            className="block"
          >
            <article className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">{post.title || 'Untitled Post'}</h2>
              <div className="text-gray-600 mb-4">
                <span>{post.author || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(post.date || new Date()), 'MMMM d, yyyy')}</span>
              </div>
              <p className="text-gray-700">
                {(post.content || 'No content available').substring(0, 200)}...
              </p>
            </article>
          </Link>
        ))}

        {paginatedPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500" role="alert">
            No posts found matching your search.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-gray-600" role="status">
        Showing {paginatedPosts.length} of {filteredPosts.length} posts
      </div>
    </div>
  );
}