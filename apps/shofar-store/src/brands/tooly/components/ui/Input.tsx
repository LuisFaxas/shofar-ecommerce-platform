/**
 * Input Component
 * Glass-styled input field with validation and floating labels
 * Core form component for TOOLY design system
 */

"use client";

import React, { forwardRef, useState, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input label */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** Input size */
  size?: "sm" | "md" | "lg";
  /** Full width input */
  fullWidth?: boolean;
  /** Show character count */
  showCount?: boolean;
  /** Left icon/element */
  leftIcon?: React.ReactNode;
  /** Right icon/element */
  rightIcon?: React.ReactNode;
  /** Use floating label */
  floatingLabel?: boolean;
}

/**
 * Glass-styled input field with TOOLY aesthetics
 * Supports validation states, icons, and floating labels
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      success,
      size = "md",
      fullWidth = false,
      showCount = false,
      leftIcon,
      rightIcon,
      floatingLabel = true,
      maxLength,
      value,
      onChange,
      onFocus,
      onBlur,
      disabled,
      required,
      type = "text",
      placeholder,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");
    const autoId = useId();
    const id = providedId || autoId;

    // Track value for floating label
    const hasValue = value !== undefined ? !!value : !!internalValue;

    // Size classes
    const sizeClasses = {
      sm: {
        input: "h-9 text-xs",
        padding: leftIcon ? "pl-8 pr-3" : rightIcon ? "pl-3 pr-8" : "px-3",
        label: "text-xs",
        icon: "text-sm",
      },
      md: {
        input: "h-11 text-sm",
        padding: leftIcon ? "pl-10 pr-4" : rightIcon ? "pl-4 pr-10" : "px-4",
        label: "text-sm",
        icon: "text-base",
      },
      lg: {
        input: "h-13 text-base",
        padding: leftIcon ? "pl-12 pr-5" : rightIcon ? "pl-5 pr-12" : "px-5",
        label: "text-base",
        icon: "text-lg",
      },
    };

    // State classes
    const stateClasses = error
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
      : success
        ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/20"
        : "border-white/[0.14] focus:border-white/[0.30] focus:ring-white/20";

    // Handle internal state
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const currentValue = value !== undefined ? value : internalValue;
    const charCount =
      typeof currentValue === "string" ? currentValue.length : 0;

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {/* Label - floating or static */}
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "transition-all duration-200",
              sizeClasses[size].label,
              floatingLabel
                ? cn(
                    "absolute left-4 pointer-events-none",
                    "transform-origin-top-left",
                    isFocused || hasValue || placeholder
                      ? "top-0 -translate-y-1/2 scale-75 px-1 bg-[#0b0e14] text-white/70"
                      : "top-1/2 -translate-y-1/2 scale-100 text-white/50",
                  )
                : "block mb-2 font-medium text-white/80",
              error && "text-red-500",
              success && "text-green-500",
              disabled && "opacity-50",
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "text-white/50 pointer-events-none",
                sizeClasses[size].icon,
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={id}
            type={type}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={floatingLabel && label ? undefined : placeholder}
            className={cn(
              // Base styles
              "w-full rounded-lg",
              "bg-white/[0.08] backdrop-blur-md",
              "border",
              "text-white placeholder-white/30",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2",

              // Size
              sizeClasses[size].input,
              sizeClasses[size].padding,

              // State
              stateClasses,

              // Floating label padding adjustment
              floatingLabel && label && "pt-5 pb-1",

              // Disabled state
              disabled && "opacity-50 cursor-not-allowed",

              className,
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "text-white/50",
                sizeClasses[size].icon,
              )}
            >
              {rightIcon}
            </div>
          )}

          {/* Glass shine effect */}
          <span
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-t-lg"
            aria-hidden="true"
          />
        </div>

        {/* Helper text / Error / Success / Character count */}
        <div className="mt-1 flex items-start justify-between gap-2">
          {(error || success || helperText) && (
            <p
              className={cn(
                "text-xs",
                error
                  ? "text-red-500"
                  : success
                    ? "text-green-500"
                    : "text-white/50",
              )}
            >
              {error || success || helperText}
            </p>
          )}

          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs text-white/50",
                charCount === maxLength && "text-yellow-500",
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
