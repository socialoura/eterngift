'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Heart, Sparkles, Gift } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useTranslation } from '@/components/providers/I18nProvider'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #8B1538 0%, #B71C1C 50%, #D4AF88 100%)',
            'linear-gradient(135deg, #B71C1C 0%, #D4AF88 50%, #8B1538 100%)',
            'linear-gradient(135deg, #8B1538 0%, #B71C1C 50%, #D4AF88 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating hearts - hidden on mobile for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 5,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Heart className="w-5 h-5 text-white/20 fill-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left content */}
              <div className="text-center md:text-left">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF88]" />
                  <span className="text-white/90 text-sm font-medium">{t('newsletter.exclusiveOffer')}</span>
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                  {t('newsletter.title')}
                </h2>
                
                <p className="text-white/80 mb-6">
                  {t('newsletter.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {[
                    { icon: '💝', key: 'newsletter.earlyAccess' },
                    { icon: '🎁', key: 'newsletter.exclusiveDeals' },
                    { icon: '💌', key: 'newsletter.giftIdeas' }
                  ].map((item, i) => (
                    <span key={i} className="text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
                      {item.icon} {t(item.key)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right - Form */}
              <div>
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-8 text-center shadow-2xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Heart className="w-16 h-16 text-[#B71C1C] fill-[#B71C1C] mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                      Welcome to the Family! 💕
                    </h3>
                    <p className="text-gray-600">
                      Check your email for your exclusive 10% discount code.
                    </p>
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-xl mb-6 mx-auto">
                      <Mail className="w-7 h-7 text-[#B71C1C]" />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input
                          type="email"
                          placeholder={t('newsletter.placeholder')}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#B71C1C] focus:ring-[#B71C1C]/30 py-4"
                        />
                      </div>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          isLoading={status === 'loading'}
                          className="w-full bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] hover:from-[#8B1538] hover:to-[#B71C1C] text-white py-4 text-lg font-semibold"
                        >
                          <Gift className="w-5 h-5 mr-2" />
                          {t('newsletter.subscribe')}
                        </Button>
                      </motion.div>
                    </form>

                    <p className="text-gray-400 text-xs mt-4 text-center">
                      {t('newsletter.privacy')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom contact */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/60 text-sm text-center mt-8"
          >
            Questions? Reach us at{' '}
            <a href="mailto:support@eterngift.com" className="text-white hover:text-[#D4AF88] underline transition-colors">
              support@eterngift.com
            </a>
          </motion.p>
        </div>
      </div>
    </section>
  )
}
