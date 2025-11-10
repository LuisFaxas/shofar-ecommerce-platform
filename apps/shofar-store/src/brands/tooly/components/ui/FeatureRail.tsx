/**
 * FeatureRail Component
 * Work Order 2.5.REBOOT
 *
 * Apple-inspired feature showcase with progress indicators
 * Smooth transitions between feature highlights
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface Feature {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
  highlight?: string;
}

export interface FeatureRailProps {
  /** Features to display */
  features: Feature[];
  /** Auto-advance interval in ms (0 to disable) */
  autoAdvance?: number;
  /** Show progress indicators */
  showProgress?: boolean;
  /** Layout variant */
  variant?: 'horizontal' | 'vertical' | 'split';
  /** Custom className */
  className?: string;
}

/**
 * Feature showcase rail with progress indicators
 * Inspired by Apple's product feature presentations
 */
export const FeatureRail: React.FC<FeatureRailProps> = ({
  features,
  autoAdvance = 5000,
  showProgress = true,
  variant = 'horizontal',
  className
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle auto-advance
  useEffect(() => {
    if (autoAdvance <= 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
      setProgress(0);
    }, autoAdvance);

    return () => clearInterval(interval);
  }, [autoAdvance, features.length]);

  // Handle progress animation
  useEffect(() => {
    if (autoAdvance <= 0) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + (100 / (autoAdvance / 100));
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [activeIndex, autoAdvance]);

  const handleFeatureClick = useCallback((index: number) => {
    setActiveIndex(index);
    setProgress(0);
  }, []);

  const activeFeature = features[activeIndex];

  if (variant === 'split') {
    return (
      <SplitLayout
        features={features}
        activeIndex={activeIndex}
        progress={progress}
        showProgress={showProgress}
        onFeatureClick={handleFeatureClick}
        className={className}
      />
    );
  }

  if (variant === 'vertical') {
    return (
      <VerticalLayout
        features={features}
        activeIndex={activeIndex}
        progress={progress}
        showProgress={showProgress}
        onFeatureClick={handleFeatureClick}
        className={className}
      />
    );
  }

  // Default horizontal layout
  return (
    <div className={cn('space-y-8', className)}>
      {/* Active feature display */}
      <div className="glass-card p-8 min-h-[400px]">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-4">
            {activeFeature.badge && (
              <span className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] border border-[var(--color-brand)]/20">
                {activeFeature.badge}
              </span>
            )}
            <h3 className="text-3xl font-bold text-white">
              {activeFeature.title}
            </h3>
            <p className="text-lg text-white/70 leading-relaxed">
              {activeFeature.description}
            </p>
            {activeFeature.highlight && (
              <p className="text-[var(--color-brand-3)] font-medium">
                {activeFeature.highlight}
              </p>
            )}
          </div>

          {/* Visual */}
          <div className="relative">
            {activeFeature.image ? (
              <img
                src={activeFeature.image}
                alt={activeFeature.title}
                className="w-full h-auto rounded-lg"
              />
            ) : activeFeature.icon ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-8xl text-white/20">
                  {activeFeature.icon}
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-lg bg-gradient-to-br from-white/5 to-white/10" />
            )}
          </div>
        </div>
      </div>

      {/* Feature selector with progress */}
      <div className="flex gap-2">
        {features.map((feature, index) => (
          <FeatureTab
            key={feature.id}
            feature={feature}
            isActive={index === activeIndex}
            progress={index === activeIndex ? progress : 0}
            showProgress={showProgress}
            onClick={() => handleFeatureClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual feature tab component
const FeatureTab: React.FC<{
  feature: Feature;
  isActive: boolean;
  progress: number;
  showProgress: boolean;
  onClick: () => void;
}> = ({ feature, isActive, progress, showProgress, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex-1 p-4 text-left transition-all duration-300',
        'rounded-lg overflow-hidden',
        isActive
          ? 'bg-white/[0.08] border border-white/[0.14]'
          : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
      )}
    >
      {/* Progress bar */}
      {showProgress && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0.5',
            'bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)]',
            'transition-all duration-100'
          )}
          style={{ width: `${isActive ? progress : 0}%` }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        <h4 className={cn(
          'font-medium transition-colors',
          isActive ? 'text-white' : 'text-white/60'
        )}>
          {feature.title}
        </h4>
      </div>
    </button>
  );
};

// Split layout variant
const SplitLayout: React.FC<{
  features: Feature[];
  activeIndex: number;
  progress: number;
  showProgress: boolean;
  onFeatureClick: (index: number) => void;
  className?: string;
}> = ({ features, activeIndex, progress, showProgress, onFeatureClick, className }) => {
  const activeFeature = features[activeIndex];

  return (
    <div className={cn('grid md:grid-cols-2 gap-8', className)}>
      {/* Left: Feature list */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => onFeatureClick(index)}
            className={cn(
              'relative w-full p-6 text-left transition-all duration-300',
              'rounded-xl overflow-hidden',
              index === activeIndex
                ? 'bg-white/[0.08] border border-white/[0.14]'
                : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]'
            )}
          >
            {/* Progress bar */}
            {showProgress && index === activeIndex && (
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-brand)] to-[var(--color-brand-2)]"
                style={{
                  transform: `scaleY(${progress / 100})`,
                  transformOrigin: 'top'
                }}
              />
            )}

            {/* Content */}
            <div className="relative z-10 pl-2">
              <h4 className={cn(
                'text-lg font-semibold mb-2 transition-colors',
                index === activeIndex ? 'text-white' : 'text-white/60'
              )}>
                {feature.title}
              </h4>
              <p className={cn(
                'text-sm transition-colors',
                index === activeIndex ? 'text-white/70' : 'text-white/40'
              )}>
                {feature.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Right: Active feature display */}
      <div className="glass-card p-8 flex flex-col justify-center">
        {activeFeature.image ? (
          <img
            src={activeFeature.image}
            alt={activeFeature.title}
            className="w-full h-auto rounded-lg"
          />
        ) : activeFeature.icon ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-8xl text-white/20">
              {activeFeature.icon}
            </div>
          </div>
        ) : (
          <div className="h-64 rounded-lg bg-gradient-to-br from-white/5 to-white/10" />
        )}
        {activeFeature.highlight && (
          <p className="mt-4 text-center text-[var(--color-brand-3)] font-medium">
            {activeFeature.highlight}
          </p>
        )}
      </div>
    </div>
  );
};

