import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { updatePromoCode, deletePromoCode } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { code } = await params
    const data = await request.json()
    await updatePromoCode(code, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating promo code:', error)
    return NextResponse.json({ error: 'Failed to update promo code' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { code } = await params
    await deletePromoCode(code)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promo code:', error)
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 })
  }
}
