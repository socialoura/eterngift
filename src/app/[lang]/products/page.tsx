'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { eternalRoseBear, eternalRoseBox, ProductVariant } from '@/lib/products-data'
import { useCurrencyStore } from '@/store/currency'
import { cn } from '@/lib/utils'

const allProducts: ProductVariant[] = [eternalRoseBear, eternalRoseBox]

function ProductCard({ product }: { product: ProductVariant }) {
  const [selectedColor, setSelectedColor] = useState(product.options[0]?.values[0]?.name || '')
  const [isHovered, setIsHovered] = useState(false)
  
  const { formatPrice } = useCurrencyStore()
  const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
  const currentImages = product.getImagesForColor(selectedColor)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative bg-[#F5F1ED] rounded-2xl overflow-hidden border border-[#D4AF88]/30',
        'transition-all duration-300',
        isHovered && 'shadow-xl scale-[1.02] border-[#D4AF88]'
      )}
    >
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 bg-[#B71C1C] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {product.badge === 'Most Popular' ? '⭐ Most Popular' : '✨ Premium'}
        </div>
      )}

      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gradient-to-br from-white to-[#F5F1ED] p-6">
          <Image
            src={currentImages.hero}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-heading font-semibold text-gray-900 hover:text-[#B71C1C] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-2xl font-bold text-[#B71C1C]">
          {formatPrice(product.basePrice)}
        </p>

        {colorOption && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {colorOption.name}
            </p>
            <div className="flex gap-2 flex-wrap">
              {colorOption.values.map((value) => (
                <button
                  key={value.name}
                  onClick={() => setSelectedColor(value.name)}
                  title={value.name}
                  className={cn(
                    'relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200',
                    selectedColor === value.name
                      ? 'border-[#B71C1C] ring-2 ring-[#B71C1C]/30 scale-110'
                      : 'border-gray-200 hover:border-gray-400',
                    value.name === 'White' && 'border-gray-300'
                  )}
                >
                  <Image
                    src={value.image}
                    alt={`${product.name} - ${value.name}`}
                    fill
                    className="object-cover bg-[#F5F1ED]"
                    sizes="40px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="block">
          <Button className="w-full bg-[#B71C1C] hover:bg-[#8B1538]">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFE5E5]/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8B1538] to-[#B71C1C]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
              Our Eternal Gifts
            </h1>
            <p className="text-[#FFE5E5]/90 max-w-xl mx-auto">
              Handcrafted with love, designed to last forever. Choose the perfect gift for your special someone.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
            Why Choose <span className="text-[#D4AF88]">EternGift</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-14 h-14 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-[#B71C1C]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Eternal Quality</h3>
              <p className="text-gray-600 text-sm">Preserved to perfection, lasting forever</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#B71C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Love</h3>
              <p className="text-gray-600 text-sm">Engraved messages make each gift unique</p>
            </div>
            <div className="p-6">
              <div className="w-14 h-14 bg-[#FFE5E5] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#B71C1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Packaging</h3>
              <p className="text-gray-600 text-sm">Luxury presentation for special moments</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
