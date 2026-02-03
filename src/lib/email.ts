import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderItem {
  productName: string
  quantity: number
  priceUsd: number
  engravingLeftHeart?: string | null
  engravingRightHeart?: string | null
}

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface OrderConfirmationData {
  orderNumber: string
  items: OrderItem[]
  shippingInfo: ShippingInfo
  totalUsd: number
  currency: string
  paymentMethod: string
}

function generateOrderConfirmationEmail(data: OrderConfirmationData): string {
  const { orderNumber, items, shippingInfo, totalUsd, paymentMethod } = data

  const itemsHtml = items
    .map((item) => {
      const engravingInfo =
        item.engravingLeftHeart || item.engravingRightHeart
          ? `<br><span style="color: #888; font-size: 12px;">Engraving: Left "${item.engravingLeftHeart || '-'}" | Right "${item.engravingRightHeart || '-'}"</span>`
          : ''
      return `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #eee;">
            <strong>${item.productName}</strong>${engravingInfo}
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: right;">$${(item.priceUsd * item.quantity).toFixed(2)}</td>
        </tr>
      `
    })
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - EternGift</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B1538 0%, #B71C1C 50%, #D4AF88 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">EternGift</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px; letter-spacing: 2px;">FOREVER IN LOVE</p>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #FFE5E5, #FFF0F0); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">💝</span>
              </div>
              <h2 style="color: #333; margin: 0 0 10px 0; font-size: 28px;">Thank You for Your Order!</h2>
              <p style="color: #666; margin: 0; font-size: 16px;">Your order has been confirmed and is being prepared with love.</p>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <div style="background: linear-gradient(135deg, #FFF5F5, #FFF0F0); border: 2px solid #FFE5E5; border-radius: 12px; padding: 20px; display: inline-block;">
                <p style="color: #888; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                <p style="color: #B71C1C; margin: 0; font-size: 24px; font-weight: bold;">#${orderNumber}</p>
              </div>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #333; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #B71C1C; padding-bottom: 10px;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <tr style="background-color: #f9f9f9;">
                  <th style="padding: 12px 16px; text-align: left; color: #666; font-size: 12px; text-transform: uppercase;">Product</th>
                  <th style="padding: 12px 16px; text-align: center; color: #666; font-size: 12px; text-transform: uppercase;">Qty</th>
                  <th style="padding: 12px 16px; text-align: right; color: #666; font-size: 12px; text-transform: uppercase;">Price</th>
                </tr>
                ${itemsHtml}
                <tr style="background-color: #f9f9f9;">
                  <td colspan="2" style="padding: 16px; text-align: right; font-weight: bold; color: #333;">Shipping</td>
                  <td style="padding: 16px; text-align: right; color: #27ae60; font-weight: bold;">FREE</td>
                </tr>
                <tr style="background: linear-gradient(135deg, #B71C1C, #8B1538);">
                  <td colspan="2" style="padding: 16px; text-align: right; font-weight: bold; color: #fff;">Total</td>
                  <td style="padding: 16px; text-align: right; color: #fff; font-weight: bold; font-size: 20px;">$${totalUsd.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping & Payment Info -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="vertical-align: top;">
                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
                      <h4 style="color: #333; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📦 Shipping Address</h4>
                      <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.6;">
                        ${shippingInfo.firstName} ${shippingInfo.lastName}<br>
                        ${shippingInfo.address}<br>
                        ${shippingInfo.city}, ${shippingInfo.postalCode}<br>
                        ${shippingInfo.country}
                      </p>
                    </div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top;">
                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px;">
                      <h4 style="color: #333; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">💳 Payment Method</h4>
                      <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.6;">
                        ${paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card'}<br>
                        <span style="color: #27ae60;">✓ Payment Confirmed</span>
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What's Next -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background: linear-gradient(135deg, #FFF5F5, #FFF0F0); border-radius: 12px; padding: 25px; text-align: center;">
                <h4 style="color: #B71C1C; margin: 0 0 15px 0; font-size: 16px;">What's Next?</h4>
                <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.8;">
                  🎁 Your gift is being carefully prepared and packaged<br>
                  📧 You'll receive a shipping notification with tracking info<br>
                  🚚 Estimated delivery: 5-7 business days
                </p>
              </div>
            </td>
          </tr>

          <!-- Contact -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <p style="color: #888; margin: 0; font-size: 14px;">
                Questions about your order? Contact us at<br>
                <a href="mailto:support@eterngift.com" style="color: #B71C1C; text-decoration: none; font-weight: bold;">support@eterngift.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #333; padding: 30px 40px; text-align: center;">
              <p style="color: #fff; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">EternGift</p>
              <p style="color: #888; margin: 0; font-size: 12px;">Made with 💕 for lovers everywhere</p>
              <p style="color: #666; margin: 15px 0 0 0; font-size: 11px;">
                © ${new Date().getFullYear()} EternGift. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email')
    return false
  }

  try {
    const html = generateOrderConfirmationEmail(data)

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'EternGift <orders@eterngift.com>',
      to: data.shippingInfo.email,
      subject: `Order Confirmed! 💝 #${data.orderNumber}`,
      html,
    })

    if (error) {
      console.error('Failed to send confirmation email:', error)
      return false
    }

    console.log(`Confirmation email sent to ${data.shippingInfo.email}`)
    return true
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return false
  }
}

export async function sendDiscordNotification(data: OrderConfirmationData): Promise<boolean> {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL not configured, skipping Discord notification')
    return false
  }

  try {
    const { orderNumber, items, shippingInfo, totalUsd, paymentMethod } = data

    const itemsList = items
      .map((item) => {
        const engr =
          item.engravingLeftHeart || item.engravingRightHeart
            ? ` ✨ Left: "${item.engravingLeftHeart || '-'}" | Right: "${item.engravingRightHeart || '-'}"`
            : ''
        return `• **${item.productName}** x${item.quantity} - $${(item.priceUsd * item.quantity).toFixed(2)}${engr}`
      })
      .join('\n')

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '🎉 **NEW ORDER RECEIVED!** 🎉',
        embeds: [
          {
            title: `Order #${orderNumber}`,
            color: paymentMethod === 'paypal' ? 0x0070ba : 0xb71c1c,
            fields: [
              {
                name: '👤 Customer',
                value: `**${shippingInfo.firstName} ${shippingInfo.lastName}**\n📧 ${shippingInfo.email}\n📱 ${shippingInfo.phone || 'N/A'}`,
                inline: true,
              },
              {
                name: '💰 Total',
                value: `**$${totalUsd.toFixed(2)} USD**\n${paymentMethod === 'paypal' ? '🅿️ PayPal' : '💳 Credit Card'}`,
                inline: true,
              },
              {
                name: '📦 Items',
                value: itemsList,
                inline: false,
              },
              {
                name: '🏠 Shipping Address',
                value: `${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.postalCode}\n${shippingInfo.country}`,
                inline: false,
              },
            ],
            footer: {
              text: 'EternGift Order System',
            },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    console.log('Discord notification sent')
    return true
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
    return false
  }
}
