'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, CreditCard, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PaymentModal } from '@/components/checkout/PaymentModal'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'
import { ShippingInfo } from '@/lib/types'

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
})

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'France',
  'Germany',
  'Australia',
  'Japan',
  'Italy',
  'Spain',
  'Netherlands',
  'Belgium',
  'Switzerland',
]

export default function CheckoutPage() {
  const router = useRouter()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [shippingData, setShippingData] = useState<ShippingInfo | null>(null)

  const { items, getSubtotalUsd, clearCart } = useCartStore()
  const { formatPrice, currency, convertFromUsd } = useCurrencyStore()
  const { t } = useTranslation()
  const locale = useLocale()

  const subtotalUsd = getSubtotalUsd()
  const shippingUsd = subtotalUsd > 50 ? 0 : 9.99
  const taxUsd = subtotalUsd * 0.08
  const totalUsd = subtotalUsd + shippingUsd + taxUsd

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingInfo>({
    resolver: zodResolver(shippingSchema),
    mode: 'onChange',
  })

  const onSubmit = (data: ShippingInfo) => {
    setShippingData(data)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (orderId: string) => {
    if (typeof window !== 'undefined') {
      try {
        const totalLocal = convertFromUsd(totalUsd)
        sessionStorage.setItem(
          'eg_last_order',
          JSON.stringify({
            orderId,
            value: Number(totalLocal.toFixed(2)),
            currency,
          })
        )
      } catch {
        // ignore
      }
    }
    clearCart()
    router.push(`/${locale}/order-confirmation?orderId=${orderId}`)
  }

  if (items.length === 0) {
    router.push(`/${locale}/cart`)
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-pink/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/cart`}
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('cart.yourCart')}
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-heading font-bold text-gray-900 mb-6">
              {t('checkout.shipping')}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('checkout.firstName')}
                  placeholder="John"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label={t('checkout.lastName')}
                  placeholder="Doe"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>

              <Input
                label={t('checkout.email')}
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label={t('checkout.address')}
                placeholder="123 Love Street"
                {...register('address')}
                error={errors.address?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t('checkout.city')}
                  placeholder="New York"
                  {...register('city')}
                  error={errors.city?.message}
                />
                <Input
                  label={t('checkout.postalCode')}
                  placeholder="10001"
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('checkout.country')}
                </label>
                <select
                  {...register('country')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-rose-gold focus:ring-2 focus:ring-rose-gold/20"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isValid}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t('common.continueToPayment')}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
                <Lock className="w-4 h-4" />
                <span>Your information is secure and encrypted</span>
              </div>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
                {t('cart.yourCart')}
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-cream shrink-0">
                      <Image
                        src={item.product.imageUrl || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.product.category}</p>
                      {(item.engravingLeftHeart || item.engravingRightHeart) && (
                        <div className="mt-1 text-[11px] text-gray-600">
                          {item.engravingLeftHeart && (
                            <p className="line-clamp-1">Left Heart: {item.engravingLeftHeart}</p>
                          )}
                          {item.engravingRightHeart && (
                            <p className="line-clamp-1">Right Heart: {item.engravingRightHeart}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-800 text-sm">
                      {formatPrice(item.product.priceUsd * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotalUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingUsd === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingUsd)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">{formatPrice(taxUsd)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalUsd)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">We accept:</p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/logos/payment-methods/visa.svg"
                    alt="Visa"
                    width={40}
                    height={25}
                    className="h-6 w-auto opacity-70"
                  />
                  <Image
                    src="/logos/payment-methods/mastercard.svg"
                    alt="Mastercard"
                    width={40}
                    height={25}
                    className="h-6 w-auto opacity-70"
                  />
                  <Image
                    src="/logos/payment-methods/amex.svg"
                    alt="Amex"
                    width={40}
                    height={25}
                    className="h-6 w-auto opacity-70"
                  />
                  <Image
                    src="/logos/payment-methods/paypal.svg"
                    alt="PayPal"
                    width={40}
                    height={25}
                    className="h-6 w-auto opacity-70"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {shippingData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          shippingInfo={shippingData}
          totalUsd={totalUsd}
          currency={currency}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}
