'use client'

import { useEffect, useState } from 'react'

type StorefrontProduct = {
  id: string
  base_price: number
  stock: number
}

export function useStorefrontProducts() {
  const [productsById, setProductsById] = useState<Record<string, StorefrontProduct>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/storefront/products', { cache: 'no-store' })
        const data = await res.json()
        const list: StorefrontProduct[] = Array.isArray(data?.products) ? data.products : []

        if (cancelled) return

        const mapped: Record<string, StorefrontProduct> = {}
        for (const p of list) {
          if (!p?.id) continue
          mapped[p.id] = {
            id: p.id,
            base_price: Number(p.base_price),
            stock: Number(p.stock),
          }
        }
        setProductsById(mapped)
      } catch {
        if (!cancelled) setProductsById({})
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { productsById, loading }
}
