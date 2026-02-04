import { NextRequest, NextResponse } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'
import { sendOrderConfirmationEmail, sendDiscordNotification } from '@/lib/email'
import { createOrder } from '@/lib/db'

const PAYPAL_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error_description || 'Failed to get PayPal access token')
  }

  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paypalOrderId, items, shippingInfo, totalUsd, currency } = body

    if (!paypalOrderId || !items || !shippingInfo || !totalUsd) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    // Capture the PayPal order
    const captureResponse = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const captureData = await captureResponse.json()

    if (!captureResponse.ok) {
      console.error('PayPal capture error:', captureData)
      throw new Error(captureData.message || 'Failed to capture PayPal payment')
    }

    if (captureData.status !== 'COMPLETED') {
      throw new Error(`Payment not completed. Status: ${captureData.status}`)
    }

    // Payment successful - create order in database
    const orderNumber = generateOrderNumber()
    const paymentId = captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id || paypalOrderId

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
        paymentId,
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
    }

    // Send confirmation email
    await sendOrderConfirmationEmail({
      orderNumber,
      items,
      shippingInfo,
      totalUsd,
      currency,
      paymentMethod: 'paypal',
    })

    // Send Discord notification
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
      paymentId,
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to capture PayPal payment' },
      { status: 500 }
    )
  }
}
