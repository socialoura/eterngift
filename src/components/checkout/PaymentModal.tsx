'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ShippingInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { useTranslation } from '@/components/providers/I18nProvider'

const PayPalButtonWrapper = dynamic(
  () => import('./PayPalButtonWrapper').then(mod => mod.PayPalButtonWrapper),
  { ssr: false, loading: () => <div className="h-12 bg-gray-100 animate-pulse rounded-lg" /> }
)

const StripeCardForm = dynamic(
  () => import('./StripeCardForm').then(mod => mod.StripeCardForm),
  { ssr: false, loading: () => <div className="h-20 bg-gray-100 animate-pulse rounded-lg" /> }
)

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  shippingInfo: ShippingInfo
  totalUsd: number
  currency: string
  onSuccess: (orderId: string) => void
}

type PaymentMethod = 'card' | 'paypal'

export function PaymentModal({
  isOpen,
  onClose,
  shippingInfo,
  totalUsd,
  currency,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [error, setError] = useState<string | null>(null)

  const { items } = useCartStore()
  const { formatPrice } = useCurrencyStore()
  const { t } = useTranslation()

  const stripeItems = items.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    priceUsd: item.product.priceUsd,
    quantity: item.quantity,
    engravingLeftHeart: item.engravingLeftHeart || null,
    engravingRightHeart: item.engravingRightHeart || null,
  }))

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-heading font-semibold text-gray-800">
              {t('checkout.completePayment')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Payment Method Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setPaymentMethod('card')}
              className={cn(
                'flex-1 py-4 text-center font-medium transition-colors',
                paymentMethod === 'card'
                  ? 'text-primary border-b-2 border-primary bg-light-pink/30'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{t('checkout.creditCard')}</span>
                <span className="hidden sm:block relative h-5 w-24">
                  <Image src="/cb.png" alt="Cards" fill className="object-contain" />
                </span>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={cn(
                'flex-1 py-4 text-center font-medium transition-colors',
                paymentMethod === 'paypal'
                  ? 'text-primary border-b-2 border-primary bg-light-pink/30'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/paypal.svg"
                  alt="PayPal"
                  width={22}
                  height={22}
                  className="h-5 w-auto"
                />
                PayPal
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Amount */}
            <div className="bg-light-pink/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('checkout.totalAmount')}</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(totalUsd)}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {paymentMethod === 'card' ? (
              <div className="space-y-4">
                {/* Card Logos */}
                <div className="flex items-center mb-4">
                  <div className="relative h-7 w-44">
                    <Image src="/cb.png" alt="Cards" fill className="object-contain" />
                  </div>
                </div>

                <StripeCardForm
                  totalUsd={totalUsd}
                  items={stripeItems}
                  shippingInfo={shippingInfo}
                  currency={currency}
                  onSuccess={onSuccess}
                  onError={(err) => setError(err || null)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm text-center mb-4">
                  {t('checkout.paypalRedirect')}
                </p>

                <PayPalButtonWrapper
                  totalUsd={totalUsd}
                  items={items.map((item) => ({
                    productId: String(item.product.id),
                    productName: item.product.name,
                    priceUsd: item.product.priceUsd,
                    quantity: item.quantity,
                    engravingLeftHeart: item.engravingLeftHeart || null,
                    engravingRightHeart: item.engravingRightHeart || null,
                  }))}
                  shippingInfo={shippingInfo}
                  currency={currency}
                  onSuccess={onSuccess}
                  onError={(err) => setError(err)}
                />
              </div>
            )}

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>{t('checkout.securePayment')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
