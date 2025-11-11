/**
 * QuantityStepper Component
 * Increment/decrement control for quantities
 * Essential for cart and checkout flows
 */

'use client';

import React, { forwardRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface QuantityStepperProps {
  /** Current value */
  value: number;
  /** On value change */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Show input field */
  showInput?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Quantity stepper with +/- buttons and optional input
 * Accessible with keyboard support and ARIA attributes
 */
export const QuantityStepper = forwardRef<HTMLDivElement, QuantityStepperProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 999,
      step = 1,
      size = 'md',
      disabled = false,
      showInput = true,
      className
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: {
        container: 'h-8',
        button: 'w-8 h-8 text-sm',
        input: 'w-12 text-sm'
      },
      md: {
        container: 'h-10',
        button: 'w-10 h-10 text-base',
        input: 'w-16 text-base'
      },
      lg: {
        container: 'h-12',
        button: 'w-12 h-12 text-lg',
        input: 'w-20 text-lg'
      }
    };

    const sizes = sizeClasses[size];

    // Handlers
    const handleIncrement = useCallback(() => {
      const newValue = Math.min(value + step, max);
      if (newValue !== value) {
        onChange(newValue);
      }
    }, [value, step, max, onChange]);

    const handleDecrement = useCallback(() => {
      const newValue = Math.max(value - step, min);
      if (newValue !== value) {
        onChange(newValue);
      }
    }, [value, step, min, onChange]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty string for user input
      if (inputValue === '') {
        onChange(min);
        return;
      }

      const parsed = parseInt(inputValue, 10);
      if (!isNaN(parsed)) {
        const clamped = Math.max(min, Math.min(parsed, max));
        onChange(clamped);
      }
    }, [min, max, onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handleIncrement();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleDecrement();
          break;
        default:
          break;
      }
    }, [handleIncrement, handleDecrement]);

    // Disabled states
    const decrementDisabled = disabled || value <= min;
    const incrementDisabled = disabled || value >= max;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center',
          'glass rounded-[var(--radius-md,10px)]',
          'border border-[var(--glass-border-default)]',
          'overflow-hidden',
          sizes.container,
          disabled && 'opacity-50',
          className
        )}
        role="group"
        aria-label="Quantity stepper"
      >
        {/* Decrement button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={decrementDisabled}
          className={cn(
            'flex items-center justify-center',
            'border-r border-[var(--glass-border-default)]',
            'text-[var(--text-secondary)]',
            'transition-all duration-[var(--motion-fast)]',
            'hover:bg-[var(--glass-tint-light)]',
            'hover:text-[var(--text-primary)]',
            'active:scale-[var(--scale-pressed,0.98)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--focus-ring-color)]',
            'focus-visible:ring-inset',
            sizes.button,
            decrementDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[var(--text-secondary)]'
          )}
          aria-label="Decrease quantity"
          aria-disabled={decrementDisabled}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        {/* Input field */}
        {showInput ? (
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              'flex-1 text-center',
              'bg-transparent',
              'text-[var(--text-primary)]',
              'focus:outline-none focus:bg-[var(--glass-tint-light)]',
              'transition-colors duration-[var(--motion-fast)]',
              '[appearance:textfield]',
              '[&::-webkit-outer-spin-button]:appearance-none',
              '[&::-webkit-inner-spin-button]:appearance-none',
              sizes.input,
              disabled && 'cursor-not-allowed'
            )}
            aria-label="Quantity"
            role="spinbutton"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
          />
        ) : (
          <div
            className={cn(
              'flex-1 text-center',
              'text-[var(--text-primary)]',
              'font-medium',
              sizes.input
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </div>
        )}

        {/* Increment button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={incrementDisabled}
          className={cn(
            'flex items-center justify-center',
            'border-l border-[var(--glass-border-default)]',
            'text-[var(--text-secondary)]',
            'transition-all duration-[var(--motion-fast)]',
            'hover:bg-[var(--glass-tint-light)]',
            'hover:text-[var(--text-primary)]',
            'active:scale-[var(--scale-pressed,0.98)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--focus-ring-color)]',
            'focus-visible:ring-inset',
            sizes.button,
            incrementDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[var(--text-secondary)]'
          )}
          aria-label="Increase quantity"
          aria-disabled={incrementDisabled}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }
);

QuantityStepper.displayName = 'QuantityStepper';

export default QuantityStepper;