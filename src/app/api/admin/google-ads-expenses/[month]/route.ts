import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { upsertGoogleAdsExpense, deleteGoogleAdsExpense } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ month: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { month } = await params
    const { amount } = await request.json()
    await upsertGoogleAdsExpense(month, amount)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ month: string }> }) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { month } = await params
    await deleteGoogleAdsExpense(month)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}
