import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Public catalog: real products from the DB (Prisma schema shape).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')?.toLowerCase()

  try {
    const result = await sql`SELECT * FROM products WHERE status = 'active' ORDER BY id`

    let products = result.rows
    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category)
    }
    if (search) {
      products = products.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(search) ||
          (p.description || '').toLowerCase().includes(search)
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// Creating products is an admin operation — requires an admin token.
export async function POST(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const body = await request.json()
    const { name, description, priceUsd, imageUrl, category, stock, badge } = body

    if (!name || priceUsd === undefined) {
      return NextResponse.json({ error: 'Missing required fields: name, priceUsd' }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO products (name, description, price_usd, image_url, images_url, category, stock, status, badge, created_at, updated_at)
      VALUES (
        ${name},
        ${description || null},
        ${Number(priceUsd)},
        ${imageUrl || null},
        ${(imageUrl ? [imageUrl] : []) as unknown as string},
        ${category || null},
        ${stock !== undefined ? Number(stock) : 0},
        'active',
        ${badge || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
