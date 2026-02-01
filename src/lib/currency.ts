const EXCHANGE_RATES_CACHE: { rates: Record<string, number>; timestamp: number } = {
  rates: {},
  timestamp: 0,
}

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

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

export async function getExchangeRates(): Promise<Record<string, number>> {
  const now = Date.now()
  
  if (EXCHANGE_RATES_CACHE.timestamp > now - CACHE_DURATION && Object.keys(EXCHANGE_RATES_CACHE.rates).length > 0) {
    return EXCHANGE_RATES_CACHE.rates
  }

  try {
    const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY
    if (!apiKey) {
      return FALLBACK_RATES
    }

    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    )
    
    if (!response.ok) {
      return FALLBACK_RATES
    }

    const data = await response.json()
    EXCHANGE_RATES_CACHE.rates = data.conversion_rates
    EXCHANGE_RATES_CACHE.timestamp = now
    
    return data.conversion_rates
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    return FALLBACK_RATES
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string = 'USD',
  toCurrency: string = 'USD'
): Promise<number> {
  if (fromCurrency === toCurrency) return amount

  const rates = await getExchangeRates()
  const fromRate = rates[fromCurrency] || 1
  const toRate = rates[toCurrency] || 1

  const amountInUsd = amount / fromRate
  return amountInUsd * toRate
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    MXN: 'MX$',
  }
  return symbols[currency] || currency
}

export function detectUserCurrency(): string {
  if (typeof window === 'undefined') return 'USD'
  
  try {
    const locale = navigator.language || 'en-US'
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-CA': 'CAD',
      'en-AU': 'AUD',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'es-ES': 'EUR',
      'it-IT': 'EUR',
      'ja-JP': 'JPY',
      'zh-CN': 'CNY',
      'fr-CA': 'CAD',
    }
    
    return currencyMap[locale] || 'USD'
  } catch {
    return 'USD'
  }
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
]
