"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const textRef = useRef<HTMLDivElement>(null);
  const revealContainerRef = useRef<HTMLDivElement>(null);
  const [activeReveal, setActiveReveal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        setLastScrollY(scrollY);

        // Read from DOM once
        const containerRect = revealContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.scrollY;
        const viewportHeight = window.innerHeight;
        const distanceFromViewport = containerTop - scrollY;

        // Update container visibility state
        const isActive = distanceFromViewport < viewportHeight;
        if (isActive !== activeReveal) {
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
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isMobile, activeReveal]); // Include activeReveal to avoid stale closure issues

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
    <main className="min-h-screen flex flex-col pt-6 sm:pt-8 md:pt-12 px-4 sm:px-8 md:px-12">
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

      {/* Three images in a row with border top and bottom */}
      <div className="w-full mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative pb-8">
        {/* Top full-width dotted line container */}
        <div className="full-width-border"></div>

        {/* Image grid container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {/* UNC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/unc.png"
                alt="UNC Chapel Hill campus"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">CH</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
            </div>
          </div>

          {/* Golden Gate Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/goldengate.png"
                alt="Golden Gate Bridge above the clouds"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">SF</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
            </div>
          </div>

          {/* NYC Image */}
          <div className="relative flex flex-col">
            <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-sm location-image-container">
              <Image
                src="/nyc.png"
                alt="New York City skyline"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="location-hover-text">NYC</div>
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                       radial-gradient(ellipse at center, transparent 90%, var(--background) 100%),
                       linear-gradient(to top, var(--background), transparent 10%, transparent 90%, var(--background)),
                       linear-gradient(to left, var(--background), transparent 10%, transparent 90%, var(--background))
                     `
                }}>
              </div>
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
      </div>
    </main>
  );
}
