/**
 * Popover Component
 * Dropdown overlay for menus and selectors
 * Essential for navigation and form interactions
 */

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactElement;
  /** Popover content */
  children: React.ReactNode;
  /** Placement of popover */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  /** Offset from trigger */
  offset?: number;
  /** Close on click outside */
  closeOnClickOutside?: boolean;
  /** Close on ESC key */
  closeOnEsc?: boolean;
  /** Additional className */
  className?: string;
  /** Open state (controlled) */
  open?: boolean;
  /** On open change (controlled) */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Popover/Dropdown component for floating UI elements
 * Handles positioning, keyboard navigation, and click outside
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  offset = 8,
  closeOnClickOutside = true,
  closeOnEsc = true,
  className,
  open: controlledOpen,
  onOpenChange
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback((value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }
  }, [isControlled, onOpenChange]);

  // Calculate position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const { scrollX, scrollY } = window;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset + scrollY;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2 + scrollX;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset + scrollY;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2 + scrollX;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2 + scrollY;
        left = triggerRect.left - popoverRect.width - offset + scrollX;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2 + scrollY;
        left = triggerRect.right + offset + scrollX;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - offset + scrollY;
        left = triggerRect.left + scrollX;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - offset + scrollY;
        left = triggerRect.right - popoverRect.width + scrollX;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset + scrollY;
        left = triggerRect.left + scrollX;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset + scrollY;
        left = triggerRect.right - popoverRect.width + scrollX;
        break;
      default:
        break;
    }

    // Boundary detection
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (left < 0) left = offset;
    if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - offset;
    }

    // Adjust vertical position
    if (top < 0) top = offset;
    if (top + popoverRect.height > viewportHeight) {
      top = viewportHeight - popoverRect.height - offset;
    }

    setPosition({ top, left });
  }, [placement, offset]);

  // Handle click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!closeOnClickOutside) return;

    const target = e.target as Node;
    if (
      !triggerRef.current?.contains(target) &&
      !popoverRef.current?.contains(target)
    ) {
      setOpen(false);
    }
  }, [closeOnClickOutside, setOpen]);

  // Handle ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (closeOnEsc && e.key === 'Escape') {
      setOpen(false);
    }
  }, [closeOnEsc, setOpen]);

  // Update position when open
  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [open, updatePosition]);

  // Event listeners
  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleClickOutside, handleKeyDown]);

  // Clone trigger with ref and onClick
  const triggerElement = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e: React.MouseEvent) => {
      trigger.props.onClick?.(e);
      setOpen(!open);
    },
    'aria-expanded': open,
    'aria-haspopup': true
  });

  const popoverContent = open && (
    <div
      ref={popoverRef}
      className={cn(
        'absolute z-50',
        'glass rounded-[var(--radius-md,10px)]',
        'shadow-[var(--elev-2)]',
        'min-w-[200px]',
        'animate-fade-in',
        className
      )}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      role="menu"
      aria-orientation="vertical"
    >
      {children}
    </div>
  );

  return (
    <>
      {triggerElement}
      {typeof document !== 'undefined' && popoverContent &&
        createPortal(popoverContent, document.body)
      }
    </>
  );
};

Popover.displayName = 'Popover';

export default Popover;