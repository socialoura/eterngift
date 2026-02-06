import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripeSecretKey } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { totalUsd, currency, metadata } = await request.json()

    if (!totalUsd || totalUsd <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const secretKey = await getStripeSecretKey()
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set up Stripe keys in admin settings.' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(secretKey)

    // Convert USD to cents
    const amountInCents = Math.round(totalUsd * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: (currency || 'usd').toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Stripe create-payment-intent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
