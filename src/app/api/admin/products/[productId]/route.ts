import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { updateProduct } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { productId } = await params
    const { basePrice, stock } = await request.json()
    await updateProduct(productId, { basePrice, stock })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
