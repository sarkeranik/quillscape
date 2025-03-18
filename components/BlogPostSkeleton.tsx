'use client';

export default function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-pulse">
      <div className="h-10 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div className="flex space-x-2 mb-8">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="h-5 bg-gray-200 rounded w-5"></div>
        <div className="h-5 bg-gray-200 rounded w-40"></div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}