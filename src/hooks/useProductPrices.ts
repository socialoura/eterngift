'use client'

import { useState, useEffect } from 'react'

interface ProductPrices {
  'eternal-rose-bear': number
  'eternal-rose-box': number
}

const DEFAULT_PRICES: ProductPrices = {
  'eternal-rose-bear': 29.99,
  'eternal-rose-box': 19.99,
}

let cachedPrices: ProductPrices | null = null
let fetchPromise: Promise<ProductPrices> | null = null

async function fetchPrices(): Promise<ProductPrices> {
  try {
    const response = await fetch('/api/products/prices', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    if (!response.ok) throw new Error('Failed to fetch prices')
    const data = await response.json()
    return data.prices as ProductPrices
  } catch (error) {
    console.error('Error fetching prices:', error)
    return DEFAULT_PRICES
  }
}

export function useProductPrices() {
  const [prices, setPrices] = useState<ProductPrices>(cachedPrices || DEFAULT_PRICES)
  const [loading, setLoading] = useState(!cachedPrices)

  useEffect(() => {
    if (cachedPrices) {
      setPrices(cachedPrices)
      setLoading(false)
      return
    }

    if (!fetchPromise) {
      fetchPromise = fetchPrices()
    }

    fetchPromise.then((fetchedPrices) => {
      cachedPrices = fetchedPrices
      setPrices(fetchedPrices)
      setLoading(false)
    })
  }, [])

  return { prices, loading }
}

export function getProductPrice(productId: string): number {
  if (cachedPrices) {
    return cachedPrices[productId as keyof ProductPrices] || DEFAULT_PRICES[productId as keyof ProductPrices] || 29.99
  }
  return DEFAULT_PRICES[productId as keyof ProductPrices] || 29.99
}
