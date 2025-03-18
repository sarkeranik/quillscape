'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

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
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postSlug=${postSlug}`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = editingComment 
        ? `/api/comments?id=${editingComment.id}&postSlug=${postSlug}`
        : '/api/comments';

      const response = await fetch(url, {
        method: editingComment ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        },
        body: JSON.stringify({
          postSlug,
          ...newComment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit comment');
      }

      setNewComment({ author: '', content: '' });
      setEditingComment(null);
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments?id=${commentId}&postSlug=${postSlug}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || ''
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="author"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="content"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : editingComment ? 'Update Comment' : 'Post Comment'}
          </button>

          {editingComment && (
            <button
              type="button"
              onClick={() => {
                setEditingComment(null);
                setNewComment({ author: '', content: '' });
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <article key={comment.id} className="border-b pb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{comment.author}</h3>
                <time className="text-sm text-gray-500" dateTime={comment.createdAt}>
                  {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                  {comment.updatedAt && (
                    <span className="text-gray-500 text-sm ml-2">
                      (edited {format(new Date(comment.updatedAt), 'MMM d, yyyy h:mm a')})
                    </span>
                  )}
                </time>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setEditingComment(comment);
                    setNewComment({
                      author: comment.author,
                      content: comment.content,
                    });
                  }}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </article>
        ))}

        {comments.length === 0 && (
          <p className="text-gray-500 text-center italic">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </section>
  );
}