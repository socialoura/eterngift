'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Lock, AlertCircle, ChevronLeft, Check, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/store/currency'

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

  // Card info
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvc, setCvc] = useState('')
  const [cardName, setCardName] = useState('')

  const { formatPrice } = useCurrencyStore()

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

  const handleCardPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            productId: product.id,
            productName: `${product.name} (${product.selectedColor}, ${product.selectedNecklace})`,
            priceUsd: product.priceUsd,
            quantity: 1,
            engravingLeftHeart: product.engravingLeftHeart || null,
            engravingRightHeart: product.engravingRightHeart || null,
          }],
          shippingInfo,
          totalUsd: product.priceUsd,
          currency: 'USD',
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
          items: [{
            productId: product.id,
            productName: `${product.name} (${product.selectedColor}, ${product.selectedNecklace})`,
            priceUsd: product.priceUsd,
            quantity: 1,
            engravingLeftHeart: product.engravingLeftHeart || null,
            engravingRightHeart: product.engravingRightHeart || null,
          }],
          shippingInfo,
          totalUsd: product.priceUsd,
          currency: 'USD',
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
                {step === 'shipping' ? 'Quick Checkout' : 'Payment'}
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
                    label="First Name"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                  label="Address"
                  placeholder="123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <Input
                    label="Postal Code"
                    placeholder="10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Country"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 pt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => setStep('payment')}
                  disabled={!isShippingValid}
                >
                  Continue to Payment
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
                      <span>Credit Card</span>
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
                    PayPal
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

                    <Input
                      label="Name on Card"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />

                    <Input
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                      <Input
                        label="CVC"
                        placeholder="123"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                      />
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538]"
                      size="lg"
                      onClick={handleCardPayment}
                      isLoading={isProcessing}
                      disabled={!cardNumber || !expiryDate || !cvc || !cardName}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Pay {formatPrice(product.priceUsd)}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <p className="text-gray-600 text-sm">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                    </div>

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
                      Pay with PayPal
                    </Button>
                  </div>
                )}

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 pt-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  <span>Secure payment • 256-bit encryption</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
