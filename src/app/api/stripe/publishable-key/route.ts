import { NextResponse } from 'next/server'
import { getStripePublishableKey } from '@/lib/db'

export async function GET() {
  try {
    const publishableKey = await getStripePublishableKey()
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'Stripe publishable key not configured' },
        { status: 500 }
      )
    }
    return NextResponse.json({ publishableKey })
  } catch (error) {
    console.error('Error fetching Stripe publishable key:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Stripe key' },
      { status: 500 }
    )
  }
}
