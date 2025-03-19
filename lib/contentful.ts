// @ts-nocheck
import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: "master",
});

export interface BlogPost {
  title: string;
  slug: string;
  author: string;
  date: string;
  content: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const response = await client.getEntries({
    content_type: "blogPost",
    order: "-fields.date",
  });

  return response.items.map((item: any) => ({
    title: item.fields.title,
    slug: item.fields.slug,
    author: item.fields.author,
    date: item.fields.date,
    content: item.fields.content,
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  if (!response.items.length) {
    return null;
  }

  const item = response.items[0];
  return {
    title: item.fields.title,
    slug: item.fields.slug,
    author: item.fields.author,
    date: item.fields.date,
    content: item.fields.content,
  };
}
