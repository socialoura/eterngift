import { NextResponse } from 'next/server'

const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.50,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
}

let cachedRates: { rates: Record<string, number>; timestamp: number } = {
  rates: FALLBACK_RATES,
  timestamp: 0,
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export async function GET() {
  const now = Date.now()

  // Return cached rates if still valid
  if (cachedRates.timestamp > now - CACHE_DURATION) {
    return NextResponse.json({
      rates: cachedRates.rates,
      cached: true,
      updatedAt: new Date(cachedRates.timestamp).toISOString(),
    })
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        rates: FALLBACK_RATES,
        cached: false,
        fallback: true,
      })
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch rates')
    }

    const data = await response.json()

    cachedRates = {
      rates: data.conversion_rates,
      timestamp: now,
    }

    return NextResponse.json({
      rates: data.conversion_rates,
      cached: false,
      updatedAt: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    return NextResponse.json({
      rates: FALLBACK_RATES,
      cached: false,
      fallback: true,
      error: 'Using fallback rates',
    })
  }
}
