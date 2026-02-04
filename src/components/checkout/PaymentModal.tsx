'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ShippingInfo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { useTranslation } from '@/components/providers/I18nProvider'

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
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')

  const { items } = useCartStore()
  const { formatPrice } = useCurrencyStore()
  const { t } = useTranslation()

  const handleCardPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            priceUsd: item.product.priceUsd,
            quantity: item.quantity,
            engravingLeftHeart: item.engravingLeftHeart || null,
            engravingRightHeart: item.engravingRightHeart || null,
          })),
          shippingInfo,
          totalUsd,
          currency,
          paymentMethod: 'stripe',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      onSuccess(data.orderNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/paypal/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            priceUsd: item.product.priceUsd,
            quantity: item.quantity,
            engravingLeftHeart: item.engravingLeftHeart || null,
            engravingRightHeart: item.engravingRightHeart || null,
          })),
          shippingInfo,
          totalUsd,
          currency,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'PayPal payment failed')
      }

      onSuccess(data.orderNumber)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : value
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

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

                <Input
                  label={t('checkout.nameOnCard')}
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />

                <Input
                  label={t('checkout.cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.expiryDate')}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                  />
                  <Input
                    label={t('checkout.cvc')}
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCardPayment}
                  isLoading={isProcessing}
                  disabled={!cardNumber || !expiryDate || !cvc || !cardName}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {t('checkout.payNow')} {formatPrice(totalUsd)}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm text-center mb-4">
                  {t('checkout.paypalRedirect')}
                </p>

                <Button
                  className="w-full bg-[#0070ba] hover:bg-[#005ea6]"
                  size="lg"
                  onClick={handlePayPalPayment}
                  isLoading={isProcessing}
                >
                  <Image
                    src="/paypal.svg"
                    alt="PayPal"
                    width={20}
                    height={20}
                    className="w-5 h-5 mr-2"
                  />
                  {t('checkout.payWithPaypal')}
                </Button>
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
