'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { useCurrencyStore } from '@/store/currency'

interface I18nContextType {
  locale: Locale
  dictionary: Dictionary
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({
  children,
  locale,
  dictionary,
  defaultCurrency,
}: {
  children: ReactNode
  locale: Locale
  dictionary: Dictionary
  defaultCurrency: string
}) {
  const setCurrency = useCurrencyStore((state) => state.setCurrency)
  const setRates = useCurrencyStore((state) => state.setRates)

  const normalizeCurrency = (value: string | undefined | null) => {
    if (!value) return undefined
    const upper = value.toUpperCase()
    const allowed = new Set(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'MXN'])
    return allowed.has(upper) ? upper : undefined
  }

  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
  }

  const detectCurrencyFromNavigator = () => {
    if (typeof navigator === 'undefined') return undefined
    const locale = Intl.NumberFormat().resolvedOptions().locale || navigator.language
    const region = locale.split('-')[1]?.toUpperCase()

    const regionToCurrency: Record<string, string> = {
      US: 'USD',
      CA: 'CAD',
      GB: 'GBP',
      AU: 'AUD',
      CH: 'CHF',
      JP: 'JPY',
      CN: 'CNY',
      IN: 'INR',
      MX: 'MXN',
    }

    const detected = region ? regionToCurrency[region] : undefined
    if (detected) return detected

    const euroRegions = new Set([
      'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'SI', 'SK',
    ])
    if (region && euroRegions.has(region)) return 'EUR'

    return undefined
  }

  // Set currency based on locale on mount
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      const preferred = normalizeCurrency(getCookie('preferred-currency'))
      const detected = normalizeCurrency(detectCurrencyFromNavigator())
      const fallback = normalizeCurrency(defaultCurrency) || 'USD'
      const desiredCurrency = preferred || detected || fallback

      try {
        const res = await fetch('/api/currency/rates', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled && data?.rates && typeof data.rates === 'object') {
          setRates(data.rates)
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setCurrency(desiredCurrency)
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [defaultCurrency, setCurrency, setRates])

  // Helper function to get nested translation
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = dictionary
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        console.warn(`Translation not found: ${key}`)
        return key
      }
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ locale, dictionary, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  return context
}

export function useLocale() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider')
  }
  return context.locale
}
