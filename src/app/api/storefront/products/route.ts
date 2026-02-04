import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const FALLBACK_PRODUCTS = [
  { id: 'eternal-rose-bear', base_price: 29.99, stock: 100 },
  { id: 'eternal-rose-box', base_price: 19.99, stock: 100 },
] as const

// Map numeric IDs to string slugs
const ID_TO_SLUG: Record<number, string> = {
  1: 'eternal-rose-bear',
  2: 'eternal-rose-box',
}

export async function GET() {
  try {
    const result = await sql`SELECT id, price_usd, stock FROM products ORDER BY id`
    
    const products = result.rows.map(row => ({
      id: ID_TO_SLUG[row.id] || `product-${row.id}`,
      base_price: Number(row.price_usd),
      stock: Number(row.stock),
    }))

    // If no products found, return fallback
    if (products.length === 0) {
      return NextResponse.json({ products: [...FALLBACK_PRODUCTS] })
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching storefront products:', error)
    return NextResponse.json({ products: [...FALLBACK_PRODUCTS] })
  }
}