// Vertical layout variant
const VerticalLayout: React.FC<{
  features: Feature[];
  activeIndex: number;
  progress: number;
  showProgress: boolean;
  onFeatureClick: (index: number) => void;
  className?: string;
}> = ({ features, activeIndex, progress, showProgress, onFeatureClick, className }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {features.map((feature, index) => (
        <button
          key={feature.id}
          onClick={() => onFeatureClick(index)}
          className={cn(
            'relative w-full text-left transition-all duration-300',
            'rounded-xl overflow-hidden',
            index === activeIndex
              ? 'bg-white/[0.08] border border-white/[0.14]'
              : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04] hover:border-white/[0.08]',
            'p-6'
          )}
        >
          {/* Progress overlay */}
          {showProgress && index === activeIndex && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent"
              style={{
                transform: `scaleX(${progress / 100})`,
                transformOrigin: 'left'
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
            <div>
              {feature.badge && (
                <span className="inline-block mb-2 px-2 py-0.5 text-xs font-medium uppercase tracking-wider rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
                  {feature.badge}
                </span>
              )}
              <h4 className={cn(
                'text-xl font-semibold mb-2 transition-colors',
                index === activeIndex ? 'text-white' : 'text-white/60'
              )}>
                {feature.title}
              </h4>
              <p className={cn(
                'text-sm transition-colors',
                index === activeIndex ? 'text-white/70' : 'text-white/40'
              )}>
                {feature.description}
              </p>
            </div>
            {feature.icon && (
              <div className="flex justify-end">
                <div className={cn(
                  'text-4xl transition-opacity',
                  index === activeIndex ? 'text-white/30' : 'text-white/10'
                )}>
                  {feature.icon}
                </div>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

FeatureRail.displayName = 'FeatureRail';

export default FeatureRail;