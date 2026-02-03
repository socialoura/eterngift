import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendDiscordNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingInfo, totalUsd, currency } = body

    if (!items || !shippingInfo || !totalUsd) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const orderNumber = generateOrderNumber()

    const order = {
      orderNumber,
      customerEmail: shippingInfo.email,
      customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
      customerCurrency: currency,
      totalUsd,
      items,
      shippingAddress: {
        street: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
      paymentMethod: 'paypal',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    // Send confirmation email to customer
    await sendOrderConfirmationEmail({
      orderNumber,
      items,
      shippingInfo,
      totalUsd,
      currency,
      paymentMethod: 'paypal',
    })

    // Send Discord notification to you
    await sendDiscordNotification({
      orderNumber,
      items,
      shippingInfo,
      totalUsd,
      currency,
      paymentMethod: 'paypal',
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      order,
    })
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal checkout' },
      { status: 500 }
    )
  }
}
