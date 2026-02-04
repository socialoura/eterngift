'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

interface CurrencyState {
  currency: string
  exchangeRate: number
  rates: Record<string, number>
  setCurrency: (currency: string) => void
  setRates: (rates: Record<string, number>) => void
  convertFromUsd: (amount: number) => number
  formatPrice: (amountUsd: number) => string
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      exchangeRate: 1,
      rates: { USD: 1 },

      setCurrency: (currency: string) => {
        const rates = get().rates
        const rate = rates[currency] || 1
        set({ currency, exchangeRate: rate })
      },

      setRates: (rates: Record<string, number>) => {
        const currency = get().currency
        const rate = rates[currency] || 1
        set({ rates, exchangeRate: rate })
      },

      convertFromUsd: (amount: number) => {
        return amount * get().exchangeRate
      },

      formatPrice: (amountUsd: number) => {
        const { currency, exchangeRate } = get()
        const convertedAmount = amountUsd * exchangeRate

        const currencyLocales: Record<string, string> = {
          USD: 'en-US',
          EUR: 'fr-FR',
          GBP: 'en-GB',
          CAD: 'en-CA',
          AUD: 'en-AU',
          CHF: 'de-CH',
        }

        const locale =
          currencyLocales[currency] ??
          (typeof navigator !== 'undefined' ? navigator.language : 'en-US')
        
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(convertedAmount)
      },
    }),
    {
      name: 'eterngift-currency',
    }
  )
)

// Hook to check if store has hydrated from localStorage
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  
  useEffect(() => {
    setHydrated(true)
  }, [])
  
  return hydrated
}
