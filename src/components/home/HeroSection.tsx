'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Heart, Sparkles, Gift } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'
import { useIsMobile, useReducedMotion } from '@/hooks/useIsMobile'

function FloatingHeart({ delay, duration, left, size, opacity }: { 
  delay: number; duration: number; left: string; size: number; opacity: number 
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, bottom: '-20px' }}
      animate={{
        y: [0, -800],
        x: [0, Math.random() * 100 - 50],
        rotate: [0, Math.random() * 360],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <Heart 
        className="text-pink-300 fill-pink-300" 
        style={{ width: size, height: size }} 
      />
    </motion.div>
  )
}

function Sparkle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Sparkles className="w-4 h-4 text-[#D4AF88]" />
    </motion.div>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const y2 = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  const { t } = useTranslation()
  const locale = useLocale()
  const isMobile = useIsMobile()
  const prefersReducedMotion = useReducedMotion()
  
  // Reduce animations on mobile for better performance
  const shouldReduceAnimations = isMobile || prefersReducedMotion

  // Fewer hearts on mobile
  const floatingHearts = shouldReduceAnimations ? [
    { delay: 0, duration: 10, left: '10%', size: 16, opacity: 0.3 },
    { delay: 2, duration: 12, left: '90%', size: 14, opacity: 0.3 },
  ] : [
    { delay: 0, duration: 8, left: '5%', size: 20, opacity: 0.4 },
    { delay: 1.5, duration: 10, left: '15%', size: 16, opacity: 0.3 },
    { delay: 3, duration: 9, left: '25%', size: 24, opacity: 0.5 },
    { delay: 0.5, duration: 11, left: '75%', size: 18, opacity: 0.4 },
    { delay: 2, duration: 8, left: '85%', size: 22, opacity: 0.3 },
    { delay: 4, duration: 10, left: '95%', size: 14, opacity: 0.5 },
    { delay: 1, duration: 9, left: '45%', size: 20, opacity: 0.3 },
    { delay: 2.5, duration: 12, left: '55%', size: 16, opacity: 0.4 },
  ]

  // Fewer sparkles on mobile
  const sparkles = shouldReduceAnimations ? [
    { delay: 0, x: '20%', y: '20%' },
    { delay: 1, x: '80%', y: '60%' },
  ] : [
    { delay: 0, x: '20%', y: '20%' },
    { delay: 0.5, x: '80%', y: '15%' },
    { delay: 1, x: '70%', y: '60%' },
    { delay: 1.5, x: '30%', y: '70%' },
    { delay: 2, x: '90%', y: '40%' },
  ]

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #8B1538 0%, #B71C1C 50%, #D4AF88 100%)',
            'linear-gradient(135deg, #9B1B3C 0%, #8B1538 50%, #B71C1C 100%)',
            'linear-gradient(135deg, #8B1538 0%, #B71C1C 50%, #D4AF88 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#D4AF88]/20 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingHearts.map((heart, i) => (
          <FloatingHeart key={i} {...heart} />
        ))}
      </div>

      {/* Sparkles */}
      <div className="absolute inset-0">
        {sparkles.map((sparkle, i) => (
          <Sparkle key={i} {...sparkle} />
        ))}
      </div>

      {/* Main content */}
      <motion.div style={{ opacity }} className="relative z-10">
        <div className="container mx-auto px-4 pt-16 pb-20 md:pt-20 md:pb-32 lg:pt-32 lg:pb-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
              >
                <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
                <span className="text-white/90 text-sm font-medium">{t('collections.badge')}</span>
                <Sparkles className="w-4 h-4 text-[#D4AF88]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.1]"
              >
                {t('hero.title')}
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-[#D4AF88] to-pink-300"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  {t('hero.titleHighlight')}
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
              >
                <Link href={`/${locale}/collections`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-white text-[#8B1538] hover:bg-[#D4AF88] hover:text-white px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-semibold shadow-2xl"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      {t('hero.shopNow')}
                    </Button>
                  </motion.div>
                </Link>
                <Link href={`/${locale}/products/eternal-rose-bear`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 px-6 py-4 md:px-8 md:py-6 text-base md:text-lg"
                    >
                      {t('hero.learnMore')}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 md:mt-12 flex flex-wrap gap-4 md:gap-6 justify-center lg:justify-start"
              >
                {[
                  { icon: '🚚', textKey: 'common.freeShipping' },
                  { icon: '💎', textKey: 'common.handcraftedQuality' },
                  { icon: '🎁', textKey: 'common.giftWrapping' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-lg">{badge.icon}</span>
                    <span>{t(badge.textKey)}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Product showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square">
                {/* Glowing rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(212,175,136,0.3) 0%, transparent 70%)',
                  }}
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                
                <motion.div
                  className="absolute inset-8 rounded-full border-2 border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                
                <motion.div
                  className="absolute inset-16 rounded-full border border-[#D4AF88]/30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />

                {/* Main product composition (2 products) */}
                <motion.div
                  className="relative z-10 w-full h-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Box */}
                  <motion.div
                    className="absolute left-4 top-10 w-[58%] h-[58%]"
                    initial={{ opacity: 0, x: -20, rotate: -6 }}
                    animate={{ opacity: 1, x: 0, rotate: -6 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
                    whileHover={{ rotate: -3, scale: 1.03 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl" />
                      <Image
                        src="/home/product-homepage.png"
                        alt="Eternal Rose Box with Engraved Necklace"
                        fill
                        className="object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                        priority
                        sizes="(max-width: 768px) 60vw, 30vw"
                      />
                    </div>
                  </motion.div>

                  {/* Bear */}
                  <motion.div
                    className="absolute right-0 bottom-2 w-[68%] h-[68%]"
                    initial={{ opacity: 0, x: 20, rotate: 8 }}
                    animate={{ opacity: 1, x: 0, rotate: 8 }}
                    transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
                    whileHover={{ rotate: 5, scale: 1.03 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 rounded-3xl bg-[#B71C1C]/10 blur-2xl" />
                      <Image
                        src="/home/product-homepage2.png"
                        alt="Eternal Rose Bear with Engraved Necklace"
                        fill
                        className="object-contain drop-shadow-[0_26px_70px_rgba(139,21,56,0.55)]"
                        priority
                        sizes="(max-width: 768px) 70vw, 35vw"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute top-10 -left-4 lg:-left-10"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="bg-white rounded-2xl px-4 py-3 shadow-2xl"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">4.9/5</p>
                        <p className="text-xs text-gray-500">2,847 {t('featured.reviews')}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-20 -right-4 lg:-right-10"
                >
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="bg-gradient-to-r from-[#8B1538] to-[#B71C1C] rounded-2xl px-4 py-3 shadow-2xl"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-white fill-white" />
                      <div>
                        <p className="text-sm font-bold text-white">{t('product.mostPopular')}</p>
                        <p className="text-xs text-white/80">{t('hero.bestSeller')}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="bg-[#D4AF88] rounded-full px-6 py-2 shadow-xl"
                  >
                    <p className="text-sm font-bold text-white">{t('hero.fromPrice')}</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block -mb-px">
          <path 
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
