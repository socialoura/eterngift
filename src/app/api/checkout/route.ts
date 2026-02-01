import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'

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

    // In production, this would:
    // 1. Create a Stripe Payment Intent
    // 2. Save order to database
    // 3. Send confirmation email
    // 4. Send Discord notification

    // For now, simulate successful payment
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
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Send Discord notification (if webhook URL is configured)
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `🎉 New Order: #${orderNumber}`,
                color: 0xb71c1c,
                fields: [
                  {
                    name: 'Customer',
                    value: `${order.customerName} (${order.customerEmail})`,
                    inline: true,
                  },
                  {
                    name: 'Total',
                    value: `$${totalUsd.toFixed(2)} USD`,
                    inline: true,
                  },
                  {
                    name: 'Items',
                    value: items
                      .map((item: { productName: string; quantity: number }) => `${item.productName} x${item.quantity}`)
                      .join(', '),
                  },
                  {
                    name: 'Address',
                    value: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`,
                  },
                  {
                    name: 'Payment',
                    value: paymentMethod === 'stripe' ? 'Credit Card' : 'PayPal',
                    inline: true,
                  },
                  {
                    name: 'Status',
                    value: '⏳ Pending',
                    inline: true,
                  },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
      } catch (discordError) {
        console.error('Discord notification failed:', discordError)
      }
    }

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
