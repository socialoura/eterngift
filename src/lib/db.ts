import { sql } from '@vercel/postgres'

// Initialize database tables
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

    // Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        base_price DECIMAL NOT NULL DEFAULT 0,
        stock INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Product variants table
    await sql`
      CREATE TABLE IF NOT EXISTS product_variants (
        id TEXT PRIMARY KEY,
        product_id TEXT REFERENCES products(id),
        variant_type TEXT,
        variant_value TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        order_id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        customer_name TEXT,
        price DECIMAL NOT NULL DEFAULT 0,
        cost DECIMAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        notes TEXT,
        stripe_transaction_id TEXT,
        promo_code TEXT,
        discount_amount DECIMAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Order items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT REFERENCES orders(order_id),
        product_id TEXT,
        rose_color TEXT,
        necklace_color TEXT,
        quantity INT DEFAULT 1
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

    // Migrate legacy product ids (rose-box/rose-bear) to current storefront ids (eternal-rose-*)
    // while preserving the legacy rows for existing orders.
    await sql`
      INSERT INTO products (id, name, description, image_url, base_price, stock)
      SELECT
        'eternal-rose-bear',
        'Eternal Rose Bear with Engraved Necklace',
        'Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance.',
        '/products/rose-bear/rouge/1.png',
        base_price,
        stock
      FROM products
      WHERE id = 'rose-bear'
      ON CONFLICT (id) DO NOTHING
    `

    await sql`
      INSERT INTO products (id, name, description, image_url, base_price, stock)
      SELECT
        'eternal-rose-box',
        'Eternal Rose Box with Engraved Necklace',
        'Eternal luxury in a box. A stunning preserved rose arrangement paired with a personalized engraved necklace.',
        '/products/rose-box/rouge/1.png',
        base_price,
        stock
      FROM products
      WHERE id = 'rose-box'
      ON CONFLICT (id) DO NOTHING
    `

    // Insert default products if not exist
    await sql`
      INSERT INTO products (id, name, description, image_url, base_price, stock)
      VALUES 
        ('eternal-rose-box', 'Eternal Rose Box with Engraved Necklace', 'Eternal luxury in a box. A stunning preserved rose arrangement paired with a personalized engraved necklace.', '/products/rose-box/rouge/1.png', 129.99, 100),
        ('eternal-rose-bear', 'Eternal Rose Bear with Engraved Necklace', 'Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance.', '/products/rose-bear/rouge/1.png', 89.99, 100)
      ON CONFLICT (id) DO NOTHING
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

// Products functions
export async function getProducts() {
  const result = await sql`SELECT * FROM products ORDER BY name`
  return result.rows
}

export async function getProduct(id: string) {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result.rows[0]
}

export async function updateProduct(id: string, data: { basePrice?: number; stock?: number }) {
  const { basePrice, stock } = data
  if (basePrice !== undefined && stock !== undefined) {
    await sql`UPDATE products SET base_price = ${basePrice}, stock = ${stock} WHERE id = ${id}`
  } else if (basePrice !== undefined) {
    await sql`UPDATE products SET base_price = ${basePrice} WHERE id = ${id}`
  } else if (stock !== undefined) {
    await sql`UPDATE products SET stock = ${stock} WHERE id = ${id}`
  }
}

export async function getProductVariants(productId: string) {
  const result = await sql`SELECT * FROM product_variants WHERE product_id = ${productId}`
  return result.rows
}

// Orders functions
export async function getAllOrders(filters?: { status?: string; product?: string; dateRange?: string }) {
  let query = sql`SELECT * FROM orders ORDER BY created_at DESC`
  
  // For now, return all orders - filtering can be added later
  const result = await query
  return result.rows
}

export async function getOrder(orderId: string) {
  const result = await sql`SELECT * FROM orders WHERE order_id = ${orderId}`
  return result.rows[0]
}

export async function getOrderItems(orderId: string) {
  const result = await sql`SELECT * FROM order_items WHERE order_id = ${orderId}`
  return result.rows
}

export async function updateOrder(orderId: string, data: { status?: string; cost?: number; notes?: string }) {
  const { status, cost, notes } = data
  
  if (status !== undefined) {
    await sql`UPDATE orders SET status = ${status}, updated_at = NOW() WHERE order_id = ${orderId}`
  }
  if (cost !== undefined) {
    await sql`UPDATE orders SET cost = ${cost}, updated_at = NOW() WHERE order_id = ${orderId}`
  }
  if (notes !== undefined) {
    await sql`UPDATE orders SET notes = ${notes}, updated_at = NOW() WHERE order_id = ${orderId}`
  }
}

export async function deleteOrder(orderId: string) {
  await sql`DELETE FROM order_items WHERE order_id = ${orderId}`
  await sql`DELETE FROM orders WHERE order_id = ${orderId}`
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
