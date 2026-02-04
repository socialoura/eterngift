import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { updateProduct } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { productId } = await params
    const allowedIds = new Set(['eternal-rose-bear', 'eternal-rose-box'])
    if (!allowedIds.has(productId)) {
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

    await updateProduct(productId, { basePrice: parsedBasePrice, stock: parsedStock })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
