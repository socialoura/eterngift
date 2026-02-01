'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
        
        return new Intl.NumberFormat('en-US', {
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
