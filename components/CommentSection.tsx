"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageSquare, Edit2, Trash2, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments?postSlug=${postSlug}`, {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load comments. Please try again later.");
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingComment
        ? `/api/comments?id=${editingComment.id}&postSlug=${postSlug}`
        : "/api/comments";

      const response = await fetch(url, {
        method: editingComment ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          postSlug,
          ...newComment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit comment");
      }

      setNewComment({ author: "", content: "" });
      setEditingComment(null);
      await fetchComments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit comment. Please try again."
      );
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/comments?id=${commentId}&postSlug=${postSlug}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete comment");
      }
      await fetchComments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete comment. Please try again."
      );
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <section className="mt-16 border-t pt-8">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Comments</h2>
        <span className="text-gray-500">({comments.length})</span>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-12 space-y-4 bg-gray-50 p-6 rounded-lg"
      >
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="author"
            value={newComment.author}
            onChange={(e) =>
              setNewComment({ ...newComment, author: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Your name"
            required
            disabled={isSubmitting}
            minLength={2}
            maxLength={50}
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment
          </label>
          <textarea
            id="content"
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="Share your thoughts..."
            required
            disabled={isSubmitting}
            minLength={10}
            maxLength={1000}
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting
              ? editingComment
                ? "Updating..."
                : "Posting..."
              : editingComment
              ? "Update Comment"
              : "Post Comment"}
          </button>

          {editingComment && (
            <button
              type="button"
              onClick={() => {
                setEditingComment(null);
                setNewComment({ author: "", content: "" });
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{comment.author}</h3>
                  <time
                    className="text-sm text-gray-500"
                    dateTime={comment.createdAt}
                  >
                    {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
                    {comment.updatedAt && (
                      <span className="text-gray-500 text-sm ml-2">
                        (edited{" "}
                        {format(
                          new Date(comment.updatedAt),
                          "MMM d, yyyy h:mm a"
                        )}
                        )
                      </span>
                    )}
                  </time>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingComment(comment);
                      setNewComment({
                        author: comment.author,
                        content: comment.content,
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    title="Edit comment"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </article>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No comments yet.</p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
