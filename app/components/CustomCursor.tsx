"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface TrailSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
  id: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [trailSegments, setTrailSegments] = useState<TrailSegment[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default to true until we check

  // Refs for performance optimization
  const lastPointTimeRef = useRef(0);
  const lastPointPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const rotationFrameRef = useRef<number | null>(null);
  const segmentIdCounterRef = useRef(0);
  const trailSegmentsRef = useRef<TrailSegment[]>([]);
  const interactiveElementsRef = useRef<Element[]>([]);
  const prevAngleRef = useRef<number | null>(null);

  // Trail settings
  const trailLifetime = 3000; // 3 seconds in milliseconds
  const pointInterval = 30; // Create points every 30ms for smooth trails
  const maxSegments = 20; // Limit maximum number of segments

  // Check if we're on a touch device - Run once on mount
  useEffect(() => {
    // Detect touch device
    const isTouch = 'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    setIsTouchDevice(isTouch);

    // Only setup mouse tracking if not a touch device
    if (isTouch) {
      return;
    }

    document.body.style.cursor = 'none';
  }, []); // Empty dependency array - run once on mount

  // Update ref whenever trail segments change
  useEffect(() => {
    trailSegmentsRef.current = trailSegments;
  }, [trailSegments]);

  // Memoized handle hover function to prevent recreating on each render
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Memoized handler for interactivity - separated from useEffect
  const setupInteractiveElements = useCallback(() => {
    // First, clean up any existing event listeners
    interactiveElementsRef.current.forEach(el => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    });

    // Get interactive elements and store in ref
    const elements = document.querySelectorAll("a, button, input, select, textarea");
    interactiveElementsRef.current = Array.from(elements);

    // Add new event listeners
    interactiveElementsRef.current.forEach(el => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });
  }, [handleMouseEnter, handleMouseLeave]);

  // Memoized handler for mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
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

  // Main setup effect - only runs when dependencies actually change
  useEffect(() => {
    // If we're on a touch device, don't set up the cursor at all
    if (isTouchDevice) {
      return;
    }

    // Set up interactive elements
    setupInteractiveElements();

    // Initialize event listeners
    document.addEventListener("mousemove", handleMouseMove);

    // Start cleanup trail animation frame
    requestAnimationFrame(cleanupTrail);

    // Cleanup function - remove all event listeners
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);

      // Remove all interactive element listeners
      interactiveElementsRef.current.forEach(el => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });

      // Cancel any animation frames
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (rotationFrameRef.current) {
        cancelAnimationFrame(rotationFrameRef.current);
        rotationFrameRef.current = null;
      }
    };
  }, [isTouchDevice, handleMouseMove, cleanupTrail, setupInteractiveElements, handleMouseEnter, handleMouseLeave]);

  // Separate effect for handling rotation updates
  useEffect(() => {
    if (isTouchDevice || !visible) return;

    // Helper function to normalize angle between -180 and 180
    const normalizeAngle = (angle: number): number => {
      // Convert to range -180 to 180
      while (angle > 180) angle -= 360;
      while (angle < -180) angle += 360;
      return angle;
    };

    // Calculate rotation based on movement with smoothing
    const updateRotation = () => {
      if (position.x !== prevPosition.x || position.y !== prevPosition.y) {
        const deltaX = position.x - prevPosition.x;
        const deltaY = position.y - prevPosition.y;

        // Increase threshold for bottom-left detection to reduce jitter
        const isBottomLeft = deltaX < 0 && deltaY > 0;
        const movementThreshold = isBottomLeft ? 2 : 0.5;

        // Only update rotation if there's significant movement
        if (Math.abs(deltaX) > movementThreshold || Math.abs(deltaY) > movementThreshold) {
          // Calculate new angle
          const newAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

          // Apply smoothing
          if (prevAngleRef.current !== null) {
            // Get normalized angles to handle -180/180 boundary correctly
            const normalizedPrevAngle = normalizeAngle(prevAngleRef.current);
            const normalizedNewAngle = normalizeAngle(newAngle);

            // Calculate the smallest delta between angles
            let angleDelta = normalizedNewAngle - normalizedPrevAngle;
            if (Math.abs(angleDelta) > 180) {
              // Take the shortest path
              angleDelta = angleDelta > 0 ? angleDelta - 360 : angleDelta + 360;
            }

            // Limit maximum rotation per frame (prevents spinning)
            const maxRotationPerFrame = 15; // max degrees change per frame
            const limitedDelta = Math.max(-maxRotationPerFrame,
              Math.min(maxRotationPerFrame, angleDelta));

            // Apply limited change
            const smoothedAngle = normalizeAngle(normalizedPrevAngle + limitedDelta);
            setRotation(smoothedAngle);
            prevAngleRef.current = smoothedAngle;
          } else {
            // First angle calculation
            setRotation(newAngle);
            prevAngleRef.current = newAngle;
          }

          setPrevPosition({ x: position.x, y: position.y });
        }
      }

      rotationFrameRef.current = requestAnimationFrame(updateRotation);
    };

    // Start rotation animation frame
    rotationFrameRef.current = requestAnimationFrame(updateRotation);

    return () => {
      if (rotationFrameRef.current) {
        cancelAnimationFrame(rotationFrameRef.current);
        rotationFrameRef.current = null;
      }
    };
  }, [isTouchDevice, visible, position, prevPosition]);

  // If it's a touch device or cursor isn't visible, don't render anything
  if (isTouchDevice || !visible) return null;

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
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transition: "transform 0.08s ease-out",
          width: "32px",
          height: "32px",
          transformOrigin: "center center",
        }}
        data-hovering={isHovering ? "true" : "false"}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="2,2 22,12 2,22 8,12" fill="white" stroke="#353534" strokeWidth="1.2" />
          <line x1="16" y1="12" x2="8" y2="12" stroke="#353534" strokeWidth="1.2" />
        </svg>
      </div>
    </>
  );
} 