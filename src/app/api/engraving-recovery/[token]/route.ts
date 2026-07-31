import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { z } from 'zod'
import {
  getRecoveryToken,
  markRecoveryTokenUsed,
  updateOrderItemEngraving,
} from '@/lib/db'

const Body = z.object({
  left: z.string().max(15).optional().default(''),
  right: z.string().max(15).optional().default(''),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const row = await getRecoveryToken(token)

  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const now = Date.now()
  if (row.used_at) return NextResponse.json({ error: 'already_used' }, { status: 410 })
  if (new Date(row.expires_at).getTime() < now) {
    return NextResponse.json({ error: 'expired' }, { status: 410 })
  }

  // Return minimal info for the form (don't leak data)
  return NextResponse.json({
    orderNumber: row.order_number,
    customerName: row.customer_name,
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const row = await getRecoveryToken(token)
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (row.used_at) return NextResponse.json({ error: 'already_used' }, { status: 410 })
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'expired' }, { status: 410 })
  }

  let body
  try {
    body = Body.parse(await request.json())
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const left = body.left.trim() || null
  const right = body.right.trim() || null

  // Update the FIRST order_item for this order (1 product per order so far).
  const items = await sql`
    SELECT id FROM order_items WHERE order_id = ${row.order_id} ORDER BY id ASC LIMIT 1
  `
  const item = items.rows[0]
  if (!item) return NextResponse.json({ error: 'no_item' }, { status: 400 })

  await updateOrderItemEngraving(item.id, left, right)
  await markRecoveryTokenUsed(row.id)

  return NextResponse.json({ success: true })
}