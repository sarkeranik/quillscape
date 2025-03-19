import type { BlogPost } from "./contentful";

interface PostsResponse {
  posts: BlogPost[];
  meta: {
    total: number;
    filters: {
      author: string | null;
      startDate: string | null;
      endDate: string | null;
      search: string | null;
    };
    sort: {
      field: string;
      order: string;
    };
  };
}

export async function getPosts(search?: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/posts?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        next: {
          revalidate: 60, // Revalidate every minute
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data: PostsResponse = await response.json();
    return data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
