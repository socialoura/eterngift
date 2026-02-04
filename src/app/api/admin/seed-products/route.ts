import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { sql } from '@vercel/postgres'

export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    // Check if products already exist
    const existing = await sql`SELECT COUNT(*) as count FROM products`
    
    if (Number(existing.rows[0]?.count) > 0) {
      return NextResponse.json({ 
        message: 'Products already exist in database',
        count: existing.rows[0]?.count 
      })
    }

    // Insert Eternal Rose Bear (id = 1)
    await sql`
      INSERT INTO products (
        id, name, description, price_usd, image_url, images_url, 
        category, stock, rating, review_count, status, badge, created_at, updated_at
      ) VALUES (
        1,
        'Eternal Rose Bear with Engraved Necklace',
        'Your perfect eternal companion. A stunning rose bear paired with an engraved necklace, creating a timeless symbol of love and remembrance.',
        29.99,
        '/products/rose-bear/rouge/1.png',
        ARRAY['/products/rose-bear/rouge/1.png', '/products/rose-bear/rouge/2.png', '/products/rose-bear/rouge/3.png', '/products/rose-bear/rouge/4.png', '/products/rose-bear/rouge/5.png'],
        'Gift Sets',
        999,
        4.9,
        1247,
        'active',
        'Most Popular',
        NOW(),
        NOW()
      )
    `

    // Insert Eternal Rose Box (id = 2)
    await sql`
      INSERT INTO products (
        id, name, description, price_usd, image_url, images_url,
        category, stock, rating, review_count, status, badge, created_at, updated_at
      ) VALUES (
        2,
        'Eternal Rose Box with Engraved Necklace',
        'Eternal luxury in a box. A stunning preserved rose arrangement paired with a personalized engraved necklace.',
        19.99,
        '/products/rose-box/rouge/1.png',
        ARRAY['/products/rose-box/rouge/1.png', '/products/rose-box/rouge/2.png', '/products/rose-box/rouge/3.png', '/products/rose-box/rouge/4.png', '/products/rose-box/rouge/5.png'],
        'Gift Sets',
        999,
        4.8,
        892,
        'active',
        'Premium',
        NOW(),
        NOW()
      )
    `

    // Reset the sequence to continue from id 3
    await sql`SELECT setval('products_id_seq', 2, true)`

    return NextResponse.json({ 
      success: true, 
      message: 'Products seeded successfully',
      products: [
        { id: 1, name: 'Eternal Rose Bear with Engraved Necklace', price: 29.99 },
        { id: 2, name: 'Eternal Rose Box with Engraved Necklace', price: 19.99 }
      ]
    })
  } catch (error) {
    console.error('Error seeding products:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed products' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const result = await sql`SELECT * FROM products ORDER BY id`
    return NextResponse.json({ products: result.rows })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
