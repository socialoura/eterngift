'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, Heart, Check, Star, Truck, Shield, 
  RefreshCw, Gift, Sparkles, ChevronDown, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { eternalRoseBear, eternalRoseBox, ProductVariant } from '@/lib/products-data'
import { QuickBuyModal } from '@/components/checkout/QuickBuyModal'
import { useCurrencyStore, useHydrated } from '@/store/currency'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'
import { useStorefrontProducts } from '@/hooks/useStorefrontProducts'

function FloatingHeart({ delay, left, size }: { delay: number; left: string; size: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, bottom: '-20px' }}
      animate={{ y: [0, -600], opacity: [0, 0.6, 0.6, 0], rotate: [0, 20, -20, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeOut' }}
    >
      <Heart className="text-pink-200 fill-pink-200" style={{ width: size, height: size }} />
    </motion.div>
  )
}

function FloatingSparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Sparkles className="w-5 h-5 text-[#D4AF88]" />
    </motion.div>
  )
}

const productsMap: Record<string, ProductVariant> = {
  'eternal-rose-bear': eternalRoseBear,
  'eternal-rose-box': eternalRoseBox,
  '1': eternalRoseBear,
  '2': eternalRoseBox,
}

const getReviews = (t: (key: string) => string) => [
  { name: 'Sarah M.', rating: 5, date: 'Jan 2026', title: t('productDetail.reviewTitle1'), text: t('productDetail.reviewText1'), verified: true },
  { name: 'Michael T.', rating: 5, date: 'Jan 2026', title: t('productDetail.reviewTitle2'), text: t('productDetail.reviewText2'), verified: true },
  { name: 'Emma L.', rating: 5, date: 'Dec 2025', title: t('productDetail.reviewTitle3'), text: t('productDetail.reviewText3'), verified: true },
  { name: 'David K.', rating: 4, date: 'Dec 2025', title: t('productDetail.reviewTitle4'), text: t('productDetail.reviewText4'), verified: true },
]

const translateColor = (t: (key: string) => string, color: string) => {
  const colorMap: Record<string, string> = {
    'Red': 'red', 'Pink': 'pink', 'Blue': 'blue', 'Purple': 'purple', 'White': 'white',
    'Gray': 'gray', 'Gold': 'gold', 'Rose Gold': 'roseGold'
  }
  return t(`productDetail.${colorMap[color] || color.toLowerCase()}`)
}

const translateOptionName = (t: (key: string) => string, name: string) => {
  if (name === 'Bear Color') return t('productDetail.bearColor')
  if (name === 'Box Color') return t('productDetail.boxColor')
  if (name === 'Necklace Color') return t('productDetail.necklaceColor')
  return name
}

