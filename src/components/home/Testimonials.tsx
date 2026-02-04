'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/components/providers/I18nProvider'

const testimonialData = [
  {
    id: 1,
    name: 'Sarah & Michael',
    location: 'New York, USA',
    avatar: '👩‍❤️‍👨',
    rating: 5,
    titleKey: 'testimonials.review1Title',
    contentKey: 'testimonials.review1Text',
    productKey: 'testimonials.review1Product',
    date: 'January 2026',
  },
  {
    id: 2,
    name: 'Emma Thompson',
    location: 'London, UK',
    avatar: '👩',
    rating: 5,
    titleKey: 'testimonials.review2Title',
    contentKey: 'testimonials.review2Text',
    productKey: 'testimonials.review2Product',
    date: 'February 2026',
  },
  {
    id: 3,
    name: 'David & Lisa',
    location: 'Toronto, Canada',
    avatar: '💑',
    rating: 5,
    titleKey: 'testimonials.review3Title',
    contentKey: 'testimonials.review3Text',
    productKey: 'testimonials.review3Product',
    date: 'February 2026',
  },
  {
    id: 4,
    name: 'Jessica Martinez',
    location: 'Miami, USA',
    avatar: '👧',
    rating: 5,
    titleKey: 'testimonials.review4Title',
    contentKey: 'testimonials.review4Text',
    productKey: 'testimonials.review4Product',
    date: 'January 2026',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useTranslation()
  
  const testimonials = testimonialData.map(item => ({
    ...item,
    title: t(item.titleKey),
    content: t(item.contentKey),
    product: t(item.productKey),
  }))

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-b from-[#FFF8F8] to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#D4AF88]/20 rounded-full blur-3xl opacity-50" />
        
        {/* Floating hearts - hidden on mobile for performance */}
        <div className="hidden md:block">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.35, 0.2],
              }}
              transition={{
                duration: 5,
                delay: i * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Heart className="w-5 h-5 text-pink-200 fill-pink-200" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-[#FFE5E5] rounded-full mb-6"
          >
            <Quote className="w-8 h-8 text-[#B71C1C]" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            {t('testimonials.title')}
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonial carousel */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Navigation buttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFE5E5] transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#B71C1C]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#FFE5E5] transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-[#B71C1C]" />
            </motion.button>

            {/* Cards */}
            <div className="overflow-hidden px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative"
                >
                  {/* Quote decoration */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote className="w-24 h-24 text-[#B71C1C]" />
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Left side - Avatar and info */}
                    <div className="text-center md:text-left">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-full text-4xl mb-4">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonials[currentIndex].location}
                      </p>
                      <div className="flex justify-center md:justify-start gap-1 mt-3">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>

                    {/* Right side - Content */}
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                        "{testimonials[currentIndex].title}"
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        {testimonials[currentIndex].content}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="inline-flex items-center gap-2 bg-[#FFE5E5] text-[#B71C1C] px-4 py-2 rounded-full text-sm font-medium">
                          <Heart className="w-4 h-4 fill-current" />
                          {testimonials[currentIndex].product}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {testimonials[currentIndex].date}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    i === currentIndex 
                      ? 'bg-[#B71C1C] w-8' 
                      : 'bg-gray-300 hover:bg-[#D4AF88]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
        >
          {[
            { value: '50K+', labelKey: 'testimonials.happyCouples' },
            { value: '4.9', labelKey: 'testimonials.averageRating' },
            { value: '99%', labelKey: 'testimonials.satisfaction' },
            { value: '24/7', labelKey: 'testimonials.support' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] to-[#D4AF88]">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm mt-1">{t(stat.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
