import { NextResponse } from 'next/server'
import { getProduct, initDatabase } from '@/lib/db'

const FALLBACK_PRODUCTS = [
  { id: 'eternal-rose-bear', base_price: 29.99, stock: 100 },
  { id: 'eternal-rose-box', base_price: 19.99, stock: 100 },
] as const

export async function GET() {
  try {
    await initDatabase()

    const products = await Promise.all(
      FALLBACK_PRODUCTS.map(async (fallback) => {
        const row = await getProduct(fallback.id)
        if (!row) return fallback

        return {
          id: row.id,
          base_price: Number(row.base_price),
          stock: typeof row.stock === 'number' ? row.stock : Number(row.stock ?? fallback.stock),
        }
      })
    )

    return NextResponse.json({ products })
  } catch {
    return NextResponse.json({ products: [...FALLBACK_PRODUCTS] })
  }
}
