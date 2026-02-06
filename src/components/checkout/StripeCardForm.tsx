'use client'

import { useState, useEffect } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCurrencyStore } from '@/store/currency'
import { useTranslation } from '@/components/providers/I18nProvider'

interface StripeCardFormInnerProps {
  totalUsd: number
  items: any[]
  shippingInfo: any
  currency: string
  onSuccess: (orderNumber: string) => void
  onError: (error: string) => void
}

function StripeCardFormInner({
  totalUsd,
  items,
  shippingInfo,
  currency,
  onSuccess,
  onError,
}: StripeCardFormInnerProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const { formatPrice } = useCurrencyStore()
  const { t } = useTranslation()

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    setIsProcessing(true)
    onError('')

    try {
      // 1. Create PaymentIntent on server
      const intentRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalUsd,
          currency: 'usd',
          metadata: {
            customerEmail: shippingInfo.email,
            customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          },
        }),
      })

      const intentData = await intentRes.json()
      if (!intentRes.ok) {
        throw new Error(intentData.error || 'Failed to create payment intent')
      }

      // 2. Confirm card payment with Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error('Card element not found')

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
              email: shippingInfo.email,
            },
          },
        }
      )

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed')
      }

      if (paymentIntent?.status !== 'succeeded') {
        throw new Error('Payment was not successful')
      }

      // 3. Save order to database
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingInfo,
          totalUsd,
          currency,
          paymentMethod: 'stripe',
          paymentIntentId: paymentIntent.id,
        }),
      })

      const checkoutData = await checkoutRes.json()
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || 'Failed to save order')
      }

      onSuccess(checkoutData.orderNumber)
    } catch (err: any) {
      onError(err.message || t('checkout.paymentFailedRetry'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-4 bg-white focus-within:border-[#B71C1C] focus-within:ring-1 focus-within:ring-[#B71C1C] transition-colors">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1f2937',
                '::placeholder': { color: '#9ca3af' },
                fontFamily: 'system-ui, -apple-system, sans-serif',
              },
              invalid: { color: '#dc2626' },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        isLoading={isProcessing}
        disabled={!stripe || !elements || isProcessing}
      >
        <Lock className="w-4 h-4 mr-2" />
        {t('checkout.payNow')} {formatPrice(totalUsd)}
      </Button>
    </div>
  )
}

// --- Wrapper that loads Stripe and provides Elements context ---

interface StripeCardFormProps {
  totalUsd: number
  items: any[]
  shippingInfo: any
  currency: string
  onSuccess: (orderNumber: string) => void
  onError: (error: string) => void
}

export function StripeCardForm(props: StripeCardFormProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyError, setKeyError] = useState<string | null>(null)

  useEffect(() => {
    const fetchKey = async () => {
      try {
        // Try env var first, then DB
        const envKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        if (envKey) {
          setStripePromise(loadStripe(envKey))
          setLoading(false)
          return
        }

        const res = await fetch('/api/stripe/publishable-key')
        const data = await res.json()
        if (!res.ok || !data.publishableKey) {
          setKeyError(data.error || 'Stripe not configured')
          setLoading(false)
          return
        }
        setStripePromise(loadStripe(data.publishableKey))
        setLoading(false)
      } catch {
        setKeyError('Failed to load Stripe')
        setLoading(false)
      }
    }
    fetchKey()
  }, [])

  if (loading) {
    return <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
  }

  if (keyError || !stripePromise) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
        {keyError || 'Stripe is not configured. Please contact support.'}
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCardFormInner {...props} />
    </Elements>
  )
}
