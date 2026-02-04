import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const result = await sql`SELECT id, name, price_usd FROM products ORDER BY id`
    
    // Map numeric IDs to string slugs for frontend compatibility
    const prices: Record<string, number> = {}
    for (const row of result.rows) {
      if (row.id === 1) {
        prices['eternal-rose-bear'] = Number(row.price_usd)
      } else if (row.id === 2) {
        prices['eternal-rose-box'] = Number(row.price_usd)
      }
    }

    return NextResponse.json({ 
      prices,
      // Also return by numeric ID for other uses
      productsById: result.rows.reduce((acc: Record<number, number>, row) => {
        acc[row.id] = Number(row.price_usd)
        return acc
      }, {})
    })
  } catch (error) {
    console.error('Error fetching product prices:', error)
    // Return default prices if DB fails
    return NextResponse.json({ 
      prices: {
        'eternal-rose-bear': 29.99,
        'eternal-rose-box': 19.99
      },
      productsById: {
        1: 29.99,
        2: 19.99
      }
    })
  }
}
