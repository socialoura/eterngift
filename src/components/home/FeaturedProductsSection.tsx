'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, Star, ShoppingCart, Check, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { eternalRoseBear, eternalRoseBox, ProductVariant } from '@/lib/products-data'
import { QuickBuyModal } from '@/components/checkout/QuickBuyModal'
import { useCurrencyStore, useHydrated } from '@/store/currency'
import { useCartStore } from '@/store/cart'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'
import { useIsMobile } from '@/hooks/useIsMobile'
import { cn } from '@/lib/utils'
import { useStorefrontProducts } from '@/hooks/useStorefrontProducts'

function ProductCard({
  product,
  index,
  effectiveBasePrice,
}: {
  product: ProductVariant
  index: number
  effectiveBasePrice: number
}) {
  const [selectedColor, setSelectedColor] = useState(product.options[0]?.values[0]?.name || '')
  const [selectedNecklace, setSelectedNecklace] = useState(
    product.options.find(o => o.name.includes('Necklace'))?.values[0]?.name || ''
  )
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  
  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)
  const { t } = useTranslation()
  const locale = useLocale()
  const hydrated = useHydrated()

  const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
  const necklaceOption = product.options.find((o) => o.name.includes('Necklace'))
  const currentImages = product.getImagesForColor(selectedColor)

  // Translation helper for color names
  const translateColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      'Red': 'red',
      'Pink': 'pink',
      'Blue': 'blue',
      'Purple': 'purple',
      'White': 'white',
      'Gray': 'gray',
      'Gold': 'gold',
      'Rose Gold': 'roseGold',
    }
    const colorKey = colorMap[colorName]
    if (!colorKey) return colorName
    const translated = t(`productDetail.${colorKey}`)
    return translated !== `productDetail.${colorKey}` ? translated : colorName
  }

  // Get translated product name
  const translatedProductName = product.id === 'eternal-rose-bear' 
    ? t('productDetail.productNameBear') 
    : t('productDetail.productNameBox')

  const reviewCount = product.id === 'eternal-rose-bear' ? 128 : 96

  const handleAddToCart = () => {
    const productForCart = {
      id: product.id === 'eternal-rose-bear' ? 1 : 2,
      name: `${product.name} (${selectedColor}, ${selectedNecklace})`,
      description: product.description,
      priceUsd: effectiveBasePrice,
      imageUrl: currentImages.hero,
      imagesUrl: [],
      category: 'Gift Sets',
      stock: 100,
      rating: 4.9,
      reviewCount,
      status: 'active',
      badge: product.badge || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addItem(productForCart)
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
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
      {/* Card glow effect on hover - hidden on mobile */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-[#B71C1C] via-[#D4AF88] to-[#B71C1C] rounded-[2rem] opacity-0 blur-2xl transition-all duration-700 hidden md:block"
        animate={{ opacity: isHovered ? 0.3 : 0 }}
      />

      <div className={cn(
        'relative bg-white rounded-xl md:rounded-[2rem] overflow-hidden',
        'shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_-15px_rgba(183,28,28,0.25)]',
        'border border-gray-100/80 hover:border-[#D4AF88]/30',
        'transition-all duration-500 transform md:hover:-translate-y-2'
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
              <span className="text-white text-sm font-semibold">
                {product.badge === 'Most Popular' ? t('product.mostPopular') : t('product.premium')}
              </span>
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
        <Link href={`/${locale}/products/${product.slug}`}>
          <div className="relative aspect-[4/3] bg-gradient-to-br from-[#FAFAFA] via-[#FFF8F8] to-[#FFF0F0] overflow-hidden">
            {/* Background circles - static on mobile for performance */}
            <div className="absolute top-1/4 right-1/4 w-32 md:w-40 h-32 md:h-40 bg-pink-100 rounded-full blur-3xl opacity-40" />
            <div className="absolute bottom-1/4 left-1/4 w-24 md:w-32 h-24 md:h-32 bg-[#D4AF88]/20 rounded-full blur-2xl opacity-40" />

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

            {/* Floating sparkles on hover - hidden on mobile for performance */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-20 hidden md:block"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + i * 20}%`,
                    top: `${25 + (i % 2) * 30}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.3,
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

          <Link href={`/${locale}/products/${product.slug}`}>
            <h3 className="text-xl font-heading font-bold text-gray-900 hover:text-[#B71C1C] transition-colors line-clamp-2">
              {translatedProductName}
            </h3>
          </Link>

          {/* Rating with enhanced style */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">({reviewCount} {t('featured.reviews')})</span>
          </div>

          {/* Price with enhanced styling */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#B71C1C] to-[#8B1538] bg-clip-text text-transparent" suppressHydrationWarning>
              {hydrated ? formatPrice(effectiveBasePrice) : `$${effectiveBasePrice.toFixed(2)}`}
            </span>
            <span className="text-sm text-gray-400 line-through" suppressHydrationWarning>
              {hydrated ? formatPrice(effectiveBasePrice * 1.3) : `$${(effectiveBasePrice * 1.3).toFixed(2)}`}
            </span>
            <span className="text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-2.5 py-1 rounded-full shadow-sm">
              -23% OFF
            </span>
          </div>

          {/* Color options */}
          {colorOption && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{t('product.color')}: <span className="text-[#B71C1C]">{translateColor(selectedColor)}</span></p>
              <div className="flex flex-wrap gap-2">
                {colorOption.values.map((value) => (
                  <button
                    key={value.name}
                    onClick={() => setSelectedColor(value.name)}
                    title={value.name}
                    className={cn(
                      'relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all',
                      selectedColor === value.name
                        ? 'border-[#B71C1C] ring-2 ring-[#B71C1C]/30 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Image src={value.image} alt={value.name} fill className="object-cover" sizes="40px" />
                    {selectedColor === value.name && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Necklace options */}
          {necklaceOption && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">{t('product.necklace')}: <span className="text-[#B71C1C]">{translateColor(selectedNecklace)}</span></p>
              <div className="flex flex-wrap gap-2">
                {necklaceOption.values.map((necklace) => (
                  <button
                    key={necklace.name}
                    onClick={() => setSelectedNecklace(necklace.name)}
                    className={cn(
                      'relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all bg-gray-50',
                      selectedNecklace === necklace.name
                        ? 'border-[#B71C1C] ring-2 ring-[#B71C1C]/30'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Image src={necklace.image} alt={necklace.name} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setIsQuickBuyOpen(true)}
              className="flex-1 bg-gradient-to-r from-[#B71C1C] to-[#8B1538] hover:from-[#8B1538] hover:to-[#6B0F2A] shadow-lg shadow-[#B71C1C]/25"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t('common.buyNow')}
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className={cn(
                'px-4 border-2 transition-all',
                isAddedToCart
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white'
              )}
            >
              {isAddedToCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>{t('common.freeShipping')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('common.secure')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Buy Modal */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          priceUsd: effectiveBasePrice,
          imageUrl: currentImages.hero,
          selectedColor,
          selectedNecklace,
        }}
        onSuccess={() => {
          setIsQuickBuyOpen(false)
        }}
      />
    </motion.div>
  )
}

export function FeaturedProductsSection() {
  const { t } = useTranslation()
  const locale = useLocale()
  const { productsById } = useStorefrontProducts()
  
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white via-[#FFF8F8] to-white relative overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4AF88]/15 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-50 to-[#FFE5E5]/30 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Floating hearts decoration - hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${15 + i * 20}%`, top: `${25 + (i % 2) * 30}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, delay: i * 1, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-pink-200 fill-pink-200" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
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

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-3 md:mb-4">
            {t('featured.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] to-[#D4AF88]">{t('featured.titleHighlight')}</span> {t('featured.titleEnd')}
          </h2>
          
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {t('featured.subtitle')}
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
          <ProductCard product={eternalRoseBear} index={0} effectiveBasePrice={productsById['eternal-rose-bear']?.base_price ?? eternalRoseBear.basePrice} />
          <ProductCard product={eternalRoseBox} index={1} effectiveBasePrice={productsById['eternal-rose-box']?.base_price ?? eternalRoseBox.basePrice} />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 md:mt-16"
        >
          <Link href={`/${locale}/collections`}>
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
                {t('common.viewAllCollection')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
