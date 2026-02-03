'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/lib/types'

interface CartState {
  items: CartItem[]
  currency: string
  exchangeRate: number
  addItem: (
    product: Product,
    quantity?: number,
    customizations?: { engravingLeftHeart?: string; engravingRightHeart?: string }
  ) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  setCurrency: (currency: string, rate: number) => void
  getTotalItems: () => number
  getSubtotalUsd: () => number
  getSubtotalLocal: () => number
}

function createCartItemId(
  product: Product,
  customizations?: { engravingLeftHeart?: string; engravingRightHeart?: string }
) {
  const left = (customizations?.engravingLeftHeart || '').trim()
  const right = (customizations?.engravingRightHeart || '').trim()
  return `${product.id}::${product.name}::${left}::${right}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'USD',
      exchangeRate: 1,

      addItem: (
        product: Product,
        quantity: number = 1,
        customizations?: { engravingLeftHeart?: string; engravingRightHeart?: string }
      ) => {
        set((state) => {
          const id = createCartItemId(product, customizations)
          const existingItem = state.items.find((item) => item.id === id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id,
                product,
                quantity,
                engravingLeftHeart: customizations?.engravingLeftHeart?.trim() || undefined,
                engravingRightHeart: customizations?.engravingRightHeart?.trim() || undefined,
              },
            ],
          }
        })
      },

      removeItem: (cartItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }))
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
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
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState) return persistedState
        const items = Array.isArray(persistedState.items) ? persistedState.items : []

        return {
          ...persistedState,
          items: items.map((item: any) => {
            if (item?.id) return item
            if (!item?.product) return item

            const id = createCartItemId(item.product, {
              engravingLeftHeart: item.engravingLeftHeart,
              engravingRightHeart: item.engravingRightHeart,
            })

            return { ...item, id }
          }),
        }
      },
    }
  )
)
