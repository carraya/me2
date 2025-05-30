"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const textRef = useRef<HTMLDivElement>(null);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const [activeReveal, setActiveReveal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Function to adjust container height based on content and screen size
  const adjustContainerHeight = () => {
    if (!revealContainerRef.current || !textRef.current) return;

    const isMobileView = window.innerWidth < 640;
    setIsMobile(isMobileView);

    // Calculate the appropriate height multiplier based on screen size
    const heightMultiplier = isMobileView ? 2 : 3;

    // Set the container height dynamically
    revealContainerRef.current.style.height = `${heightMultiplier * 100}vh`;
  };

  useEffect(() => {
    const revealContainer = revealContainerRef.current;
    const textElement = textRef.current;

    if (!revealContainer || !textElement) return;

    // Adjust container height initially and on resize
    adjustContainerHeight();

    // Get all characters that need to be revealed and cache them
    const chars = Array.from(textElement.querySelectorAll('.reveal-char'));
    const totalChars = chars.length;

    // For performance optimization
    let ticking = false;
    let lastRevealProgress = -1; // Track last progress to avoid unnecessary DOM updates
    let animationFrameId: number | null = null;

    const updateCharacterVisibility = (progress: number) => {
      // Only update DOM if progress has changed significantly
      if (Math.abs(progress - lastRevealProgress) < 0.001) return;

      const charsToReveal = Math.floor(totalChars * progress);

      // Batch DOM operations for better performance
      for (let i = 0; i < totalChars; i++) {
        if (i < charsToReveal) {
          if (!chars[i].classList.contains('visible')) {
            chars[i].classList.add('visible');
          }
        } else if (chars[i].classList.contains('visible')) {
          chars[i].classList.remove('visible');
        }
      }

      lastRevealProgress = progress;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Read from DOM once
        const containerRect = revealContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const viewportHeight = window.innerHeight;
        const distanceFromViewport = containerTop - scrollY;

        // Update container visibility state - but skip during initial page load
        const isActive = distanceFromViewport < viewportHeight;
        if (isActive !== activeReveal && !isInitialLoad) {
          setActiveReveal(isActive);
        }

        // Calculate reveal progress
        let revealProgress = 0;
        const revealThreshold = isMobile ? viewportHeight * 0.5 : viewportHeight * 0.3;
        const scrollDistance = isMobile ? containerRect.height * 0.5 : containerRect.height * 0.6;

        if (containerRect.top <= revealThreshold) {
          revealProgress = Math.min(1, Math.max(0,
            (revealThreshold - containerRect.top) / scrollDistance
          ));
        }

        // Update character visibility
        updateCharacterVisibility(revealProgress);

        ticking = false;
      });
    };

    // Debounced resize handler
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        adjustContainerHeight();
        handleScroll();
      }, 100); // Debounce to avoid excessive recalculations
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial setup
    chars.forEach(char => char.classList.remove('visible'));

    // Set initial state based on actual scroll position without affecting it
    setTimeout(() => {
      handleScroll();
      setIsInitialLoad(false); // Mark initial load complete after first scroll handling
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile, activeReveal, isInitialLoad]); // Added isInitialLoad to deps

  // Function to prepare text by wrapping each word in a span
  const prepareText = (text: string) => {
    // Split by words rather than characters for better control
    const words = text.split(/\s+/);

    return words.map((word, wordIndex) => {
      // Create a span for each word to keep it together
      return (
        <span key={`word-${wordIndex}`} className="reveal-word">
          {/* Wrap each character in the word in its own span */}
          {word.split('').map((char, charIndex) => (
            <span
              key={`char-${wordIndex}-${charIndex}`}
              className="reveal-char"
              data-index={wordIndex * 100 + charIndex} // Unique index for reveal order
            >
              {char}
            </span>
          ))}
          {/* Add space after each word except the last */}
          {wordIndex < words.length - 1 && (
            <span className="reveal-char reveal-space">&nbsp;</span>
          )}
        </span>
      );
    });
  };

  return (
    <main className="min-h-screen flex flex-col pt-6 sm:pt-8 md:pt-12">
      <div className="w-full px-4 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-[family-name:var(--font-playfair)] leading-tight sm:leading-tight md:leading-relaxed max-w-[90%] md:max-w-[80%] lg:max-w-[70%] font-medium">
          <span className="font-extrabold">Chris</span> is a Morehead-Cain scholar building the <em>future of living</em> in San Francisco and New York.
        </h1>


        {/* Contact buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 md:mt-14 self-start">
          <a
            href="mailto:arraya.christopher@gmail.com"
            className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            CONTACT ME
          </a>
          <a
            href="/blog"
            className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            BLOG
          </a>
          <a
            href="https://x.com/cjarrayadev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            TWITTER
          </a>
          <a
            href="https://www.linkedin.com/in/cjarraya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-4 sm:px-5 md:px-7 py-2 sm:py-2.5 md:py-3 border border-dashed border-[#35353433] hover:bg-[#35353408] text-center font-medium tracking-wider text-[#353534bb] text-sm sm:text-base transition-all duration-300 hover:-translate-y-0.5"
          >
            LINKEDIN
          </a>
        </div>
      </div>

      {/* Three images in a row with border top and bottom */}
      <div className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative px-0">
        {/* Top full-width dotted line container */}
        <div className="full-width-border"></div>

        {/* Image grid container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* UNC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden location-image-container">
              <Image
                src="/unc.png"
                alt="UNC Chapel Hill campus"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">CH</div>
            </div>
          </div>

          {/* Golden Gate Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden location-image-container">
              <Image
                src="/goldengate.png"
                alt="Golden Gate Bridge above the clouds"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">SF</div>
            </div>
          </div>

          {/* NYC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square md:aspect-[4/3] overflow-hidden location-image-container">
              <Image
                src="/nyc.png"
                alt="New York City skyline"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">NYC</div>
            </div>
          </div>
        </div>

        {/* Bottom full-width dotted line container */}
        <div className="full-width-border bottom-0"></div>
      </div>

      {/* Scroll Reveal Text Section */}
      <div
        ref={revealContainerRef}
        className="scroll-reveal-container mt-16 sm:mt-20 md:mt-24"
      >
        <div
          className={`scroll-reveal-sticky ${activeReveal ? 'scroll-reveal-active' : ''}`}
        >
          <div
            ref={textRef}
            className="scroll-reveal-text max-w-4xl w-[100%] sm:w-[100%] md:w-[100%] mx-auto px-4 sm:px-6 md:px-8"
          >
            {prepareText(`In April of 2024, I decided to take a year off of school to go fulltime 
            into building and scaling a startup. In the past, I attended the top high school in the country 
            and was awarded the oldest merit scholarship in the nation (as a first-generation college student), 
            won Best AI Hack at the largest collegiate hackathon, and advised countries worldwide on AI 
            in criminal justice and society.

            Now, I'm trying to build the future of living. A residence that lives, breathes, and provides for you.`)}
          </div>
        </div>
        <div className="full-width-border bottom-0"></div>
      </div>

      {/* Mini Story Section */}
      <div className="w-full mt-16 sm:mt-20 md:mt-24 lg:mt-28 relative">
        <div className="full-width-border bottom-0"></div>
        {/* Philosopher Story - Image Right */}
        <div className="flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              Back in the era of Socrates and Plato, philosophy wasn't a luxury—it was a discipline rooted in time. Time to think deeply. To question assumptions. To imagine futures no one else could yet see.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              Today, that kind of time still exists—but it's mostly reserved for the powerful. The ones who aren't caught in the cycle of reacting, but instead get to predict, plan, and build what comes next.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534]">
              They don't wait for the future. They shape it in advance.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] max-w-[500px]">
              <Image
                src="/philosopher.png"
                alt="Ancient philosopher illustration"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brain Story - Image Left */}
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] max-w-[500px]">
              <Image
                src="/brain.png"
                alt="Human brain illustration"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              Spend time around founders, visionaries, or the truly wealthy, and you'll notice something: they think in decades, not days.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              Their greatest asset isn't capital—it's cognitive space. The ability to zoom out, to place bets on long arcs, to think clearly without noise.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534]">
              And increasingly, that thinking leads to one conclusion:
              In the AI economy, ownership is everything.
            </p>
          </div>
        </div>

        {/* Clock Story - Image Right */}
        <div className="flex flex-col-reverse md:flex-row">
          <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              As automation replaces tasks and decisions, labor loses leverage. But equity doesn't.
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534] mb-4">
              In a world where AI builds, decides, and scales faster than any human ever could, the real question becomes:
              What do you own?
            </p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-[#353534]">
              If more of us had the time to ask that question—and the space to act on the answer—maybe we wouldn't just keep up with the future.
              Maybe we'd lead it.
            </p>
          </div>
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] max-w-[500px]">
              <Image
                src="/clock.png"
                alt="Vintage clock illustration"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

      </div>

      {/* Writings Section */}
      <div className="w-full mt-8 sm:mt-10 md:mt-12">
        <div className="w-full px-4 sm:px-8 md:px-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-medium ">
            <span className="font-extrabold">Writings</span>
          </h2>
        </div>
        <div className="w-full mt-8 sm:mt-10 md:mt-12 relative">
        </div>
        {/* Writing items container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* Writing Item 1 */}
          <div className="group writing-item">
            <a href="/blog/introduction" className="block">
              <div className="flex flex-col h-full">
                {/* Add image preview */}
                <div className="relative aspect-[3/2] mb-4 overflow-hidden w-full">
                  <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
                    <Image src="/introduction.png" alt="Introduction" fill className="object-cover" />
                  </div>
                </div>
                <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-col lg:flex-row lg:items-baseline lg:justify-between">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium group-hover:underline underline-offset-4 pr-2 lg:pr-4">
                      Introduction
                    </h3>
                    <span className="text-xs sm:text-sm text-[#353534aa] whitespace-nowrap mt-1 lg:mt-0">November 30, 2024</span>
                  </div>
                  <p className="mt-2 sm:mt-3 text-[#353534cc] text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-normal">
                    An introduction to my journey and story.
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Writing Item 2 */}
          <div className="group writing-item">
            <a href="/blog/prelude" className="block">
              <div className="flex flex-col h-full">
                {/* Add image preview */}
                <div className="relative aspect-[3/2] mb-4 overflow-hidden w-full">
                  <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
                    <Image src="/prelude.png" alt="Prelude" fill className="object-cover" />
                  </div>
                </div>
                <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-col lg:flex-row lg:items-baseline lg:justify-between">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium group-hover:underline underline-offset-4 pr-2 lg:pr-4">
                      Prelude
                    </h3>
                    <span className="text-xs sm:text-sm text-[#353534aa] whitespace-nowrap mt-1 lg:mt-0">February 11, 2025</span>
                  </div>
                  <p className="mt-2 sm:mt-3 text-[#353534cc] text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-normal">
                    A prelude to my journey and story.
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Writing Item 3 */}
          <div className="group writing-item">
            <a href="/blog/act-one" className="block">
              <div className="flex flex-col h-full">
                {/* Add image preview */}
                <div className="relative aspect-[3/2] mb-4 overflow-hidden w-full">
                  <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
                    <Image src="/act-one.png" alt="Act I" fill className="object-cover" />
                  </div>
                </div>
                <div className="p-3 sm:p-5 md:p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-col lg:flex-row lg:items-baseline lg:justify-between">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium group-hover:underline underline-offset-4 pr-2 lg:pr-4">
                      Act I
                    </h3>
                    <span className="text-xs sm:text-sm text-[#353534aa] whitespace-nowrap mt-1 lg:mt-0">March 2025</span>
                  </div>
                  <p className="mt-2 sm:mt-3 text-[#353534cc] text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 flex-grow leading-snug sm:leading-normal">
                    The first act of my journey and story.
                  </p>
                </div>
              </div>
            </a>
          </div>

          {/* Add placeholder for 2-column layout */}
          <div className="writing-item hidden sm:flex md:hidden items-center justify-center">
            <div className="p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center h-full">
              <p className="text-[#35353466] text-xs sm:text-sm md:text-base italic">More soon...</p>
            </div>
          </div>
        </div>
      </div>
    </main >
  );
}
