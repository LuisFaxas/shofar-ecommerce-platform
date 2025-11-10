/**
 * ProductCard Component
 * Glass-styled product card for e-commerce display
 * Core component for TOOLY product grid
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ButtonPrimary } from './ButtonPrimary';
import { ButtonSecondary } from './ButtonSecondary';

export interface ProductCardProps {
  /** Product ID */
  id: string | number;
  /** Product title */
  title: string;
  /** Product description */
  description?: string;
  /** Product image URL */
  image: string;
  /** Alternative image for hover */
  imageAlt?: string;
  /** Current price */
  price: number | string;
  /** Original price (for sale items) */
  originalPrice?: number | string;
  /** Currency symbol */
  currency?: string;
  /** Sale percentage */
  salePercentage?: number;
  /** Product rating (0-5) */
  rating?: number;
  /** Number of reviews */
  reviewCount?: number;
  /** Out of stock state */
  outOfStock?: boolean;
  /** Badge text (New, Hot, etc.) */
  badge?: string;
  /** Badge variant */
  badgeVariant?: 'default' | 'sale' | 'new' | 'hot';
  /** Quick add to cart */
  showQuickAdd?: boolean;
  /** Wishlist button */
  showWishlist?: boolean;
  /** Is in wishlist */
  isWishlisted?: boolean;
  /** Card variant */
  variant?: 'default' | 'compact' | 'detailed';
  /** Click handlers */
  onCardClick?: () => void;
  onAddToCart?: () => void;
  onWishlistToggle?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * E-commerce product card with glass styling
 * Supports multiple layouts and interactive features
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  image,
  imageAlt,
  price,
  originalPrice,
  currency = '$',
  salePercentage,
  rating = 0,
  reviewCount = 0,
  outOfStock = false,
  badge,
  badgeVariant = 'default',
  showQuickAdd = true,
  showWishlist = true,
  isWishlisted = false,
  variant = 'default',
  onCardClick,
  onAddToCart,
  onWishlistToggle,
  className
}) => {
  const [imageHover, setImageHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate sale percentage if not provided
  const calculatedSalePercentage = salePercentage || (
    originalPrice && typeof originalPrice === 'number' && typeof price === 'number'
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  );

  // Format price display
  const formatPrice = (value: number | string) => {
    if (typeof value === 'number') {
      return `${currency}${value.toFixed(2)}`;
    }
    return `${currency}${value}`;
  };

  // Badge colors
  const badgeColors = {
    default: 'bg-white/[0.08] text-white',
    sale: 'bg-gradient-to-r from-[#02fcef] to-[#a02bfe] text-white',
    new: 'bg-green-500/20 text-green-400 border border-green-500/30',
    hot: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && !outOfStock) {
      setIsLoading(true);
      await onAddToCart();
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle?.();
  };

  // Render star rating
  const renderStars = () => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn(
              'w-4 h-4',
              i < Math.floor(rating) ? 'text-yellow-500' : 'text-white/20'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {reviewCount > 0 && (
          <span className="text-xs text-white/50 ml-1">({reviewCount})</span>
        )}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={onCardClick}
        className={cn(
          'group relative cursor-pointer',
          'bg-white/[0.03] backdrop-blur-sm',
          'border border-white/[0.08] rounded-lg',
          'overflow-hidden',
          'transition-all duration-300',
          'hover:bg-white/[0.05] hover:border-white/[0.14]',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          className
        )}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
          <img
            src={imageHover && imageAlt ? imageAlt : image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          />

          {/* Badges */}
          {(badge || calculatedSalePercentage > 0) && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {badge && (
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  badgeColors[badgeVariant]
                )}>
                  {badge}
                </span>
              )}
              {calculatedSalePercentage > 0 && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                  -{calculatedSalePercentage}%
                </span>
              )}
            </div>
          )}

          {/* Wishlist */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className={cn(
                  'w-4 h-4',
                  isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'
                )}
                fill={isWishlisted ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-white line-clamp-1">{title}</h3>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white">{formatPrice(price)}</span>
              {originalPrice && (
                <span className="text-sm text-white/40 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onCardClick}
      className={cn(
        'group relative cursor-pointer',
        'bg-white/[0.03] backdrop-blur-sm',
        'border border-white/[0.08] rounded-xl',
        'overflow-hidden',
        'transition-all duration-300',
        'hover:bg-white/[0.05] hover:border-white/[0.14]',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.02]">
        <img
          src={imageHover && imageAlt ? imageAlt : image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onMouseEnter={() => setImageHover(true)}
          onMouseLeave={() => setImageHover(false)}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        {(badge || calculatedSalePercentage > 0 || outOfStock) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {outOfStock ? (
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/70 text-white/70 backdrop-blur-sm">
                Out of Stock
              </span>
            ) : (
              <>
                {badge && (
                  <span className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm',
                    badgeColors[badgeVariant]
                  )}>
                    {badge}
                  </span>
                )}
                {calculatedSalePercentage > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500 text-white">
                    -{calculatedSalePercentage}%
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full',
              'bg-black/50 backdrop-blur-sm',
              'hover:bg-black/70 transition-all duration-200',
              'transform scale-0 group-hover:scale-100'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={cn(
                'w-5 h-5',
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'
              )}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        {/* Quick Add Button */}
        {showQuickAdd && !outOfStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <ButtonSecondary
              size="sm"
              fullWidth
              loading={isLoading}
              onClick={handleAddToCart}
            >
              Quick Add to Cart
            </ButtonSecondary>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Rating */}
        {rating > 0 && renderStars()}

        {/* Title */}
        <h3 className="text-base font-semibold text-white line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        {/* Description (for detailed variant) */}
        {variant === 'detailed' && description && (
          <p className="text-sm text-white/60 line-clamp-2">{description}</p>
        )}

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className={cn(
            'text-2xl font-bold',
            outOfStock ? 'text-white/40' : 'text-white'
          )}>
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-sm text-white/40 line-through mb-0.5">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart (for detailed variant) */}
        {variant === 'detailed' && !outOfStock && (
          <div className="pt-2">
            <ButtonPrimary
              size="sm"
              fullWidth
              loading={isLoading}
              onClick={handleAddToCart}
              showArrow
            >
              Add to Cart
            </ButtonPrimary>
          </div>
        )}
      </div>

      {/* Glass shine effect */}
      <span
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
};

ProductCard.displayName = 'ProductCard';

export default ProductCard;