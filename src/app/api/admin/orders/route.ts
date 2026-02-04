import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getAllOrders, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
