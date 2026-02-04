import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getPromoCodes, createPromoCode, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const codes = await getPromoCodes()
    return NextResponse.json({ codes })
  } catch (error) {
    console.error('Error fetching promo codes:', error)
    return NextResponse.json({ error: 'Failed to fetch promo codes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const data = await request.json()
    await createPromoCode(data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating promo code:', error)
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 })
  }
}
