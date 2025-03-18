"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useState, useCallback } from "react";
import type { BlogPost } from "@/lib/contentful";
import { Search, Calendar, User, Loader2 } from "lucide-react";
import { debounce } from "lodash";
import { getPosts } from "@/lib/posts";

interface BlogListProps {
  initialPosts: BlogPost[];
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 5;

  const fetchPosts = async (search: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedPosts = await getPosts(search);
      setPosts(fetchedPosts);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
      setPosts(initialPosts);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a debounced version of fetchPosts
  const debouncedFetchPosts = useCallback(
    debounce((search: string) => {
      if (search === "") {
        setPosts(initialPosts);
        setIsLoading(false);
      } else {
        fetchPosts(search);
      }
    }, 300),
    [initialPosts]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsLoading(true);
    debouncedFetchPosts(value);
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search posts"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
          )}
        </div>
        {error && (
          <p className="mt-2 text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {paginatedPosts.map((post) => (
          <Link key={post.slug} href={`/post/${post.slug}`} className="block">
            <article className="border rounded-lg p-6 hover:shadow-lg transition cursor-pointer bg-white">
              <h2 className="text-2xl font-semibold mb-2">
                {post.title || "Untitled Post"}
              </h2>
              <div className="flex items-center text-gray-600 mb-4 space-x-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author || "Anonymous"}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(post.date || new Date()), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">
                {(post.content || "No content available").substring(0, 200)}...
              </p>
            </article>
          </Link>
        ))}

        {paginatedPosts.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500" role="alert">
            No posts found matching your search.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            Previous
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-50"
                }`}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-gray-600" role="status">
        Showing {paginatedPosts.length} of {posts.length} posts
      </div>
    </div>
  );
}
