import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { sql } from '@vercel/postgres'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { productId } = await params
    const numericId = parseInt(productId, 10)
    
    if (isNaN(numericId) || numericId < 1) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 })
    }

    const { basePrice, stock } = await request.json()
    const parsedBasePrice = basePrice !== undefined ? Number(basePrice) : undefined
    const parsedStock = stock !== undefined ? Number(stock) : undefined

    if (parsedBasePrice !== undefined && (!Number.isFinite(parsedBasePrice) || parsedBasePrice < 0)) {
      return NextResponse.json({ error: 'Invalid basePrice' }, { status: 400 })
    }
    if (parsedStock !== undefined && (!Number.isFinite(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock))) {
      return NextResponse.json({ error: 'Invalid stock' }, { status: 400 })
    }

    // Update product using Prisma schema columns
    if (parsedBasePrice !== undefined && parsedStock !== undefined) {
      await sql`UPDATE products SET price_usd = ${parsedBasePrice}, stock = ${parsedStock}, updated_at = NOW() WHERE id = ${numericId}`
    } else if (parsedBasePrice !== undefined) {
      await sql`UPDATE products SET price_usd = ${parsedBasePrice}, updated_at = NOW() WHERE id = ${numericId}`
    } else if (parsedStock !== undefined) {
      await sql`UPDATE products SET stock = ${parsedStock}, updated_at = NOW() WHERE id = ${numericId}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
