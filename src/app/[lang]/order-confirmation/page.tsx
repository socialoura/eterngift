'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Heart, Mail, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'EG-XXXXXX'
  const { t } = useTranslation()
  const locale = useLocale()

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-light-pink/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
          {t('common.orderConfirmed')}
        </h1>

        {/* Order Number */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-6">
          <p className="text-gray-600 mb-2">{t('common.thankYou')}</p>
          <p className="text-2xl font-bold text-primary font-mono">{orderId}</p>
        </div>

        {/* Confirmation Message */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <Mail className="w-5 h-5 text-rose-gold" />
            <p>{t('common.confirmationEmail')}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}/collections`}>
            <Button size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {t('common.continueShopping')}
            </Button>
          </Link>
          <Link href={`/${locale}`}>
            <Button variant="outline" size="lg">
              {t('common.home')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a
              href="mailto:support@eterngift.com"
              className="text-primary hover:underline font-medium"
            >
              support@eterngift.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
