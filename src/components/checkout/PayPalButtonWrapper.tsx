'use client'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface PayPalButtonWrapperProps {
  totalUsd: number
  items: {
    productId: string
    productName: string
    priceUsd: number
    quantity: number
    engravingLeftHeart?: string | null
    engravingRightHeart?: string | null
  }[]
  shippingInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  currency: string
  onSuccess: (orderNumber: string) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function PayPalButtonWrapper({
  totalUsd,
  items,
  shippingInfo,
  currency,
  onSuccess,
  onError,
  disabled = false,
}: PayPalButtonWrapperProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return (
      <div className="text-center text-red-500 text-sm py-4">
        PayPal is not configured
      </div>
    )
  }

  const createOrder = async () => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalUsd,
          items,
          shippingInfo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create PayPal order')
      }

      return data.orderId
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to create PayPal order')
      throw error
    }
  }

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
          items,
          shippingInfo,
          totalUsd,
          currency,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to capture PayPal payment')
      }

      onSuccess(result.orderNumber)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed')
    }
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        }}
        disabled={disabled}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => {
          console.error('PayPal error:', err)
          onError('PayPal payment failed. Please try again.')
        }}
        onCancel={() => {
          onError('Payment cancelled')
        }}
      />
    </PayPalScriptProvider>
  )
}
