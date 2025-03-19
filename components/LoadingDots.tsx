"use client";

export default function LoadingDots() {
  return (
    <div className="flex space-x-1 items-center">
      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
}
