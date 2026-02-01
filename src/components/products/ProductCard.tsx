'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCurrencyStore } from '@/store/currency'
import { useCartStore } from '@/store/cart'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div
        className="card-romantic group cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-cream">
          <Image
            src={product.imageUrl || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge variant={product.badge === 'New' ? 'default' : 'secondary'}>
                {product.badge}
              </Badge>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md transition-all duration-300',
              'hover:bg-white hover:scale-110',
              isWishlisted && 'text-primary'
            )}
          >
            <Heart
              className={cn('w-5 h-5', isWishlisted && 'fill-primary')}
            />
          </button>

          {/* Quick Add Button */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent',
              'transform transition-all duration-300',
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            )}
          >
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
          )}

          {/* Name */}
          <h3 className="font-heading font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < Math.floor(product.rating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <p className="text-lg font-bold text-primary">
            {formatPrice(product.priceUsd)}
          </p>
        </div>
      </div>
    </Link>
  )
}
