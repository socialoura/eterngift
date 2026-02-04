import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getPromoFieldEnabled, setPromoFieldEnabled, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const enabled = await getPromoFieldEnabled()
    return NextResponse.json({ enabled })
  } catch (error) {
    console.error('Error fetching promo settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { enabled } = await request.json()
    await setPromoFieldEnabled(enabled)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating promo settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
