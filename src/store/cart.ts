'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/lib/types'

interface CartState {
  items: CartItem[]
  currency: string
  exchangeRate: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  setCurrency: (currency: string, rate: number) => void
  getTotalItems: () => number
  getSubtotalUsd: () => number
  getSubtotalLocal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',
      exchangeRate: 1,

      addItem: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity }],
          }
        })
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      setCurrency: (currency: string, rate: number) => {
        set({ currency, exchangeRate: rate })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotalUsd: () => {
        return get().items.reduce(
          (total, item) => total + item.product.priceUsd * item.quantity,
          0
        )
      },

      getSubtotalLocal: () => {
        const subtotalUsd = get().getSubtotalUsd()
        return subtotalUsd * get().exchangeRate
      },
    }),
    {
      name: 'eterngift-cart',
    }
  )
)
