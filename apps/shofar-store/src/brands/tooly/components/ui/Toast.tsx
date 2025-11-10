/**
 * Toast Component
 * Glass-styled notification system
 * Core feedback component for TOOLY e-commerce
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastProps {
  /** Unique ID */
  id: string;
  /** Toast title */
  title: string;
  /** Toast description */
  description?: string;
  /** Toast variant */
  variant?: ToastVariant;
  /** Duration in milliseconds (0 for persistent) */
  duration?: number;
  /** Show close button */
  closable?: boolean;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Custom icon */
  icon?: React.ReactNode;
  /** On close callback */
  onClose?: () => void;
}

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider
 * Manages toast notifications globally
 */
export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: ToastPosition;
  limit?: number;
}> = ({
  children,
  position = 'top-right',
  limit = 5
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { ...toast, id };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Limit number of toasts
      if (updated.length > limit) {
        return updated.slice(-limit);
      }
      return updated;
    });

    return id;
  }, [limit]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={cn(
          'fixed z-[100] pointer-events-none',
          positionClasses[position]
        )}
      >
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast notifications
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Individual Toast Component
 */
const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  closable = true,
  action,
  icon,
  onClose
}) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Auto dismiss
  useEffect(() => {
    // Entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    let dismissTimer: NodeJS.Timeout | null = null;
    if (duration > 0) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(id);
      onClose?.();
    }, 200);
  };

  // Variant styles
  const variantClasses = {
    default: {
      container: 'bg-white/[0.08] border-white/[0.14]',
      icon: 'text-white',
      title: 'text-white',
      description: 'text-white/70'
    },
    success: {
      container: 'bg-green-500/[0.15] border-green-500/30',
      icon: 'text-green-400',
      title: 'text-green-400',
      description: 'text-green-300/80'
    },
    error: {
      container: 'bg-red-500/[0.15] border-red-500/30',
      icon: 'text-red-400',
      title: 'text-red-400',
      description: 'text-red-300/80'
    },
    warning: {
      container: 'bg-yellow-500/[0.15] border-yellow-500/30',
      icon: 'text-yellow-400',
      title: 'text-yellow-400',
      description: 'text-yellow-300/80'
    },
    info: {
      container: 'bg-blue-500/[0.15] border-blue-500/30',
      icon: 'text-blue-400',
      title: 'text-blue-400',
      description: 'text-blue-300/80'
    }
  };

  // Default icons for variants
  const defaultIcons = {
    default: null,
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const styles = variantClasses[variant];
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div
      className={cn(
        'relative w-80 sm:w-96',
        'backdrop-blur-xl rounded-lg',
        'border shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'transition-all duration-200',
        'transform',
        styles.container,
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex gap-3">
          {/* Icon */}
          {displayIcon && (
            <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
              {displayIcon}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-sm font-semibold', styles.title)}>
              {title}
            </h3>
            {description && (
              <p className={cn('mt-1 text-xs', styles.description)}>
                {description}
              </p>
            )}

            {/* Action Button */}
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                className={cn(
                  'mt-3 text-xs font-medium',
                  'px-3 py-1.5 rounded-md',
                  'bg-white/[0.08] hover:bg-white/[0.12]',
                  'border border-white/[0.14]',
                  'transition-all duration-150',
                  'active:scale-[0.98]'
                )}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          {closable && (
            <button
              onClick={handleClose}
              className={cn(
                'flex-shrink-0',
                'text-white/50 hover:text-white/80',
                'transition-colors duration-150'
              )}
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.05] rounded-b-lg overflow-hidden">
          <div
            className={cn(
              'h-full bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe]',
              'animate-[shrink_var(--duration)_linear_forwards]'
            )}
            style={{ '--duration': `${duration}ms` } as React.CSSProperties}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Convenience functions for common toast types
 */
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastProps>) => {
    const context = useContext(ToastContext);
    if (!context) return '';
    return context.addToast({ title, description, variant: 'success', ...options });
  },
  error: (title: string, description?: string, options?: Partial<ToastProps>) => {
    const context = useContext(ToastContext);
    if (!context) return '';
    return context.addToast({ title, description, variant: 'error', ...options });
  },
  warning: (title: string, description?: string, options?: Partial<ToastProps>) => {
    const context = useContext(ToastContext);
    if (!context) return '';
    return context.addToast({ title, description, variant: 'warning', ...options });
  },
  info: (title: string, description?: string, options?: Partial<ToastProps>) => {
    const context = useContext(ToastContext);
    if (!context) return '';
    return context.addToast({ title, description, variant: 'info', ...options });
  },
  default: (title: string, description?: string, options?: Partial<ToastProps>) => {
    const context = useContext(ToastContext);
    if (!context) return '';
    return context.addToast({ title, description, variant: 'default', ...options });
  }
};

export default Toast;