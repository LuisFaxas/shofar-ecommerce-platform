/**
 * usePointerVars Hook
 * Work Order 2.5.REBOOT
 *
 * Updates CSS variables based on pointer position for reactive UI effects
 * Used for spotlight tracking, glow effects, and interactive animations
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';

export interface PointerVarsOptions {
  /** Element to track pointer within (defaults to document) */
  element?: HTMLElement | null;
  /** Throttle updates to this many ms (defaults to 16 for 60fps) */
  throttle?: number;
  /** Update spotlight position variables */
  updateSpotlight?: boolean;
  /** Update glow position variables */
  updateGlow?: boolean;
  /** Update rotation angle for rainbow effects */
  updateAngle?: boolean;
  /** Enable/disable the hook */
  enabled?: boolean;
}

/**
 * Hook that tracks pointer position and updates CSS variables
 * for reactive UI effects like glows, spotlights, and gradients
 */
export function usePointerVars(options: PointerVarsOptions = {}) {
  const {
    element = null,
    throttle = 16, // 60fps
    updateSpotlight = true,
    updateGlow = true,
    updateAngle = true,
    enabled = true
  } = options;

  const frameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const angleRef = useRef<number>(0);

  const updateCSSVars = useCallback((e: MouseEvent | PointerEvent) => {
    const now = Date.now();

    // Throttle updates
    if (now - lastUpdateRef.current < throttle) {
      return;
    }

    lastUpdateRef.current = now;

    const target = element || document.documentElement;
    const rect = element ? element.getBoundingClientRect() : {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Calculate relative position within element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage positions
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Calculate distance from center (0-1)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const distX = Math.abs(x - centerX) / centerX;
    const distY = Math.abs(y - centerY) / centerY;
    const fromCenter = Math.min(Math.sqrt(distX * distX + distY * distY), 1);

    // Calculate angle from center
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);

    // Update CSS variables with requestAnimationFrame for smooth updates
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const root = document.documentElement;

      // Basic pointer position
      root.style.setProperty('--pointer-x', `${xPercent}%`);
      root.style.setProperty('--pointer-y', `${yPercent}%`);
      root.style.setProperty('--pointer-from-center', fromCenter.toFixed(2));

      // Glow position (for button effects)
      if (updateGlow) {
        root.style.setProperty('--glow-x', `${xPercent}%`);
        root.style.setProperty('--glow-y', `${yPercent}%`);
        root.style.setProperty('--glow-strength', (1 - fromCenter).toFixed(2));
      }

      // Spotlight position (for background effects)
      if (updateSpotlight) {
        root.style.setProperty('--sx', `${x}px`);
        root.style.setProperty('--sy', `${y}px`);
        // Adjust spotlight radius based on distance from center
        const spotlightRadius = 120 + (fromCenter * 80);
        root.style.setProperty('--sr', `${spotlightRadius}px`);
      }

      // Rainbow angle (for conic gradients)
      if (updateAngle) {
        // Smooth angle rotation based on position
        angleRef.current = angle + 180; // Normalize to 0-360
        root.style.setProperty('--angle', `${angleRef.current}deg`);
      }
    });
  }, [element, throttle, updateGlow, updateSpotlight, updateAngle]);

  const handlePointerLeave = useCallback(() => {
    // Reset to center when pointer leaves
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      const root = document.documentElement;
      root.style.setProperty('--pointer-x', '50%');
      root.style.setProperty('--pointer-y', '50%');
      root.style.setProperty('--pointer-from-center', '0.5');

      if (updateGlow) {
        root.style.setProperty('--glow-x', '50%');
        root.style.setProperty('--glow-y', '50%');
        root.style.setProperty('--glow-strength', '0.5');
      }

      if (updateSpotlight) {
        root.style.setProperty('--sx', '0px');
        root.style.setProperty('--sy', '0px');
        root.style.setProperty('--sr', '120px');
      }
    });
  }, [updateGlow, updateSpotlight]);

  useEffect(() => {
    if (!enabled) return;

    const target = element || document;

    // Use pointer events for better touch support
    target.addEventListener('pointermove', updateCSSVars as EventListener);
    target.addEventListener('pointerleave', handlePointerLeave as EventListener);

    // Fallback to mouse events for older browsers
    target.addEventListener('mousemove', updateCSSVars as EventListener);
    target.addEventListener('mouseleave', handlePointerLeave as EventListener);

    return () => {
      target.removeEventListener('pointermove', updateCSSVars as EventListener);
      target.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      target.removeEventListener('mousemove', updateCSSVars as EventListener);
      target.removeEventListener('mouseleave', handlePointerLeave as EventListener);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, element, updateCSSVars, handlePointerLeave]);

  // Initialize CSS variables on mount
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pointer-x', '50%');
    root.style.setProperty('--pointer-y', '50%');
    root.style.setProperty('--pointer-from-center', '0.5');
    root.style.setProperty('--glow-x', '50%');
    root.style.setProperty('--glow-y', '50%');
    root.style.setProperty('--glow-strength', '0.5');
    root.style.setProperty('--sx', '0px');
    root.style.setProperty('--sy', '0px');
    root.style.setProperty('--sr', '120px');
    root.style.setProperty('--angle', '0deg');
  }, []);
}

/**
 * Hook for tracking pointer within a specific element
 * Returns a ref to attach to the target element
 */
export function usePointerVarsRef<T extends HTMLElement>(
  options: Omit<PointerVarsOptions, 'element'> = {}
) {
  const ref = useRef<T>(null);

  usePointerVars({
    ...options,
    element: ref.current
  });

  return ref;
}

export default usePointerVars;