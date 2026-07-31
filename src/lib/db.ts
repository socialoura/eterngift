import { sql } from '@vercel/postgres'
import { productSlugToId } from '@/lib/product-ids'

// Initialize database tables
// NOTE: products / orders / order_items / users / currency_rates are owned by
// the Prisma schema (prisma/schema.prisma, applied via `prisma db push`).
// Only the auxiliary tables that do NOT exist in the Prisma schema are created here.
export async function initDatabase() {
  try {
    // Admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        username TEXT PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Settings table (key-value store)
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Promo codes table
    await sql`
      CREATE TABLE IF NOT EXISTS promo_codes (
        code TEXT PRIMARY KEY,
        discount_type TEXT,
        discount_value DECIMAL NOT NULL DEFAULT 0,
        max_uses INT DEFAULT -1,
        current_uses INT DEFAULT 0,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Google Ads expenses table
    await sql`
      CREATE TABLE IF NOT EXISTS google_ads_expenses (
        month TEXT PRIMARY KEY,
        amount DECIMAL NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Admin functions
export async function getAdminUser(username: string) {
  const result = await sql`SELECT * FROM admin_users WHERE username = ${username}`
  return result.rows[0]
}

export async function updateAdminPassword(username: string, passwordHash: string) {
  await sql`
    INSERT INTO admin_users (username, password_hash) 
    VALUES (${username}, ${passwordHash})
    ON CONFLICT (username) DO UPDATE SET password_hash = ${passwordHash}
  `
}

// Orders functions
export interface CreateOrderData {
  orderNumber: string
  customerEmail: string
  customerName: string
  customerCurrency: string
  subtotalUsd: number
  taxUsd: number
  totalUsd: number
  shippingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentId?: string
  items: {
    productId: string
    productName: string
    priceUsd: number
    quantity: number
    roseColor?: string
    necklaceColor?: string
    engravingLeftHeart?: string
    engravingRightHeart?: string
  }[]
}

export async function createOrder(data: CreateOrderData) {
  // Insert order using Prisma schema columns
  const result = await sql`
    INSERT INTO orders (
      order_number, 
      customer_email, 
      customer_name, 
      customer_currency,
      subtotal_usd,
      tax_usd,
      total_usd,
      shipping_address_street,
      shipping_address_city,
      shipping_address_postal,
      shipping_address_country,
      payment_method,
      payment_id,
      status,
      email_sent,
      discord_notified,
      created_at, 
      updated_at
    )
    VALUES (
      ${data.orderNumber}, 
      ${data.customerEmail}, 
      ${data.customerName}, 
      ${data.customerCurrency},
      ${data.subtotalUsd},
      ${data.taxUsd},
      ${data.totalUsd},
      ${data.shippingAddress.street},
      ${data.shippingAddress.city},
      ${data.shippingAddress.postalCode},
      ${data.shippingAddress.country},
      ${data.paymentMethod},
      ${data.paymentId || null},
      'confirmed',
      true,
      true,
      NOW(), 
      NOW()
    )
    RETURNING id
  `

  const orderId = result.rows[0]?.id

  // Insert order items if we got an order ID
  if (orderId) {
    for (const item of data.items) {
      // Map product slug to numeric DB ID (single source: src/lib/product-ids.ts)
      const numericProductId = productSlugToId(item.productId)
      if (numericProductId === null) {
        console.warn(`Unknown product slug "${item.productId}", skipping order item`)
        continue
      }
      const itemTotal = item.priceUsd * item.quantity
      
      await sql`
        INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          price_usd,
          quantity,
          total_usd,
          engraving_left_heart,
          engraving_right_heart
        )
        VALUES (
          ${orderId},
          ${numericProductId},
          ${item.productName},
          ${item.priceUsd},
          ${item.quantity},
          ${itemTotal},
          ${item.engravingLeftHeart || null},
          ${item.engravingRightHeart || null}
        )
      `
    }
  }

  return data.orderNumber
}

export async function getAllOrders(filters?: { status?: string; product?: string; dateRange?: string }) {
  let query = sql`SELECT * FROM orders ORDER BY created_at DESC`

  // For now, return all orders - filtering can be added later
  const result = await query
  const orders = result.rows

  // Attach items (incl. engraving) for each order in a single batched query
  if (orders.length > 0) {
    const orderIds: number[] = orders.map((o: { id: number }) => o.id)
    const items = await sql`
      SELECT order_id, product_name, quantity, price_usd, total_usd,
             engraving_left_heart, engraving_right_heart
      FROM order_items
      WHERE order_id = ANY(${orderIds as unknown as number})
    `
    const byOrder = new Map<number, unknown[]>()
    for (const it of items.rows) {
      const arr = byOrder.get(it.order_id) || []
      arr.push(it)
      byOrder.set(it.order_id, arr)
    }
    for (const o of orders) o.items = byOrder.get(o.id) || []
  }

  return orders
}

export async function getOrder(orderNumber: string) {
  const result = await sql`SELECT * FROM orders WHERE order_number = ${orderNumber}`
  return result.rows[0]
}

export async function updateOrder(orderNumber: string, data: { status?: string; cost?: number; notes?: string }) {
  const { status, cost, notes } = data

  if (status !== undefined) {
    await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE order_number = ${orderNumber}`
  }
  if (cost !== undefined) {
    await sql`UPDATE orders SET cost = ${cost}, updated_at = NOW() WHERE order_number = ${orderNumber}`
  }
  if (notes !== undefined) {
    await sql`UPDATE orders SET notes = ${notes}, updated_at = NOW() WHERE order_number = ${orderNumber}`
  }
}

export async function deleteOrder(orderNumber: string) {
  // order_items rows are removed by the ON DELETE CASCADE FK on order_items.order_id
  await sql`DELETE FROM orders WHERE order_number = ${orderNumber}`
}

// Settings functions
export async function getSetting(key: string) {
  const result = await sql`SELECT value FROM settings WHERE key = ${key}`
  return result.rows[0]?.value
}

export async function setSetting(key: string, value: string) {
  await sql`
    INSERT INTO settings (key, value, updated_at) 
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `
}

// Stripe settings
export async function getStripeSettings() {
  const secretKey = await getSetting('stripe_secret_key')
  const publishableKey = await getSetting('stripe_publishable_key')
  return { 
    secretKey: secretKey ? `sk_****${secretKey.slice(-4)}` : null,
    publishableKey 
  }
}

export async function getStripeSecretKey(): Promise<string | null> {
  return process.env.STRIPE_SECRET_KEY || await getSetting('stripe_secret_key')
}

export async function getStripePublishableKey(): Promise<string | null> {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || await getSetting('stripe_publishable_key')
}

export async function updateStripeSettings(secretKey: string, publishableKey: string) {
  await setSetting('stripe_secret_key', secretKey)
  await setSetting('stripe_publishable_key', publishableKey)
}

// Promo codes functions
export async function getPromoCodes() {
  const result = await sql`SELECT * FROM promo_codes ORDER BY created_at DESC`
  return result.rows
}

export async function getPromoCode(code: string) {
  const result = await sql`SELECT * FROM promo_codes WHERE code = ${code}`
  return result.rows[0]
}

export async function createPromoCode(data: {
  code: string
  discountType: string
  discountValue: number
  maxUses: number
  expiresAt?: string
  isActive: boolean
}) {
  await sql`
    INSERT INTO promo_codes (code, discount_type, discount_value, max_uses, expires_at, is_active)
    VALUES (${data.code.toUpperCase()}, ${data.discountType}, ${data.discountValue}, ${data.maxUses}, ${data.expiresAt || null}, ${data.isActive})
  `
}

export async function updatePromoCode(code: string, data: {
  discountValue?: number
  maxUses?: number
  expiresAt?: string
  isActive?: boolean
}) {
  if (data.discountValue !== undefined) {
    await sql`UPDATE promo_codes SET discount_value = ${data.discountValue}, updated_at = NOW() WHERE code = ${code}`
  }
  if (data.maxUses !== undefined) {
    await sql`UPDATE promo_codes SET max_uses = ${data.maxUses}, updated_at = NOW() WHERE code = ${code}`
  }
  if (data.expiresAt !== undefined) {
    await sql`UPDATE promo_codes SET expires_at = ${data.expiresAt}, updated_at = NOW() WHERE code = ${code}`
  }
  if (data.isActive !== undefined) {
    await sql`UPDATE promo_codes SET is_active = ${data.isActive}, updated_at = NOW() WHERE code = ${code}`
  }
}

export async function deletePromoCode(code: string) {
  await sql`DELETE FROM promo_codes WHERE code = ${code}`
}

export async function incrementPromoCodeUse(code: string) {
  await sql`UPDATE promo_codes SET current_uses = current_uses + 1 WHERE code = ${code}`
}

// Google Ads expenses functions
export async function getGoogleAdsExpenses() {
  const result = await sql`SELECT * FROM google_ads_expenses ORDER BY month DESC`
  return result.rows
}

export async function getGoogleAdsExpense(month: string) {
  const result = await sql`SELECT * FROM google_ads_expenses WHERE month = ${month}`
  return result.rows[0]
}

export async function upsertGoogleAdsExpense(month: string, amount: number) {
  await sql`
    INSERT INTO google_ads_expenses (month, amount)
    VALUES (${month}, ${amount})
    ON CONFLICT (month) DO UPDATE SET amount = ${amount}, updated_at = NOW()
  `
}

export async function deleteGoogleAdsExpense(month: string) {
  await sql`DELETE FROM google_ads_expenses WHERE month = ${month}`
}

// Promo field setting
export async function getPromoFieldEnabled() {
  const value = await getSetting('promo_field_enabled')
  return value === 'true'
}

export async function setPromoFieldEnabled(enabled: boolean) {
  await setSetting('promo_field_enabled', enabled ? 'true' : 'false')
}
