'use client'

import { useEffect, useState } from 'react'

let cachedProductsById: Record<string, StorefrontProduct> | null = null
let cachedLoadedAt = 0
let inflight: Promise<Record<string, StorefrontProduct>> | null = null

type StorefrontProduct = {
  id: string
  base_price: number
  stock: number
}

export function useStorefrontProducts() {
  const [productsById, setProductsById] = useState<Record<string, StorefrontProduct>>(cachedProductsById || {})
  const [loading, setLoading] = useState(!cachedProductsById)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const isCacheFresh = cachedProductsById && Date.now() - cachedLoadedAt < 60_000
        if (isCacheFresh) {
          if (!cancelled) {
            setProductsById(cachedProductsById || {})
            setLoading(false)
          }
          return
        }

        if (!inflight) {
          inflight = fetch('/api/storefront/products', { cache: 'no-store' })
            .then((res) => res.json())
            .then((data) => {
              const list: StorefrontProduct[] = Array.isArray(data?.products) ? data.products : []
              const mapped: Record<string, StorefrontProduct> = {}
              for (const p of list) {
                if (!p?.id) continue
                mapped[p.id] = {
                  id: p.id,
                  base_price: Number((p as any).base_price),
                  stock: Number((p as any).stock),
                }
              }
              cachedProductsById = mapped
              cachedLoadedAt = Date.now()
              return mapped
            })
            .finally(() => {
              inflight = null
            })
        }

        const mapped = await inflight

        if (cancelled) return

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