const getFaqs = (t: (key: string) => string) => [
  { q: t('productDetail.faqQ1'), a: t('productDetail.faqA1') },
  { q: t('productDetail.faqQ2'), a: t('productDetail.faqA2') },
  { q: t('productDetail.faqQ3'), a: t('productDetail.faqA3') },
  { q: t('productDetail.faqQ4'), a: t('productDetail.faqA4') },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const product = productsMap[id]
  const { t } = useTranslation()
  const locale = useLocale()
  const { productsById, loading: storefrontLoading } = useStorefrontProducts()

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedNecklace, setSelectedNecklace] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [engravingLeftHeart, setEngravingLeftHeart] = useState('')
  const [engravingRightHeart, setEngravingRightHeart] = useState('')
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)

  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)
  const hydrated = useHydrated()

  const reviewCount = product?.id === 'eternal-rose-bear' ? 128 : 96

  const storefront = product ? productsById[product.id] : undefined
  const effectiveBasePriceForCart = storefront?.base_price ?? product?.basePrice ?? 0
  const displayBasePrice = !storefrontLoading && storefront?.base_price ? storefront.base_price : null

  useEffect(() => {
    if (product) {
      const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
      const necklaceOption = product.options.find((o) => o.name.includes('Necklace'))
      if (colorOption) setSelectedColor(colorOption.values[0]?.name || '')
      if (necklaceOption) setSelectedNecklace(necklaceOption.values[0]?.name || '')
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">{t('productDetail.productNotFound')}</h1>
          <Link href="/products">
            <Button>{t('productDetail.backToProducts')}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const colorOption = product.options.find((o) => o.name.includes('Color') && !o.name.includes('Necklace'))
  const necklaceOption = product.options.find((o) => o.name.includes('Necklace'))
  const currentImages = product.getImagesForColor(selectedColor)

  const galleryImages = [
    { src: currentImages.hero, desc: product.imageDescriptions.hero },
    { src: currentImages.colorSelector, desc: product.imageDescriptions.colorSelector },
    { src: currentImages.necklaceDetail, desc: product.imageDescriptions.necklaceDetail },
    { src: currentImages.lifestyle, desc: product.imageDescriptions.lifestyle },
    { src: currentImages.packaging, desc: product.imageDescriptions.packaging },
  ]

  const handleAddToCart = () => {
    const productForCart = {
      id: product.id === 'eternal-rose-bear' ? 1 : 2,
      name: `${product.name} (${selectedColor}, ${selectedNecklace})`,
      description: product.description,
      priceUsd: effectiveBasePriceForCart,
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
    addItem(productForCart, 1, {
      engravingLeftHeart,
      engravingRightHeart,
    })
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleQuickBuySuccess = (orderId: string) => {
    setIsQuickBuyOpen(false)
    router.push(`/${locale}/order-confirmation?orderId=${orderId}`)
  }

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const otherProduct = product.id === 'eternal-rose-bear' ? eternalRoseBox : eternalRoseBear
  const otherStorefront = productsById[otherProduct.id]
  const otherEffectiveBasePriceForCart = otherStorefront?.base_price ?? otherProduct.basePrice
  const otherDisplayBasePrice = !storefrontLoading && otherStorefront?.base_price ? otherStorefront.base_price : null

  const floatingHearts = [
    { delay: 0, left: '5%', size: 16 },
    { delay: 2, left: '15%', size: 20 },
    { delay: 4, left: '85%', size: 18 },
    { delay: 1, left: '92%', size: 14 },
    { delay: 3, left: '75%', size: 22 },
  ]

  const sparkles = [
    { delay: 0, x: '10%', y: '20%' },
    { delay: 1.5, x: '90%', y: '15%' },
    { delay: 0.8, x: '80%', y: '60%' },
    { delay: 2, x: '20%', y: '70%' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] via-[#FFFAFA] to-[#FFF8F8] relative overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingHearts.map((heart, i) => (
          <FloatingHeart key={i} {...heart} />
        ))}
      </div>

      {/* Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {sparkles.map((sparkle, i) => (
          <FloatingSparkle key={i} {...sparkle} />
        ))}
      </div>

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-[#D4AF88]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl" />
      </div>

      {/* Breadcrumb with gradient */}
      <div className="relative z-10 bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF88]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">{t('productDetail.home')}</Link>
            <span className="text-white/40">/</span>
            <Link href="/products" className="text-white/70 hover:text-white transition-colors">{t('productDetail.products')}</Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-medium">{product.id === 'eternal-rose-bear' ? t('productDetail.productNameBear') : t('productDetail.productNameBox')}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="relative aspect-square bg-gradient-to-br from-[#FFF5F5] to-[#F5F1ED] rounded-3xl overflow-hidden shadow-xl">
                <motion.div
                  key={galleryImages[selectedImageIndex].src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={galleryImages[selectedImageIndex].src}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
                {product.badge && (
                  <motion.div 
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    className="absolute top-6 left-6"
                  >
                    <div className="bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      {product.badge === 'Most Popular' ? <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" /> : <Sparkles className="w-4 h-4" />}
                      {product.badge === 'Most Popular' ? t('productDetail.mostPopular') : t('productDetail.premium')}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-[#F5F1ED]',
                      selectedImageIndex === index
                        ? 'border-[#B71C1C] ring-2 ring-[#B71C1C]/30 shadow-lg'
                        : 'border-gray-200 hover:border-[#D4AF88]'
                    )}
                  >
                    <Image src={img.src} alt={`View ${index + 1}`} fill className="object-contain p-2" sizes="80px" />
                  </motion.button>
                ))}
              </div>

              <div className="bg-gradient-to-r from-[#FFE5E5] to-pink-50 rounded-2xl p-5">
                <p className="text-gray-700 text-sm leading-relaxed">{galleryImages[selectedImageIndex].desc}</p>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}</div>
                <span className="text-gray-600 text-sm">4.9 ({reviewCount} {t('productDetail.reviews')})</span>
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">{product.id === 'eternal-rose-bear' ? t('productDetail.productNameBear') : t('productDetail.productNameBox')}</h1>
                <p className="text-gray-600 leading-relaxed text-lg">{product.id === 'eternal-rose-bear' ? t('productDetail.productDescBear') : t('productDetail.productDescBox')}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 pb-6 border-b border-gray-100">
                <span className="text-4xl lg:text-5xl font-bold text-[#B71C1C]" suppressHydrationWarning>{hydrated && displayBasePrice !== null ? formatPrice(displayBasePrice) : '…'}</span>
                <span className="text-xl text-gray-400 line-through" suppressHydrationWarning>{hydrated && displayBasePrice !== null ? formatPrice(displayBasePrice * 1.3) : '…'}</span>
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">{t('productDetail.save')} 23%</span>
              </div>

              {/* Color Options */}
              {colorOption && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{translateOptionName(t, colorOption.name)}</p>
                    <p className="text-sm text-[#B71C1C] font-medium">{translateColor(t, selectedColor)}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {colorOption.values.map((value) => (
                      <motion.button
                        key={value.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSelectedColor(value.name); setSelectedImageIndex(0) }}
                        className={cn(
                          'relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all',
                          selectedColor === value.name ? 'border-[#B71C1C] ring-4 ring-[#B71C1C]/20' : 'border-gray-200 hover:border-[#D4AF88]'
                        )}
                      >
                        <Image src={value.image} alt={value.name} fill className="object-cover bg-[#F5F1ED]" sizes="64px" />
                        {selectedColor === value.name && <span className="absolute inset-0 bg-black/10 flex items-center justify-center"><Check className="w-6 h-6 text-white" /></span>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Engraving */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{t('productDetail.engraving')}</p>
                  <p className="text-xs text-gray-500">{t('productDetail.optionalMax')}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label={t('productDetail.leftHeartEngraving')}
                    placeholder={t('productDetail.leftPlaceholder')}
                    value={engravingLeftHeart}
                    onChange={(e) => setEngravingLeftHeart(e.target.value.slice(0, 20))}
                  />
                  <Input
                    label={t('productDetail.rightHeartEngraving')}
                    placeholder={t('productDetail.rightPlaceholder')}
                    value={engravingRightHeart}
                    onChange={(e) => setEngravingRightHeart(e.target.value.slice(0, 20))}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {t('productDetail.engravingTip')}
                </p>
              </div>

              {/* Necklace Options */}
              {necklaceOption && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{translateOptionName(t, necklaceOption.name)}</p>
                    <p className="text-sm text-[#B71C1C] font-medium">{translateColor(t, selectedNecklace)}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {necklaceOption.values.map((value) => (
                      <motion.button
                        key={value.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedNecklace(value.name)}
                        className={cn(
                          'flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all',
                          selectedNecklace === value.name ? 'border-[#B71C1C] bg-[#FFE5E5]/50' : 'border-gray-200 hover:border-[#D4AF88]'
                        )}
                      >
                        <span className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-[#F5F1ED]">
                          <Image src={value.image} alt={value.name} fill className="object-cover" sizes="48px" />
                        </span>
                        <span className="font-medium text-gray-700">{translateColor(t, value.name)}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy Now - Primary CTA */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button 
                  onClick={() => setIsQuickBuyOpen(true)} 
                  size="lg" 
                  className="w-full py-7 text-xl font-bold bg-gradient-to-r from-[#B71C1C] via-[#D4AF88] to-[#B71C1C] hover:from-[#8B1538] hover:via-[#C49B6D] hover:to-[#8B1538] shadow-xl shadow-[#B71C1C]/30 transition-all"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  {t('productDetail.buyNow')}
                </Button>
              </motion.div>

              {/* Add to Cart - Secondary */}
              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button onClick={handleAddToCart} size="lg" variant="outline" className={cn('w-full py-5 text-base font-semibold transition-all border-2', isAddedToCart ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white')}>
                    {isAddedToCart ? <><Check className="w-5 h-5 mr-2" />{t('productDetail.added')}</> : <><ShoppingCart className="w-5 h-5 mr-2" />{t('productDetail.addToCart')}</>}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" className="h-full px-5 border-2 border-[#D4AF88] text-[#D4AF88] hover:bg-[#D4AF88] hover:text-white">
                    <Heart className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-3 pt-6">
                {[
                  { icon: Truck, label: t('productDetail.freeShipping') },
                  { icon: RefreshCw, label: t('productDetail.returns') },
                  { icon: Shield, label: t('productDetail.securePayment') },
                  { icon: Gift, label: t('productDetail.giftReady') },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFE5E5] to-pink-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <item.icon className="w-5 h-5 text-[#B71C1C]" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Description with 3 images */}
      <section className="relative z-10 py-16 bg-gradient-to-br from-[#FFF5F5] via-white to-[#FFE5E5]/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: 3 Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Main GIF */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#FFF8F8] to-[#F5F1ED]">
                <Image
                  src={product.id === 'eternal-rose-bear' ? '/products/rose-bear/description/1.gif' : '/products/rose-box/description/1.gif'}
                  alt={`${product.name} showcase`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Two smaller images */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#FFF8F8] to-[#F5F1ED]"
                >
                  <Image
                    src={product.id === 'eternal-rose-bear' ? '/products/rose-bear/description/2.webp' : '/products/rose-box/description/2.webp'}
                    alt={`${product.name} detail 1`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-[#FFF8F8] to-[#F5F1ED]"
                >
                  <Image
                    src={product.id === 'eternal-rose-bear' ? '/products/rose-bear/description/3.webp' : '/products/rose-box/description/3.webp'}
                    alt={`${product.name} detail 2`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Text Description */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  ✨ {t('productDetail.handcraftedWithLove')}
                </span>
                <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
                  {product.id === 'eternal-rose-bear' ? t('productDetail.thePerfectRoseBear') : t('productDetail.elegantRoseBox')}
                </h2>
              </div>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {product.id === 'eternal-rose-bear' 
                    ? t('productDetail.roseBearDesc1')
                    : t('productDetail.roseBoxDesc1')}
                </p>
                <p>
                  {product.id === 'eternal-rose-bear'
                    ? t('productDetail.roseBearDesc2')
                    : t('productDetail.roseBoxDesc2')}
                </p>
              </div>

              {/* Features list */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: '🌹', text: t('productDetail.realPreservedRoses') },
                  { icon: '💎', text: t('productDetail.engravedNecklace') },
                  { icon: '🎁', text: t('productDetail.premiumGiftBox') },
                  { icon: '💝', text: t('productDetail.lasts2to3Years') },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-md border border-pink-50"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="relative z-10 py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">{t('productDetail.whatsIncluded')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('productDetail.everyOrderPackaged')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: '🌹', title: product.id === 'eternal-rose-bear' ? t('productDetail.roseBear') : t('productDetail.roseBox'), desc: t('productDetail.roseBearItemDesc') },
              { icon: '💎', title: t('productDetail.engravedNecklace'), desc: t('productDetail.engravedNecklaceItemDesc') },
              { icon: '🎁', title: t('productDetail.premiumGiftBox'), desc: t('productDetail.premiumGiftBoxItemDesc') },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-gradient-to-br from-[#FFF8F8] to-white rounded-2xl p-6 text-center shadow-lg border border-pink-100">
                <span className="text-5xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* You May Also Love - Premium Design */}
      <section className="relative z-10 py-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Glowing orbs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 bg-[#B71C1C]/20 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#D4AF88]/20 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#B71C1C] to-[#D4AF88] rounded-full mb-6 shadow-lg shadow-[#B71C1C]/30"
            >
              <Heart className="w-8 h-8 text-white fill-white" />
            </motion.div>
            <h2 className="text-3xl lg:text-5xl font-heading font-bold text-white mb-4">
              {t('productDetail.youMayAlsoLove')}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">{t('productDetail.completeCollection')}</p>
          </motion.div>

          {/* Product Card - Premium */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Link href={`/products/${otherProduct.slug}`} className="block group">
              <motion.div
                whileHover={{ y: -10 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#B71C1C] via-[#D4AF88] to-[#B71C1C] rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity" />
                
                <div className="relative bg-gradient-to-br from-[#1f1f3a] to-[#2a2a4a] rounded-3xl overflow-hidden border border-white/10">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image side */}
                    <div className="relative aspect-square bg-gradient-to-br from-[#FFF5F5]/10 to-transparent overflow-hidden">
                      {/* Floating sparkles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute"
                            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
                          >
                            <Sparkles className="w-4 h-4 text-[#D4AF88]" />
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.div
                        className="relative w-full h-full p-8"
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Image
                          src={otherProduct.getImagesForColor(otherProduct.options[0].values[0].name).hero}
                          alt={otherProduct.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                          sizes="400px"
                        />
                      </motion.div>

                      {/* Badge */}
                      {otherProduct.badge && (
                        <motion.div
                          initial={{ x: -50, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          className="absolute top-6 left-6"
                        >
                          <div className="flex items-center gap-2 bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] px-4 py-2 rounded-full shadow-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-semibold">{otherProduct.badge}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Content side */}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="space-y-4">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">({otherProduct.id === 'eternal-rose-bear' ? 128 : 96} {t('productDetail.reviews')})</span>
                        </div>

                        <h3 className="text-2xl lg:text-3xl font-heading font-bold text-white group-hover:text-[#D4AF88] transition-colors">
                          {otherProduct.name}
                        </h3>

                        <p className="text-gray-400 text-sm leading-relaxed">
                          {otherProduct.description.substring(0, 120)}...
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF88] to-[#FFD700]" suppressHydrationWarning>
                            {hydrated && otherDisplayBasePrice !== null ? formatPrice(otherDisplayBasePrice) : '…'}
                          </span>
                          <span className="text-gray-500 line-through text-sm" suppressHydrationWarning>
                            {hydrated && otherDisplayBasePrice !== null ? formatPrice(otherDisplayBasePrice * 1.3) : '…'}
                          </span>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="pt-2"
                        >
                          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white font-semibold py-3 px-6 rounded-xl group-hover:shadow-lg group-hover:shadow-[#B71C1C]/30 transition-all">
                            <span>{t('productDetail.discoverNow')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="relative z-10 py-16 bg-gradient-to-br from-[#8B1538] via-[#B71C1C] to-[#D4AF88] overflow-hidden">
        {/* Decorative hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-white/10 fill-white/10" />
            </motion.div>
          ))}
        </div>
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">{t('productDetail.customerReviews')}</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}</div>
              <span className="text-lg font-semibold text-white">4.9/5</span>
              <span className="text-white/70">({reviewCount} {t('productDetail.reviews')})</span>
            </div>
          </motion.div>
          <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {getReviews(t).map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex gap-1 mb-2">{[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
                    <h4 className="font-bold text-gray-900">{review.title}</h4>
                  </div>
                  {review.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✓ {t('productDetail.verified')}</span>}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{review.text}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{review.name}</span>
                  <span>{review.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 bg-gradient-to-b from-white via-[#FFF8F8] to-[#FFE5E5]/50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">{t('productDetail.faq')}</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {getFaqs(t).map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#FFF8F8] rounded-xl overflow-hidden border border-pink-100">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={cn('w-5 h-5 text-[#B71C1C] transition-transform', openFaq === i && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Buy Modal */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          priceUsd: effectiveBasePriceForCart,
          imageUrl: currentImages.hero,
          selectedColor,
          selectedNecklace,
          engravingLeftHeart,
          engravingRightHeart,
        }}
        onSuccess={handleQuickBuySuccess}
      />

      {/* Order Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOrderSuccess(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">{t('common.orderConfirmed')}</h2>
              <p className="text-gray-600 mb-4">{t('common.thankYou')}</p>
              <p className="text-xl font-bold text-[#B71C1C] mb-6">{orderSuccess}</p>
              <p className="text-sm text-gray-500 mb-6">{t('common.confirmationEmail')}</p>
              <Button onClick={() => setOrderSuccess(null)} className="w-full">
                {t('common.continueShopping')}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
