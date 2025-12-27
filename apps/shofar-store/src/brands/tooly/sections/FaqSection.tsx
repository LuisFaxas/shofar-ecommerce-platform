/**
 * FaqSection - Frequently Asked Questions
 * WO 3.1 Implementation + WO-FAQ-01 Vendure Integration
 *
 * Features:
 * - Accordion items with glass styling
 * - Keyboard accessible (Enter/Space to toggle)
 * - Smooth expand/collapse animation
 * - Content from Vendure Channel customFields
 */

"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { FaqContent } from "../lib/storefront-content";

interface FaqSectionProps {
  className?: string;
  /** FAQ content from Vendure Channel customFields */
  content?: FaqContent;
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: FaqItemProps): React.ReactElement {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={cn(
        "border border-white/[0.08] rounded-xl overflow-hidden",
        "transition-colors duration-300",
        isOpen && "border-white/[0.14] bg-white/[0.02]",
      )}
    >
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full flex items-center justify-between p-5",
          "text-left",
          "hover:bg-white/[0.02]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/50",
          "transition-colors duration-200",
        )}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="text-base font-medium text-white pr-4">
          {question}
        </span>
        <span
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full",
            "bg-white/[0.08] flex items-center justify-center",
            "transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        >
          <svg
            className="w-4 h-4 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-5 pb-5">
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection({
  className,
  content,
}: FaqSectionProps): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  // Use content from Vendure or defaults
  const heading = content?.heading ?? "Frequently Asked Questions";
  const subhead = content?.subhead ?? "Everything you need to know about TOOLY";
  const items = content?.items ?? [];
  const showFaq = content?.showFaq ?? true;

  // If showFaq is false, render empty section with same spacing (layout locked)
  if (!showFaq) {
    return (
      <section
        id="faq"
        className={cn("py-16 md:py-24 bg-[#0d1218]", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <section
      id="faq"
      className={cn("py-16 md:py-24 bg-[#0d1218]", className)}
      aria-labelledby="faq-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {heading}
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">{subhead}</p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((faq, index) => (
            <FaqItem
              key={`faq-${index}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-white/60 mb-4">Still have questions?</p>
          <button
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full",
              "bg-white/[0.08] border border-white/[0.14]",
              "text-white font-medium",
              "hover:bg-white/[0.12] hover:border-white/[0.20]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
              "transition-all duration-200",
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}

FaqSection.displayName = "FaqSection";

export default FaqSection;
