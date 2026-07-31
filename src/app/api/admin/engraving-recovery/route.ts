import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sql } from '@vercel/postgres'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { createRecoveryToken } from '@/lib/db'
import { sendEngravingRecoveryEmail } from '@/lib/email'

/**
 * Admin endpoint: creates a recovery token for an order and emails the customer.
 * Body: { orderNumber: string, lang?: 'en' | 'fr' }
 */
export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const { orderNumber, lang } = await request.json()
    if (!orderNumber) {
      return NextResponse.json({ error: 'Missing orderNumber' }, { status: 400 })
    }

    // Fetch order + first item (for product name)
    const orderRes = await sql`
      SELECT id, order_number, customer_email, customer_name, customer_currency
      FROM orders WHERE order_number = ${orderNumber}
    `
    const order = orderRes.rows[0]
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const itemRes = await sql`
      SELECT id, product_name FROM order_items
      WHERE order_id = ${order.id}
      ORDER BY id ASC LIMIT 1
    `
    const item = itemRes.rows[0]
    if (!item) return NextResponse.json({ error: 'No item on order' }, { status: 400 })

    // Generate URL-safe token (32 chars)
    const token = crypto.randomBytes(24).toString('base64url')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await createRecoveryToken(order.id, token, expiresAt)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eterngift.com'
    const recoveryUrl = `${baseUrl}/recover/${token}`

    const sent = await sendEngravingRecoveryEmail({
      to: order.customer_email,
      customerName: order.customer_name || '',
      orderNumber: order.order_number,
      productName: item.product_name,
      recoveryUrl,
      lang: (order.customer_currency === 'EUR' ? 'fr' : lang) ?? 'en',
    })

    return NextResponse.json({
      success: sent,
      recoveryUrl,
      token,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('Engraving recovery error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Server error' },
      { status: 500 }
    )
  }
}