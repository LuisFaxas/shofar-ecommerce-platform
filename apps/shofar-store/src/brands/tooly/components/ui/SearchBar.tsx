/**
 * SearchBar Component
 * Standalone search with suggestions and categories
 * Core search component for TOOLY e-commerce
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  /** Suggestion type */
  type: "product" | "category" | "brand" | "recent";
  /** Display text */
  text: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional image */
  image?: string;
  /** Number of results (for categories) */
  count?: number;
  /** Link URL */
  href?: string;
}

export interface SearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Search suggestions */
  suggestions?: SearchSuggestion[];
  /** Recent searches */
  recentSearches?: string[];
  /** Popular categories */
  categories?: Array<{
    name: string;
    count: number;
  }>;
  /** Show categories */
  showCategories?: boolean;
  /** Show recent searches */
  showRecentSearches?: boolean;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Search callback */
  onSearch?: (query: string) => void;
  /** Clear recent search */
  onClearRecent?: (search: string) => void;
  /** Clear all recent */
  onClearAllRecent?: () => void;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Full width */
  fullWidth?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Advanced search bar with suggestions dropdown
 * Includes recent searches, categories, and product suggestions
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for products...",
  suggestions = [],
  recentSearches = [],
  categories = [],
  showCategories = true,
  showRecentSearches = true,
  autoFocus = false,
  onSearch,
  onClearRecent,
  onClearAllRecent,
  size = "md",
  fullWidth = false,
  className,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Size classes
  const sizeClasses = {
    sm: {
      input: "h-9 text-xs pl-9 pr-3",
      icon: "w-4 h-4",
      dropdown: "text-xs",
    },
    md: {
      input: "h-11 text-sm pl-11 pr-4",
      icon: "w-5 h-5",
      dropdown: "text-sm",
    },
    lg: {
      input: "h-13 text-base pl-13 pr-5",
      icon: "w-6 h-6",
      dropdown: "text-base",
    },
  };

  // Filter suggestions based on query
  const filteredSuggestions = query.trim()
    ? suggestions.filter((s) =>
        s.text.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const hasResults =
    filteredSuggestions.length > 0 ||
    (query.trim() === "" &&
      (recentSearches.length > 0 || categories.length > 0));

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const totalItems =
      filteredSuggestions.length +
      (query.trim() === "" ? recentSearches.length : 0);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex].text);
        } else if (query.trim() === "" && selectedIndex >= 0) {
          const recentIndex = selectedIndex - filteredSuggestions.length;
          if (recentIndex >= 0 && recentIndex < recentSearches.length) {
            handleSuggestionClick(recentSearches[recentIndex]);
          }
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    await onSearch?.(query.trim());
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 500);
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch?.(text);
  };

  const handleClearRecent = (e: React.MouseEvent, search: string) => {
    e.stopPropagation();
    onClearRecent?.(search);
  };

  // Render suggestion icon based on type
  const renderSuggestionIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "product":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case "category":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        );
      case "brand":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "recent":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={cn("relative", fullWidth && "w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full rounded-lg",
            "bg-white/[0.08] backdrop-blur-md",
            "border border-white/[0.14]",
            "text-white placeholder-white/40",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/20",
            "focus:bg-white/[0.12] focus:border-white/[0.20]",
            sizeClasses[size].input,
          )}
        />

        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
          {isLoading ? (
            <svg
              className={cn("animate-spin", sizeClasses[size].icon)}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className={sizeClasses[size].icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && hasResults && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "bg-[#0b0e14]/95 backdrop-blur-xl",
            "border border-white/[0.14] rounded-xl",
            "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
            "overflow-hidden",
            "max-h-[70vh] overflow-y-auto",
            "z-50",
            sizeClasses[size].dropdown,
          )}
        >
          {/* Recent Searches */}
          {showRecentSearches &&
            query.trim() === "" &&
            recentSearches.length > 0 && (
              <div className="p-3 border-b border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Recent Searches
                  </span>
                  {onClearAllRecent && (
                    <button
                      onClick={() => onClearAllRecent()}
                      className="text-xs text-white/50 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg",
                        "cursor-pointer transition-all duration-150",
                        "hover:bg-white/[0.08]",
                        selectedIndex === index && "bg-white/[0.08]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-white/50">
                          {renderSuggestionIcon("recent")}
                        </span>
                        <span className="text-white">{search}</span>
                      </div>
                      {onClearRecent && (
                        <button
                          onClick={(e) => handleClearRecent(e, search)}
                          className="text-white/30 hover:text-white/60 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Categories */}
          {showCategories && query.trim() === "" && categories.length > 0 && (
            <div className="p-3 border-b border-white/[0.08]">
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                Popular Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(category.name)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-left",
                      "bg-white/[0.05] hover:bg-white/[0.10]",
                      "border border-white/[0.08] hover:border-white/[0.14]",
                      "transition-all duration-150",
                    )}
                  >
                    <div className="text-white text-sm font-medium">
                      {category.name}
                    </div>
                    <div className="text-white/40 text-xs">
                      {category.count} products
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-3">
              {query.trim() && (
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                  Suggestions
                </span>
              )}
              <div className="space-y-1">
                {filteredSuggestions.map((suggestion, index) => {
                  const actualIndex =
                    query.trim() === "" ? recentSearches.length + index : index;
                  return (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg",
                        "cursor-pointer transition-all duration-150",
                        "hover:bg-white/[0.08]",
                        selectedIndex === actualIndex && "bg-white/[0.08]",
                      )}
                    >
                      {/* Icon or Image */}
                      {suggestion.image ? (
                        <img
                          src={suggestion.image}
                          alt={suggestion.text}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-white/50">
                          {renderSuggestionIcon(suggestion.type)}
                        </span>
                      )}

                      {/* Text Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {/* Highlight matching text */}
                          {query.trim() ? (
                            <>
                              {suggestion.text
                                .split(new RegExp(`(${query})`, "gi"))
                                .map((part, i) => (
                                  <span
                                    key={i}
                                    className={
                                      part.toLowerCase() === query.toLowerCase()
                                        ? "text-[#02fcef]"
                                        : ""
                                    }
                                  >
                                    {part}
                                  </span>
                                ))}
                            </>
                          ) : (
                            suggestion.text
                          )}
                        </div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-white/50 truncate">
                            {suggestion.subtitle}
                          </div>
                        )}
                      </div>

                      {/* Count Badge */}
                      {suggestion.count && (
                        <span className="px-2 py-1 rounded-full bg-white/[0.08] text-xs text-white/60">
                          {suggestion.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Button */}
          {query.trim() && (
            <div className="p-3 border-t border-white/[0.08]">
              <button
                onClick={handleSearch}
                className={cn(
                  "w-full px-4 py-2 rounded-lg",
                  "bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe]",
                  "text-white font-medium",
                  "hover:opacity-90 active:scale-[0.98]",
                  "transition-all duration-150",
                )}
              >
                Search for &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
