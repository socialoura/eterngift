import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { sendTelegramNotification } from '@/lib/email'

/**
 * Admin-only test endpoint for the Telegram notification.
 * Sends a sample order summary to TELEGRAM_CHAT_ID.
 *
 * DELETE THIS ROUTE after confirming notifications work in production.
 */
export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const ok = await sendTelegramNotification({
      orderNumber: 'TEST-1234',
      items: [
        {
          productName: 'Eternal Rose Bear with Engraved Necklace',
          quantity: 1,
          priceUsd: 29.99,
          engravingLeftHeart: 'Test',
          engravingRightHeart: 'OK',
        },
      ],
      shippingInfo: {
        firstName: 'Ilyès',
        lastName: 'Test',
        email: 'test@eterngift.com',
        phone: '+33600000000',
        address: '1 rue de la Test',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
      },
      totalUsd: 29.99,
      currency: 'USD',
      paymentMethod: 'stripe',
    })

    return NextResponse.json({ ok })
  } catch (error) {
    console.error('Telegram test error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}