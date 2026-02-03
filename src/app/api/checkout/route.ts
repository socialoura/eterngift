import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendDiscordNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingInfo, totalUsd, currency, paymentMethod } = body

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
      paymentMethod,
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
      paymentMethod: paymentMethod || 'card',
    })

    // Send Discord notification to you
    await sendDiscordNotification({
      orderNumber,
      items,
      shippingInfo,
      totalUsd,
      currency,
      paymentMethod: paymentMethod || 'card',
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      order,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
