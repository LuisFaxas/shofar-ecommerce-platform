/**
 * PointerVarsProvider Component
 * Work Order 2.5.REBOOT
 *
 * Global provider for pointer tracking effects
 * Enables reactive UI animations throughout the application
 */

'use client';

import React from 'react';
import { usePointerVars } from '@/hooks/usePointerVars';

export interface PointerVarsProviderProps {
  children: React.ReactNode;
  /** Enable/disable pointer tracking */
  enabled?: boolean;
  /** Throttle updates to this many ms (defaults to 16 for 60fps) */
  throttle?: number;
  /** Update spotlight position variables */
  updateSpotlight?: boolean;
  /** Update glow position variables */
  updateGlow?: boolean;
  /** Update rotation angle for rainbow effects */
  updateAngle?: boolean;
}

/**
 * Provider component that enables pointer tracking effects globally
 * Wraps the application to provide reactive UI animations
 */
export function PointerVarsProvider({
  children,
  enabled = true,
  throttle = 16,
  updateSpotlight = true,
  updateGlow = true,
  updateAngle = true
}: PointerVarsProviderProps) {
  // Initialize pointer tracking for the entire document
  usePointerVars({
    element: null, // null means document-wide tracking
    throttle,
    updateSpotlight,
    updateGlow,
    updateAngle,
    enabled
  });

  return <>{children}</>;
}

export default PointerVarsProvider;