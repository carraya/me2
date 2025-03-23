"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TrailSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
  id: number; // Add unique ID for more stable keys
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trailSegments, setTrailSegments] = useState<TrailSegment[]>([]);

  // Refs for performance optimization
  const lastPointTimeRef = useRef(0);
  const lastPointPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const segmentIdCounterRef = useRef(0); // Counter for unique IDs
  const trailSegmentsRef = useRef<TrailSegment[]>([]); // Reference to current segments

  // Trail settings - optimized
  const trailLifetime = 3000; // 3 seconds in milliseconds
  const pointInterval = 30; // Create points every 30ms for smooth trails
  const maxSegments = 20; // Limit maximum number of segments

  // Update ref whenever state changes
  useEffect(() => {
    trailSegmentsRef.current = trailSegments;
  }, [trailSegments]);

  // Memoized handler for mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    // Use clientX/clientY for consistent positioning with fixed elements
    const newPosition = { x: e.clientX, y: e.clientY };

    // Always update position for cursor
    setPosition(newPosition);
    setVisible(true);

    // Add trail segments at specified intervals
    if (now - lastPointTimeRef.current > pointInterval) {
      // Initialize last point position if it's the first point
      if (lastPointPositionRef.current.x === 0 && lastPointPositionRef.current.y === 0) {
        lastPointPositionRef.current = newPosition;
        lastPointTimeRef.current = now;
        return;
      }

      // Calculate distance moved
      const distMoved = Math.sqrt(
        Math.pow(newPosition.x - lastPointPositionRef.current.x, 2) +
        Math.pow(newPosition.y - lastPointPositionRef.current.y, 2)
      );

      // Only create a segment if there was minimal movement
      if (distMoved > 2) {
        // Create new segment with unique ID
        const newSegment = {
          startX: lastPointPositionRef.current.x,
          startY: lastPointPositionRef.current.y,
          endX: newPosition.x,
          endY: newPosition.y,
          timestamp: now,
          id: segmentIdCounterRef.current++
        };

        // Update state with new segment
        setTrailSegments(currentSegments => {
          // Add new segment and limit total count
          const updatedSegments = [...currentSegments, newSegment];
          return updatedSegments.slice(-maxSegments); // Keep only most recent segments
        });

        // Update last point position and time
        lastPointPositionRef.current = newPosition;
        lastPointTimeRef.current = now;
      }
    }
  }, [pointInterval]);

  // Improved cleanup function using requestAnimationFrame and refs
  const cleanupTrail = useCallback(() => {
    const now = Date.now();

    // Use the ref for consistent cleanup
    const currentSegments = trailSegmentsRef.current;
    const validSegments = currentSegments.filter(segment => {
      const age = now - segment.timestamp;
      return age < trailLifetime;
    });

    // Only update state if segments actually changed
    if (validSegments.length !== currentSegments.length) {
      setTrailSegments(validSegments);
    }

    // Continue the animation frame loop
    animationFrameRef.current = requestAnimationFrame(cleanupTrail);
  }, [trailLifetime]);

  useEffect(() => {
    // Create cursor SVG
    const paperAirplaneSVG = `
      <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.20308 1.04312C1.00481 0.954998 0.772341 1.0048 0.627577 1.16641C0.482813 1.32802 0.458794 1.56455 0.568117 1.75196L3.92115 7.50002L0.568117 13.2481C0.458794 13.4355 0.482813 13.672 0.627577 13.8336C0.772341 13.9952 1.00481 14.045 1.20308 13.9569L14.7031 7.95693C14.8836 7.87668 15 7.69762 15 7.50002C15 7.30243 14.8836 7.12337 14.7031 7.04312L1.20308 1.04312ZM4.84553 7.10002L2.21234 2.586L13.2689 7.50002L2.21234 12.414L4.84552 7.90002H9C9.22092 7.90002 9.4 7.72094 9.4 7.50002C9.4 7.27911 9.22092 7.10002 9 7.10002H4.84553Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" stroke="currentColor" stroke-width="0.2"></path></svg>
    `;

    const cursor = document.getElementById("paper-airplane-cursor");
    if (cursor) {
      cursor.innerHTML = paperAirplaneSVG;
    }

    // Handle interactivity on elements
    const handleInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll("a, button, input, select, textarea");

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          setIsHovering(true);
        });

        el.addEventListener("mouseleave", () => {
          setIsHovering(false);
        });
      });
    };

    // Calculate rotation based on movement
    const updateRotation = () => {
      if (position.x !== prevPosition.x || position.y !== prevPosition.y) {
        const deltaX = position.x - prevPosition.x;
        const deltaY = position.y - prevPosition.y;

        // Only update rotation if there's significant movement
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          setRotation(angle);
          setPrevPosition({ x: position.x, y: position.y });
        }
      }

      requestAnimationFrame(updateRotation);
    };

    // Initialize event listeners
    document.addEventListener("mousemove", handleMouseMove);
    handleInteractiveElements();

    // Start the animation frame loop for cleanup
    animationFrameRef.current = requestAnimationFrame(cleanupTrail);
    requestAnimationFrame(updateRotation);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, cleanupTrail, position, prevPosition]);

  if (!visible) return null;

  return (
    <>
      {/* Trail segments - with optimized rendering */}
      {trailSegments.map((segment) => {
        const age = Date.now() - segment.timestamp;

        // Skip rendering segments that are too old
        if (age >= trailLifetime) return null;

        const opacity = 1 - age / trailLifetime;

        // Skip rendering segments that are almost invisible
        if (opacity < 0.05) return null;

        // Pre-calculate values for better performance
        const dx = segment.endX - segment.startX;
        const dy = segment.endY - segment.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <div
            key={segment.id}
            className="trail-segment"
            style={{
              left: `${segment.startX}px`,
              top: `${segment.startY}px`,
              width: `${length}px`,
              opacity: opacity,
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'left center',
              position: 'fixed', // Use fixed positioning to match cursor
            }}
          />
        );
      })}

      {/* Cursor */}
      <div
        id="paper-airplane-cursor"
        className="fixed pointer-events-none z-[9999] text-[#353534]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transition: "transform 0.1s ease",
        }}
        data-hovering={isHovering ? "true" : "false"}
      ></div>
    </>
  );
} 