import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/contentful";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get filter parameters
    const author = searchParams.get("author");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "date"; // Default sort by date
    const order = searchParams.get("order") || "desc"; // Default order descending

    // Fetch all posts
    let posts = await getAllPosts();

    // Apply filters with null checks
    if (author) {
      posts = posts.filter(
        (post) => (post.author || "").toLowerCase() === author.toLowerCase()
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      posts = posts.filter(
        (post) => new Date(post.date || new Date()) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      posts = posts.filter((post) => new Date(post.date || new Date()) <= end);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(
        (post) =>
          (post.title || "").toLowerCase().includes(searchLower) ||
          (post.content || "").toLowerCase().includes(searchLower) ||
          (post.author || "").toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting with null checks
    posts.sort((a, b) => {
      let comparison = 0;

      switch (sort) {
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "author":
          comparison = (a.author || "").localeCompare(b.author || "");
          break;
        case "date":
        default:
          comparison =
            new Date(b.date || new Date()).getTime() -
            new Date(a.date || new Date()).getTime();
          break;
      }

      return order === "asc" ? comparison : -comparison;
    });

    // Return response with metadata
    return NextResponse.json({
      posts,
      meta: {
        total: posts.length,
        filters: {
          author: author || null,
          startDate: startDate || null,
          endDate: endDate || null,
          search: search || null,
        },
        sort: {
          field: sort,
          order,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
