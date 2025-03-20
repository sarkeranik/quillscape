import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/contentful";
import {
  isValid,
  parseISO,
  startOfDay,
  endOfDay,
  compareAsc,
  compareDesc,
} from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim();
    const author = searchParams.get("author")?.trim();
    const startDate = searchParams.get("startDate")?.trim();
    const endDate = searchParams.get("endDate")?.trim();

    // Fetch all posts
    let posts = await getAllPosts();

    // Apply filters
    if (search || author || startDate || endDate) {
      posts = posts.filter((post) => {
        let matches = true;

        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          const postTitle = (post.title || "").toLowerCase().trim();
          const postContent = (post.content || "").toLowerCase().trim();
          const postAuthor = (post.author || "").toLowerCase().trim();

          matches =
            matches &&
            (postTitle.includes(searchLower) ||
              postContent.includes(searchLower) ||
              postAuthor.includes(searchLower));
        }

        // Author filter
        if (author && matches) {
          const authorLower = author.toLowerCase();
          const postAuthor = post.author.toLowerCase().trim();
          matches = postAuthor === authorLower;
        }

        // Date range filter
        if (matches && (startDate || endDate)) {
          try {
            const postDate = parseISO(post.date);

            if (startDate && endDate) {
              const start = startOfDay(parseISO(startDate));
              const end = endOfDay(parseISO(endDate));

              if (isValid(start) && isValid(end)) {
                matches =
                  compareAsc(postDate, start) >= 0 &&
                  compareDesc(postDate, end) >= 0;
              }
            } else if (startDate) {
              const start = startOfDay(parseISO(startDate));
              if (isValid(start)) {
                matches = compareAsc(postDate, start) >= 0;
              }
            } else if (endDate) {
              const end = endOfDay(parseISO(endDate));
              if (isValid(end)) {
                matches = compareDesc(postDate, end) >= 0;
              }
            }
          } catch (error) {
            console.error("Date parsing error:", error);
            matches = false;
          }
        }

        return matches;
      });
    }

    // Return response with metadata
    return NextResponse.json({
      posts,
      meta: {
        total: posts.length,
        filters: {
          search: search || null,
          author: author || null,
          startDate: startDate || null,
          endDate: endDate || null,
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
