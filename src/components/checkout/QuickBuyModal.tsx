'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Lock, AlertCircle, ChevronLeft, Check, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
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

interface QuickBuyModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    priceUsd: number
    imageUrl: string
    selectedColor: string
    selectedNecklace: string
    engravingLeftHeart?: string
    engravingRightHeart?: string
  }
  onSuccess: (orderId: string) => void
}

type Step = 'shipping' | 'payment'
type PaymentMethod = 'card' | 'paypal'

export function QuickBuyModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: QuickBuyModalProps) {
  const [step, setStep] = useState<Step>('shipping')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Shipping info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')


  const { formatPrice } = useCurrencyStore()
  const { t } = useTranslation()

  const shippingInfo = {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    postalCode,
    country,
  }

  const isShippingValid = firstName && lastName && email && address && city && postalCode && country

  const stripeItems = [{
    productId: product.id,
    productName: `${product.name} (${product.selectedColor}, ${product.selectedNecklace})`,
    priceUsd: product.priceUsd,
    quantity: 1,
    engravingLeftHeart: product.engravingLeftHeart || null,
    engravingRightHeart: product.engravingRightHeart || null,
  }]

  const handleClose = () => {
    setStep('shipping')
    setError(null)
    onClose()
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {step === 'payment' && (
                <button
                  onClick={() => setStep('shipping')}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <h2 className="text-xl font-heading font-semibold text-gray-800">
                {step === 'shipping' ? t('checkout.quickCheckout') : t('checkout.payment')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold',
                step === 'shipping' ? 'bg-[#B71C1C] text-white' : 'bg-green-500 text-white'
              )}>
                {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={cn(
                  'h-full bg-[#B71C1C] transition-all duration-300',
                  step === 'payment' ? 'w-full' : 'w-0'
                )} />
              </div>
              <div className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold',
                step === 'payment' ? 'bg-[#B71C1C] text-white' : 'bg-gray-200 text-gray-500'
              )}>
                2
              </div>
            </div>
          </div>

          {/* Product Summary */}
          <div className="px-6 py-4 bg-gradient-to-r from-[#FFF5F5] to-[#FFE5E5]/50 border-b border-pink-100">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shadow-md">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.selectedColor} • {product.selectedNecklace}</p>
              </div>
              <p className="text-xl font-bold text-[#B71C1C]">{formatPrice(product.priceUsd)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {step === 'shipping' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.firstName')}
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label={t('checkout.lastName')}
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label={t('checkout.email')}
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label={t('checkout.phoneOptional')}
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label={t('checkout.address')}
                  placeholder="123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('checkout.city')}
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Input
                    label={t('checkout.postalCode')}
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label={t('checkout.country')}
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>{t('common.freeShipping')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>{t('common.secure')}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => setStep('payment')}
                  disabled={!isShippingValid}
                >
                  {t('common.continueToPayment')}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Payment Method Tabs */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      'flex-1 py-4 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium',
                      paymentMethod === 'card'
                        ? 'border-[#B71C1C] bg-[#FFF5F5] text-[#B71C1C]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>{t('checkout.creditCard')}</span>
                      <span className="hidden sm:block relative h-5 w-24">
                        <Image src="/cb.png" alt="Cards" fill className="object-contain" />
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={cn(
                      'flex-1 py-4 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-medium',
                      paymentMethod === 'paypal'
                        ? 'border-[#0070ba] bg-blue-50 text-[#0070ba]'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    )}
                  >
                    <Image
                      src="/paypal.svg"
                      alt="PayPal"
                      width={22}
                      height={22}
                      className="h-5 w-auto"
                    />
                    {t('checkout.paypal')}
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-4">
                    {/* Card Logos */}
                    <div className="flex items-center">
                      <div className="relative h-7 w-44">
                        <Image src="/cb.png" alt="Cards" fill className="object-contain" />
                      </div>
                    </div>

                    <StripeCardForm
                      totalUsd={product.priceUsd}
                      items={stripeItems}
                      shippingInfo={shippingInfo}
                      currency="USD"
                      onSuccess={onSuccess}
                      onError={(err) => setError(err || null)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-gray-600 text-sm">
                        {t('checkout.paypalRedirect')}
                      </p>
                    </div>

                    <PayPalButtonWrapper
                      totalUsd={product.priceUsd}
                      items={[{
                        productId: product.id,
                        productName: `${product.name} (${product.selectedColor}, ${product.selectedNecklace})`,
                        priceUsd: product.priceUsd,
                        quantity: 1,
                        engravingLeftHeart: product.engravingLeftHeart || null,
                        engravingRightHeart: product.engravingRightHeart || null,
                      }]}
                      shippingInfo={shippingInfo}
                      currency="USD"
                      onSuccess={onSuccess}
                      onError={(err) => setError(err)}
                    />
                  </div>
                )}

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>{t('checkout.securePayment')}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
