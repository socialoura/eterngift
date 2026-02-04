import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendDiscordNotification } from '@/lib/email'
import { createOrder } from '@/lib/db'

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

    // Save order to database
    try {
      await createOrder({
        orderNumber,
        customerEmail: shippingInfo.email,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerCurrency: currency || 'USD',
        subtotalUsd: totalUsd,
        taxUsd: 0,
        totalUsd,
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
        paymentMethod: 'paypal',
        items: items.map((item: any) => ({
          productId: item.productId || 'unknown',
          productName: item.productName,
          priceUsd: item.priceUsd,
          quantity: item.quantity || 1,
          roseColor: item.roseColor,
          necklaceColor: item.necklaceColor,
          engravingLeftHeart: item.engravingLeftHeart,
          engravingRightHeart: item.engravingRightHeart,
        })),
      })
      console.log(`Order ${orderNumber} saved to database (PayPal)`)
    } catch (dbError) {
      console.error('Failed to save order to database:', dbError)
      // Continue anyway - don't fail the checkout if DB save fails
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
    })
  } catch (error) {
    console.error('PayPal checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to process PayPal checkout' },
      { status: 500 }
    )
  }
}
