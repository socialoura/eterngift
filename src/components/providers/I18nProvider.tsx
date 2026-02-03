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

  // Set currency based on locale on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferred-currency')
    if (!savedCurrency) {
      setCurrency(defaultCurrency as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD')
    }
  }, [defaultCurrency, setCurrency])

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
