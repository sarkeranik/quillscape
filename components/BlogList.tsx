"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useState, useCallback } from "react";
import type { BlogPost } from "@/lib/contentful";
import { Search, Calendar, User, Loader2, Filter } from "lucide-react";
import { debounce } from "lodash";
import { getPosts } from "@/lib/posts";

interface BlogListProps {
  initialPosts: BlogPost[];
}

interface Filters {
  search: string;
  author: string;
  startDate: string;
  endDate: string;
}

export default function BlogList({ initialPosts }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    author: "",
    startDate: "",
    endDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const postsPerPage = 5;

  const fetchPosts = async (newFilters: Filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedPosts = await getPosts({
        search: newFilters.search || undefined,
        author: newFilters.author || undefined,
        startDate: newFilters.startDate || undefined,
        endDate: newFilters.endDate || undefined,
      });
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

  const debouncedFetchPosts = useCallback(
    debounce((newFilters: Filters) => {
      if (Object.values(newFilters).every((v) => !v)) {
        setPosts(initialPosts);
        setIsLoading(false);
      } else {
        fetchPosts(newFilters);
      }
    }, 300),
    [initialPosts]
  );

  const handleFilterChange = (name: keyof Filters, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setIsLoading(true);
    debouncedFetchPosts(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      author: "",
      startDate: "",
      endDate: "",
    });
    setPosts(initialPosts);
    setCurrentPage(1);
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search posts"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50"
            aria-expanded={showFilters}
            aria-label="Toggle filters"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  value={filters.author}
                  onChange={(e) => handleFilterChange("author", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Filter by author"
                />
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

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
                  <span>{format(parseISO(post.date), "MMMM d, yyyy")}</span>
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
            No posts found matching your criteria.
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
