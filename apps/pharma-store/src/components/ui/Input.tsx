/**
 * Input Component
 *
 * Form input with:
 * - Label support
 * - Error states
 * - Helper text
 * - Icons
 */

import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useId } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message (also sets error state) */
  error?: string;
  /** Input size */
  size?: InputSize;
  /** Left icon/element */
  leftElement?: ReactNode;
  /** Right icon/element */
  rightElement?: ReactNode;
  /** Full width input */
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, { input: string; label: string }> = {
  sm: {
    input: 'px-3 py-1.5 text-sm',
    label: 'text-xs',
  },
  md: {
    input: 'px-4 py-2 text-sm',
    label: 'text-sm',
  },
  lg: {
    input: 'px-4 py-3 text-base',
    label: 'text-base',
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    size = 'md',
    leftElement,
    rightElement,
    fullWidth = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const hasError = Boolean(error);
  const styles = sizeStyles[size];

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block mb-1.5 font-medium text-[var(--peptide-fg)]
            ${styles.label}
          `}
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left element */}
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--peptide-fg-muted)]">
            {leftElement}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full rounded-lg
            bg-[var(--peptide-bg)] border
            placeholder:text-[var(--peptide-fg-muted)]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:border-transparent
            ${styles.input}
            ${leftElement ? 'pl-10' : ''}
            ${rightElement ? 'pr-10' : ''}
            ${
              hasError
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-[var(--peptide-border)] focus:ring-[var(--peptide-primary)]/30 focus:border-[var(--peptide-primary)]'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed bg-[var(--peptide-bg-alt)]' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right element */}
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--peptide-fg-muted)]">
            {rightElement}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Helper text (only show if no error) */}
      {helperText && !hasError && (
        <p
          id={`${inputId}-helper`}
          className="mt-1.5 text-xs text-[var(--peptide-fg-muted)]"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

/**
 * Textarea Component (similar styling to Input)
 */
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helperText,
    error,
    size = 'md',
    fullWidth = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || `textarea-${generatedId}`;
  const hasError = Boolean(error);
  const styles = sizeStyles[size];

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`
            block mb-1.5 font-medium text-[var(--peptide-fg)]
            ${styles.label}
          `}
        >
          {label}
          {props.required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
        }
        className={`
          w-full rounded-lg min-h-[100px] resize-y
          bg-[var(--peptide-bg)] border
          placeholder:text-[var(--peptide-fg-muted)]
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:border-transparent
          ${styles.input}
          ${
            hasError
              ? 'border-red-500 focus:ring-red-500/30'
              : 'border-[var(--peptide-border)] focus:ring-[var(--peptide-primary)]/30 focus:border-[var(--peptide-primary)]'
          }
          ${props.disabled ? 'opacity-50 cursor-not-allowed bg-[var(--peptide-bg-alt)]' : ''}
          ${className}
        `}
        {...props}
      />

      {hasError && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}

      {helperText && !hasError && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-[var(--peptide-fg-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
});
