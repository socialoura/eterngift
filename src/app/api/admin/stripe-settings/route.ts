import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getStripeSettings, updateStripeSettings, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const settings = await getStripeSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching stripe settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { secretKey, publishableKey } = await request.json()
    
    if (!secretKey?.startsWith('sk_')) {
      return NextResponse.json({ error: 'Invalid secret key format' }, { status: 400 })
    }
    if (!publishableKey?.startsWith('pk_')) {
      return NextResponse.json({ error: 'Invalid publishable key format' }, { status: 400 })
    }

    await updateStripeSettings(secretKey, publishableKey)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stripe settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
