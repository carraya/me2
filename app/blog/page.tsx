"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

// Mock blog post data - you would replace this with your actual data source
const blogPosts = [
  {
    id: 1,
    slug: "introduction",
    title: "Introduction",
    date: "November 30, 2024",
    excerpt: "An introduction to my journey and story.",
    coverImage: "/introduction.png"
  },
  {
    id: 2,
    slug: "prelude",
    title: "Prelude",
    date: "February 11, 2025",
    excerpt: "A prelude to my journey and story.",
    coverImage: "/prelude.png"
  },
  {
    id: 3,
    slug: "act-one",
    title: "Act I",
    date: "March 2025",
    excerpt: "The first act of my journey and story.",
    coverImage: "/act-one.png"
  },
];

export default function BlogPage() {
  return (
    <main className="flex flex-col pt-6 sm:pt-8 md:pt-12">
      <div className="w-full px-4 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-playfair)] leading-tight sm:leading-tight md:leading-relaxed max-w-[90%] md:max-w-[80%] lg:max-w-[70%] font-medium">
          <span className="font-extrabold">Blog</span>
        </h1>

        <p className="mt-4 text-lg text-[#353534cc] max-w-3xl">
          Thoughts on my journey and story, and sometimes other things.
        </p>

        {/* Return to home link */}
        <div className="mt-8 sm:mt-10 md:mt-14">
          <Link
            href="/"
            className="inline-block px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>

      {/* Blog posts grid with top and bottom border */}
      <div className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative">
        {/* Top full-width dotted line container */}
        <div className="full-width-border"></div>

        {/* Blog post grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 relative">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`group writing-item ${(index + 1) % 3 === 0 ? 'md:border-r-0' : ''}`}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col h-full w-full">
                  {/* Optional: Add image preview */}
                  <div className="relative aspect-[3/2] mb-4 overflow-hidden w-full">
                    <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-col lg:flex-row lg:items-baseline lg:justify-between">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium group-hover:underline underline-offset-4 pr-2 lg:pr-4">
                        {post.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-[#353534aa] whitespace-nowrap mt-1 lg:mt-0">{post.date}</span>
                    </div>
                    <p className="mt-2 sm:mt-3 text-[#353534cc] text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-normal">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* Add placeholder cells if there are fewer than 3 blog posts */}
          {blogPosts.length < 3 && Array.from({ length: 3 - blogPosts.length }).map((_, index) => (
            <div key={`placeholder-${index}`} className="writing-item flex items-center justify-center">
              <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
                <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
              </div>
            </div>
          ))}

          {/* Add placeholder for 2-column layout when needed */}
          {blogPosts.length === 3 && (
            <div className="writing-item hidden sm:flex md:hidden items-center justify-center">
              <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
                <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 