import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getSetting } from '@/lib/db'

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const secretKey = await getSetting('stripe_secret_key')
    if (!secretKey) return NextResponse.json({ valid: false })
    
    // Test Stripe connection
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { Authorization: `Bearer ${secretKey}` }
    })
    
    return NextResponse.json({ valid: res.ok })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
