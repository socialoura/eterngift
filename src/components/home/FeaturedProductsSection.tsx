'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { eternalRoseBear, eternalRoseBox, ProductVariant } from '@/lib/products-data'
import { useCurrencyStore } from '@/store/currency'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

function ProductCard({ product, index }: { product: ProductVariant; index: number }) {
  const [selectedColor, setSelectedColor] = useState(product.options[0]?.values[0]?.name || '')
  const [isHovered, setIsHovered] = useState(false)
  
  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)

  const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
  const currentImages = product.getImagesForColor(selectedColor)

  const handleQuickAdd = () => {
    const productForCart = {
      id: product.id === 'eternal-rose-bear' ? 1 : 2,
      name: `${product.name} (${selectedColor})`,
      description: product.description,
      priceUsd: product.basePrice,
      imageUrl: currentImages.hero,
      imagesUrl: [],
      category: 'Gift Sets',
      stock: 100,
      rating: 4.9,
      reviewCount: 128,
      status: 'active',
      badge: product.badge || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addItem(productForCart)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card glow effect on hover */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-[#B71C1C] via-[#D4AF88] to-[#B71C1C] rounded-[2rem] opacity-0 blur-2xl transition-all duration-700"
        animate={{ opacity: isHovered ? 0.4 : 0 }}
      />

      <div className={cn(
        'relative bg-white rounded-[2rem] overflow-hidden',
        'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-15px_rgba(183,28,28,0.25)]',
        'border border-gray-100/80 hover:border-[#D4AF88]/30',
        'transition-all duration-500 transform hover:-translate-y-3'
      )}>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFE5E5] to-transparent rounded-bl-[100px] opacity-60" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#D4AF88]/10 to-transparent rounded-tr-[80px] opacity-60" />

        {/* Badge */}
        {product.badge && (
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-5 left-5 z-20"
          >
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm',
              product.badge === 'Most Popular' 
                ? 'bg-gradient-to-r from-[#8B1538] to-[#B71C1C]' 
                : 'bg-gradient-to-r from-[#D4AF88] to-[#C49B6D]'
            )}>
              {product.badge === 'Most Popular' ? (
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-white" />
              )}
              <span className="text-white text-sm font-semibold">{product.badge}</span>
            </div>
          </motion.div>
        )}

        {/* Wishlist button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-5 right-5 z-20 w-11 h-11 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFE5E5] hover:shadow-xl transition-all duration-300 border border-pink-100"
        >
          <Heart className="w-5 h-5 text-[#B71C1C]" />
        </motion.button>

        {/* Image container */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FAFAFA] via-[#FFF8F8] to-[#FFF0F0] overflow-hidden">
            {/* Animated background circles */}
            <motion.div 
              className="absolute top-1/4 right-1/4 w-40 h-40 bg-pink-100 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-[#D4AF88]/20 rounded-full blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
            />

            {/* Product image with enhanced animation */}
            <motion.div
              className="relative z-10 w-full h-full p-6"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                y: isHovered ? -15 : 0,
                rotateY: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Image
                src={currentImages.hero}
                alt={product.name}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Floating sparkles on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${20 + (i % 4) * 18}%`,
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [0.6, 1.3, 0.6],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF88]" />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent z-10" />
          </div>
        </Link>

        {/* Content */}
        <div className="p-6 pt-4 space-y-4 relative">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#D4AF88]/30 to-transparent" />

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-xl font-heading font-bold text-gray-900 hover:text-[#B71C1C] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating with enhanced style */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">(128 reviews)</span>
          </div>

          {/* Price with enhanced styling */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#B71C1C] to-[#8B1538] bg-clip-text text-transparent">
              {formatPrice(product.basePrice)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.basePrice * 1.3)}
            </span>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-2.5 py-1 rounded-full shadow-sm">
              -23% OFF
            </span>
          </div>

          {/* Color options with enhanced styling */}
          {colorOption && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-px bg-gray-300" />
                Select {colorOption.name}
                <span className="w-4 h-px bg-gray-300" />
              </p>
              <div className="flex gap-2.5">
                {colorOption.values.map((value) => (
                  <motion.button
                    key={value.name}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedColor(value.name)}
                    title={value.name}
                    className={cn(
                      'relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md',
                      selectedColor === value.name
                        ? 'border-[#B71C1C] ring-4 ring-[#B71C1C]/20 scale-105 shadow-lg'
                        : 'border-gray-200 hover:border-[#D4AF88] hover:shadow-lg'
                    )}
                  >
                    <Image
                      src={value.image}
                      alt={value.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    {selectedColor === value.name && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-[#B71C1C]/15 flex items-center justify-center backdrop-blur-[1px]"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#B71C1C] rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Actions with enhanced buttons */}
          <div className="flex gap-3 pt-3">
            <Link href={`/products/${product.slug}`} className="flex-1">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#6B0F2B] shadow-lg shadow-[#B71C1C]/25 group h-12 text-base font-semibold">
                  View Details
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.08, rotate: 5 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                onClick={handleQuickAdd}
                className="border-2 border-[#D4AF88] text-[#D4AF88] hover:bg-gradient-to-r hover:from-[#D4AF88] hover:to-[#C49B6D] hover:text-white hover:border-transparent px-4 h-12 shadow-md"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProductsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#FFF8F8] to-white relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4AF88]/15 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-50 to-[#FFE5E5]/30 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Floating hearts decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 5, delay: i * 0.8, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-pink-200 fill-pink-200" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative inline-block mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-[#B71C1C] fill-[#B71C1C]" />
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] to-[#D4AF88]">Eternal</span> Gifts
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handcrafted with love, designed to last forever. Each piece tells a unique story of eternal romance.
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <ProductCard product={eternalRoseBear} index={0} />
          <ProductCard product={eternalRoseBox} index={1} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/products">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white px-8 group"
              >
                View All Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
