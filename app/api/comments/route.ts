import { NextRequest, NextResponse } from "next/server";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "@/lib/comments";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return NextResponse.json(
      { error: "Post slug is required" },
      { status: 400 }
    );
  }

  try {
    const comments = await getComments(postSlug);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, content } = body;

    if (!postSlug || !author || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newComment = await addComment({ postSlug, author, content });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentId = searchParams.get("id");
    const postSlug = searchParams.get("postSlug");

    if (!commentId || !postSlug) {
      return NextResponse.json(
        { error: "Comment ID and post slug are required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { author, content } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedComment = await updateComment(postSlug, commentId, {
      author,
      content,
    });
    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const postSlug = searchParams.get("postSlug");

  if (!id || !postSlug) {
    return NextResponse.json(
      { error: "Comment ID and post slug are required" },
      { status: 400 }
    );
  }

  try {
    await deleteComment(postSlug, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
