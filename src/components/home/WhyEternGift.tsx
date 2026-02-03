'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Truck, Gift, Sparkles, Clock } from 'lucide-react'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'

const featureKeys = [
  { icon: Heart, titleKey: 'whyUs.eternalQuality', descKey: 'whyUs.eternalQualityDesc', gradient: 'from-pink-500 to-rose-500' },
  { icon: Sparkles, titleKey: 'whyUs.personalizedTouch', descKey: 'whyUs.personalizedTouchDesc', gradient: 'from-[#D4AF88] to-amber-500' },
  { icon: Gift, titleKey: 'whyUs.luxuryPackaging', descKey: 'whyUs.luxuryPackagingDesc', gradient: 'from-purple-500 to-pink-500' },
  { icon: Truck, titleKey: 'whyUs.freeShipping', descKey: 'whyUs.freeShippingDesc', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Shield, titleKey: 'whyUs.guarantee', descKey: 'whyUs.guaranteeDesc', gradient: 'from-green-500 to-emerald-500' },
  { icon: Clock, titleKey: 'whyUs.support', descKey: 'whyUs.supportDesc', gradient: 'from-[#B71C1C] to-rose-600' },
]

export function WhyEternGift() {
  const { t } = useTranslation()
  const locale = useLocale()
  
  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#FFFAFA] to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-[#D4AF88]/20 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[#B71C1C] text-sm font-semibold tracking-wider uppercase mb-4"
          >
            {t('whyUs.title')} {t('whyUs.titleHighlight')}
          </motion.span>

          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            {t('whyUs.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] via-pink-500 to-[#D4AF88]">{t('whyUs.titleHighlight')}</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('whyUs.subtitle')}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featureKeys.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-[#B71C1C] transition-colors">
                  {t(feature.titleKey)}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey)}
                </p>

                {/* Decorative corner */}
                <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF88] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                {t('whyUs.ctaTitle')}
              </h3>
              
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                {t('whyUs.ctaSubtitle')}
              </p>

              <motion.a
                href={`/${locale}/collections`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-[#B71C1C] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Gift className="w-5 h-5" />
                {t('hero.shopNow')}
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
