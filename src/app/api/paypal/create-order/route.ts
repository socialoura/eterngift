import { NextRequest, NextResponse } from 'next/server'

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
    const { totalUsd, items, shippingInfo } = body

    if (!totalUsd || !items || !shippingInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalUsd.toFixed(2),
          },
          description: items.map((item: any) => item.productName).join(', '),
        },
      ],
      application_context: {
        brand_name: 'EternGift',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://eterngift.com'}/api/paypal/capture`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://eterngift.com'}/checkout`,
      },
    }

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('PayPal create order error:', data)
      throw new Error(data.message || 'Failed to create PayPal order')
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
    })
  } catch (error) {
    console.error('PayPal create order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
