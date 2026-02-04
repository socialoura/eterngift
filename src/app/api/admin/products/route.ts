import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth'
import { getProducts, initDatabase } from '@/lib/db'

initDatabase().catch(console.error)

export async function GET(request: NextRequest) {
  const auth = verifyAdminToken(request)
  if (!auth.valid) return unauthorizedResponse(auth.error)

  try {
    const products = await getProducts()
    const allowedIds = new Set(['eternal-rose-bear', 'eternal-rose-box'])
    const storefrontProducts = products.filter((p: any) => allowedIds.has(p.id))
    return NextResponse.json({ products: storefrontProducts })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
