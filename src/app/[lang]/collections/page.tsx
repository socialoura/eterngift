'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Heart, ShoppingCart, Sparkles, Star, Check, 
  Truck, Shield, Gift
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { eternalRoseBear, eternalRoseBox, ProductVariant } from '@/lib/products-data'
import { QuickBuyModal } from '@/components/checkout/QuickBuyModal'
import { useCurrencyStore, useHydrated } from '@/store/currency'
import { useCartStore } from '@/store/cart'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'
import { cn } from '@/lib/utils'
import { useStorefrontProducts } from '@/hooks/useStorefrontProducts'

const products = [eternalRoseBear, eternalRoseBox]

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
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  
  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)
  const { t } = useTranslation()
  const locale = useLocale()
  const hydrated = useHydrated()

  const reviewCount = product.id === 'eternal-rose-bear' ? 128 : 96

  const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
  const necklaceOption = product.options.find((o) => o.name.includes('Necklace'))
  const currentImages = product.getImagesForColor(selectedColor)

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className="group relative"
      >
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 left-4 z-20">
              <div className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg',
                product.badge === 'Most Popular' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              )}>
                <Star className="w-3.5 h-3.5 fill-current" />
                {product.badge === 'Most Popular' ? t('product.mostPopular') : t('product.premium')}
              </div>
            </div>
          )}

          {/* Wishlist button */}
          <button className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFE5E5] hover:text-[#B71C1C] transition-all">
            <Heart className="w-5 h-5" />
          </button>

          {/* Image */}
          <Link href={`/${locale}/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={currentImages.hero}
              alt={product.name}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
            />
          </Link>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title & Rating */}
            <div>
              <Link href={`/${locale}/products/${product.id}`}>
                <h3 className="text-xl font-heading font-bold text-gray-900 hover:text-[#B71C1C] transition-colors line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">4.9 ({reviewCount} {t('featured.reviews')})</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#B71C1C]" suppressHydrationWarning>
                {hydrated ? formatPrice(effectiveBasePrice) : '…'}
              </span>
              <span className="text-sm text-gray-400 line-through" suppressHydrationWarning>
                {hydrated ? formatPrice(effectiveBasePrice * 1.3) : '…'}
              </span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                -30%
              </span>
            </div>

            {/* Color selector */}
            {colorOption && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{t('product.color')}: <span className="text-[#B71C1C]">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colorOption.values.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={cn(
                        'relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all',
                        selectedColor === color.name 
                          ? 'border-[#B71C1C] ring-2 ring-[#B71C1C]/30 scale-110' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Image src={color.image} alt={color.name} fill className="object-cover" />
                      {selectedColor === color.name && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Necklace selector */}
            {necklaceOption && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">{t('product.necklace')}: <span className="text-[#B71C1C]">{selectedNecklace}</span></p>
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
      </motion.div>

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
        onSuccess={() => setIsQuickBuyOpen(false)}
      />
    </>
  )
}

export default function CollectionsPage() {
  const { t } = useTranslation()
  const locale = useLocale()
  const { productsById } = useStorefrontProducts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F8] via-white to-[#FFF5F5]">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFE5E5] rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4AF88]/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4" />
              {t('collections.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6">
              {t('collections.title')} <span className="bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] bg-clip-text text-transparent">{t('collections.titleHighlight')}</span> {t('collections.titleEnd')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('collections.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <ProductCard
              key={product.id}
              product={product}
              index={index}
              effectiveBasePrice={productsById[product.id]?.base_price ?? product.basePrice}
            />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF88]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-white text-center">
            {[
              { icon: Truck, titleKey: 'common.freeShipping', descKey: 'common.freeShipping' },
              { icon: Shield, titleKey: 'common.securePayment', descKey: 'common.secure' },
              { icon: Gift, titleKey: 'common.giftWrapping', descKey: 'common.premiumPackaging' },
              { icon: Heart, titleKey: 'common.madeWithLove', descKey: 'common.handcraftedQuality' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg">{t(feature.titleKey)}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
