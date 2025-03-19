'use client';

export default function BlogPostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
      
      <div className="mb-12">
        <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-4"></div>
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-5 bg-gray-200 rounded w-5"></div>
          <div className="h-5 bg-gray-200 rounded w-40"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  );
}