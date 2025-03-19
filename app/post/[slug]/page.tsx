import BlogPost from '@/components/BlogPost';
import { getAllPosts, getPostBySlug } from '@/lib/contentful';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Suspense fallback={<Loading />}>
        <BlogPost post={post} />
      </Suspense>
    </div>
  );
}