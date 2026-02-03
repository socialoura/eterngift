import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'

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

    // In production, this would create a PayPal order
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
      paymentMethod: 'paypal',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Send Discord notification
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            embeds: [
              {
                title: `🎉 New Order: #${orderNumber}`,
                color: 0x0070ba,
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
                      .map((item: { productName: string; quantity: number; engravingLeftHeart?: string | null; engravingRightHeart?: string | null }) => {
                        const left = (item.engravingLeftHeart || '').trim()
                        const right = (item.engravingRightHeart || '').trim()
                        const engr = left || right ? ` (G:${left || '-'} | D:${right || '-'})` : ''
                        return `${item.productName} x${item.quantity}${engr}`
                      })
                      .join(', '),
                  },
                  {
                    name: 'Payment',
                    value: 'PayPal',
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
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal checkout' },
      { status: 500 }
    )
  }
}
