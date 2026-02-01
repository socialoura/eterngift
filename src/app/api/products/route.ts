import { NextRequest, NextResponse } from 'next/server'

const products = [
  {
    id: 1,
    name: 'Eternal Rose Box - Red',
    description: 'A stunning preserved red rose in an elegant gift box. Lasts up to 3 years.',
    priceUsd: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
    imagesUrl: [],
    category: 'roses',
    stock: 50,
    rating: 4.9,
    reviewCount: 128,
    status: 'active',
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Rose Gold Heart Necklace',
    description: 'Elegant rose gold plated necklace with heart pendant and cubic zirconia.',
    priceUsd: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
    imagesUrl: [],
    category: 'jewelry',
    stock: 75,
    rating: 4.8,
    reviewCount: 89,
    status: 'active',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Premium Rose Bear - Pink',
    description: 'Adorable teddy bear made entirely of soft foam roses.',
    priceUsd: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    imagesUrl: [],
    category: 'plush',
    stock: 30,
    rating: 4.7,
    reviewCount: 64,
    status: 'active',
    badge: 'New',
  },
  {
    id: 4,
    name: 'Romantic Gift Set Deluxe',
    description: 'Complete gift set with eternal rose, jewelry, and premium chocolates.',
    priceUsd: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    imagesUrl: [],
    category: 'gift-sets',
    stock: 25,
    rating: 5.0,
    reviewCount: 42,
    status: 'active',
    badge: 'Limited Edition',
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let filteredProducts = [...products]

  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter((p) => p.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    )
  }

  return NextResponse.json(filteredProducts)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newProduct = {
      id: products.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    products.push(newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
