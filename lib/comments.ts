const commentsStore: Record<string, Comment[]> = {};

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export async function getComments(postSlug: string): Promise<Comment[]> {
  if (!postSlug) {
    throw new Error("Post slug is required");
  }
  return commentsStore[postSlug] || [];
}

export async function addComment(
  comment: Omit<Comment, "id" | "createdAt">
): Promise<Comment> {
  if (!comment.postSlug) {
    throw new Error("Post slug is required");
  }

  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  if (!commentsStore[comment.postSlug]) {
    commentsStore[comment.postSlug] = [];
  }

  commentsStore[comment.postSlug] = [
    newComment,
    ...commentsStore[comment.postSlug],
  ];

  return newComment;
}

export async function updateComment(
  postSlug: string,
  commentId: string,
  updates: Pick<Comment, "author" | "content">
): Promise<Comment> {
  if (!postSlug || !commentId) {
    throw new Error("Post slug and comment ID are required");
  }

  const comments = commentsStore[postSlug];
  if (!comments) {
    throw new Error("Post not found");
  }

  const commentIndex = comments.findIndex((c) => c.id === commentId);
  if (commentIndex === -1) {
    throw new Error("Comment not found");
  }

  const updatedComment: Comment = {
    ...comments[commentIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  comments[commentIndex] = updatedComment;
  commentsStore[postSlug] = comments;

  return updatedComment;
}

export async function deleteComment(
  postSlug: string,
  commentId: string
): Promise<void> {
  if (!postSlug || !commentId) {
    throw new Error("Post slug and comment ID are required");
  }

  if (commentsStore[postSlug]) {
    commentsStore[postSlug] = commentsStore[postSlug].filter(
      (comment) => comment.id !== commentId
    );
  }
}
