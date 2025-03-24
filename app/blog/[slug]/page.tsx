"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Mock blog post data - you would replace this with your actual data fetching logic
const blogPosts = [
  {
    id: 1,
    slug: "introduction",
    title: "Introduction",
    date: "November 30, 2024",
    excerpt: "An introduction to my journey and story.",
    content: `
      <p>
      When I was in first grade, my dad drove me to a high school robotics
      competition 30 minutes away. My mom is the one who made it happen--she
      insisted on it, even though neither of them knew anyone there or what was
      going on. We sat on the bleachers and watched for hours. Then we left.
    </p>

    <p>
      I don't remember much about the event. I don't even remember feeling
      particularly interested. I do know it was unlike anything I had seen
      before--and something that I wouldn't have seen if it weren't for the
      <b>purposeful exposure</b>.
    </p>

    <p>
      Fast forward to my senior year of high school, when I was standing in the
      middle of a stadium where my team lost the world championship semi-finals
      of that same robotics league. That's the first time I recalled that
      coincidental trip my mom made me go on when I was 7 years old.
    </p>

    <p>
      My life has been shaped by <b>seeds planted by others</b>--seeds that grew
      into a forest of opportunities, nurtured by those who believed in me.
      Moments of <b>exposure, curiosity, and discomfort</b>--often small and
      fleeting--later sprouted into something much larger. These experiences
      shaped the way I approach every choice I make today.
    </p>

    <p>
      If my mom planted the first tree, it was my dad that watered it. Watching
      him work two jobs, often from early mornings until late nights, taught me
      the value of <b>persistence</b> and the lengths one must go to
      <b>create opportunity</b>. Growing up Latino in Woodbridge but exposed to
      opportunities and communities beyond it, I became acutely aware of the
      challenges that came with being part of a working-class, first-generation
      family. These early experiences, paired with the guidance of mentors and
      my own curiosity, shaped how I see the world:
      <b
        >as a set of systems that can be questioned, understood, and improved
        through deliberate effort</b
      >.
    </p>

    <p>
      This is the story of how those seeds grew, how they withstood storms, and
      how they've shaped the direction I'm headed now. It's a story about the
      <b
        >pursuit of knowledge, annoying persistence, and playing the long
        game</b
      >.
    </p>
    `,
    coverImage: "/introduction.png"
  },
  {
    id: 2,
    slug: "prelude",
    title: "Prelude",
    date: "February 11, 2025",
    excerpt: "A prelude to my journey and story.",
    content: `
      <p>My dad came to the U.S. as a kid from Bolivia, but only because my grandfather got here first. He (my abuelo) worked in restaurants—busboy, waiter, etc.—saving up to bring his family over legally. When my dad arrived, he started school in Virginia, learned English, and at 23, got a temp job at a transportation company. They hired him full-time.</p>

      <p>He never left that industry. When we needed more money after I was born, he built something on the side. A second job. Late nights, early mornings. He made it work because he had to.</p>

      <p>My mom grew up here, but her parents were born in Bolivia. She stayed home to raise me—not because it was easy, but because she believed it was the best way to keep me on track. No gaps in the schedule. No chance to slip. If I wasn't in school, I was home.</p>

      <p>We started in an apartment. Then my Abuelos' house. Then a townhouse. Now a house.</p>

      <p><b>I don't have to</b> build something out of struggle. <b>I don't have to</b> work two jobs or stay up past midnight. That's the difference. That's the foundation they gave me. And with that foundation, I <b>choose</b> to work as hard as I can.</p>

      <p>Before this is my story, <b>it's theirs.</b></p>
    `,
    coverImage: "/prelude.png"
  },
  {
    id: 3,
    slug: "act-one",
    title: "Act I",
    date: "March 2025",
    excerpt: "The first act of my journey and story.",
    content: `
      <p>Coming soon...</p>
    `,
    coverImage: "/act-one.png"
  },
];

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;

  // Find the post that matches the slug
  const post = blogPosts.find(post => post.slug === slug);

  // If no post is found, show a message
  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center pt-6 sm:pt-8 md:pt-12 px-4 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-playfair)] font-medium text-center">
          Post not found
        </h1>
        <p className="mt-4 text-[#353534cc] text-center">
          The blog post you're looking for doesn't exist.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-block px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
        >
          BACK TO BLOG
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col pt-6 sm:pt-8 md:pt-12">
      {/* Post header area */}
      <div className="w-full px-4 sm:px-8 md:px-12">
        <Link
          href="/blog"
          className="inline-block mb-8 px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
        >
          BACK TO BLOG
        </Link>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)] leading-tight sm:leading-tight md:leading-relaxed max-w-[90%] md:max-w-[80%] lg:max-w-[70%] font-medium">
          {post.title}
        </h1>

        <div className="mt-4 text-[#353534aa]">
          {post.date}
        </div>
      </div>

      {/* Featured image area with border */}
      <div className="w-full mt-12 sm:mt-16 relative">
        <div className="full-width-border"></div>

        <div className="relative aspect-[21/9] w-full max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center rounded-sm overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at center, transparent 70%, var(--background) 100%),
                  linear-gradient(to top, var(--background), transparent 10%, transparent 70%, var(--background)),
                  linear-gradient(to left, var(--background), transparent 10%, transparent 70%, var(--background))
                `
              }}>
            </div>
          </div>
        </div>

        <div className="full-width-border bottom-0"></div>
      </div>

      {/* Blog content */}
      <article className="w-full px-4 sm:px-8 md:px-12 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto prose prose-lg prose-slate">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      {/* Related posts section */}
      <div className="w-full mt-8 sm:mt-12 md:mt-16">

        <div className="w-full px-4 sm:px-8 md:px-12">
          <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-playfair)] font-medium mt-8 mb-6">
            Read More
          </h2>
        </div>
        <div className="w-full mt-8 sm:mt-10 md:mt-12 relative">
          <div className="full-width-border"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
          {/* Map available related posts */}
          {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
            <div key={relatedPost.id} className="group writing-item">
              <Link href={`/blog/${relatedPost.slug}`} className="block">
                <div className="flex flex-col h-full">
                  {/* Add image preview */}
                  <div className="relative aspect-[3/2] mb-4 overflow-hidden w-full">
                    <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
                      <Image src={relatedPost.coverImage} alt={relatedPost.title} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-col lg:flex-row lg:items-baseline lg:justify-between">
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium group-hover:underline underline-offset-4 pr-2 lg:pr-4">
                        {relatedPost.title}
                      </h3>
                      <span className="text-xs sm:text-sm text-[#353534aa] whitespace-nowrap mt-1 lg:mt-0">{relatedPost.date}</span>
                    </div>
                    <p className="mt-2 sm:mt-3 text-[#353534cc] text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-normal">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* Only add placeholder if needed to complete a row */}
          {/* 1 post needs a placeholder in 2-col layout (sm) */}
          {blogPosts.filter(p => p.id !== post.id).length === 1 && (
            <div className="writing-item hidden sm:block md:hidden">
              <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
                <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
              </div>
            </div>
          )}

          {/* 1 post needs 2 placeholders in 3-col layout (md+) */}
          {blogPosts.filter(p => p.id !== post.id).length === 1 && (
            <>
              <div className="writing-item hidden md:block">
                <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
                  <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
                </div>
              </div>
              <div className="writing-item hidden md:block">
                <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
                  <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
                </div>
              </div>
            </>
          )}

          {/* 2 posts need 1 placeholder in 3-col layout (md+) */}
          {blogPosts.filter(p => p.id !== post.id).length === 2 && (
            <div className="writing-item hidden md:block">
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