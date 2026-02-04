import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getGoogleAdsExpenses, upsertGoogleAdsExpense, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const expenses = await getGoogleAdsExpenses()
    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { month, amount } = await request.json()
    await upsertGoogleAdsExpense(month, amount)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
