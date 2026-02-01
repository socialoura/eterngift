'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const allProducts: Product[] = [
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
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Premium Rose Bear - Pink',
    description: 'Adorable teddy bear made entirely of soft foam roses. Perfect romantic gift.',
    priceUsd: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    imagesUrl: [],
    category: 'plush',
    stock: 30,
    rating: 4.7,
    reviewCount: 64,
    status: 'active',
    badge: 'New',
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    name: 'Crystal Rose - Gold',
    description: '24K gold dipped crystal rose with LED light base. A luxurious forever gift.',
    priceUsd: 69.99,
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
    imagesUrl: [],
    category: 'roses',
    stock: 40,
    rating: 4.6,
    reviewCount: 55,
    status: 'active',
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    name: 'Diamond Heart Earrings',
    description: 'Stunning sterling silver earrings with diamond-cut heart design.',
    priceUsd: 59.99,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
    imagesUrl: [],
    category: 'jewelry',
    stock: 60,
    rating: 4.8,
    reviewCount: 73,
    status: 'active',
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 7,
    name: 'Eternal Rose Dome',
    description: 'Beauty and the Beast inspired preserved rose in glass dome with LED lights.',
    priceUsd: 99.99,
    imageUrl: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=600',
    imagesUrl: [],
    category: 'roses',
    stock: 35,
    rating: 4.9,
    reviewCount: 112,
    status: 'active',
    badge: 'Bestseller',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 8,
    name: 'Love Letters Gift Box',
    description: 'Romantic gift box with personalized love letters, rose petals, and chocolates.',
    priceUsd: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600',
    imagesUrl: [],
    category: 'gift-sets',
    stock: 45,
    rating: 4.7,
    reviewCount: 38,
    status: 'active',
    badge: 'New',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 9,
    name: 'Rose Bear - Red Large',
    description: 'Large 40cm teddy bear covered in beautiful red foam roses.',
    priceUsd: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    imagesUrl: [],
    category: 'plush',
    stock: 20,
    rating: 4.8,
    reviewCount: 45,
    status: 'active',
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 10,
    name: 'Infinity Rose Bracelet',
    description: 'Delicate rose gold bracelet with infinity symbol and rose charm.',
    priceUsd: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
    imagesUrl: [],
    category: 'jewelry',
    stock: 80,
    rating: 4.6,
    reviewCount: 67,
    status: 'active',
    badge: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 11,
    name: 'Eternal Rose Music Box',
    description: 'Beautiful music box with preserved rose that plays a romantic melody.',
    priceUsd: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
    imagesUrl: [],
    category: 'roses',
    stock: 25,
    rating: 4.9,
    reviewCount: 52,
    status: 'active',
    badge: 'Popular',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 12,
    name: 'Ultimate Romance Bundle',
    description: 'The complete package: eternal rose, jewelry set, chocolates, and teddy bear.',
    priceUsd: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    imagesUrl: [],
    category: 'gift-sets',
    stock: 15,
    rating: 5.0,
    reviewCount: 28,
    status: 'active',
    badge: 'Premium',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'roses', name: 'Eternal Roses' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'gift-sets', name: 'Gift Sets' },
  { id: 'plush', name: 'Rose Bears' },
]

const sortOptions = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'rating', name: 'Highest Rated' },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300])
  const [showFilters, setShowFilters] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]

    // Filter by search
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory)
    }

    // Filter by price range
    products = products.filter(
      (p) => p.priceUsd >= priceRange[0] && p.priceUsd <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.priceUsd - b.priceUsd)
        break
      case 'price-desc':
        products.sort((a, b) => b.priceUsd - a.priceUsd)
        break
      case 'popular':
        products.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }

    return products
  }, [search, selectedCategory, sortBy, priceRange])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-pink/20">
      {/* Header */}
      <div className="bg-white border-b border-light-pink">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">
              {selectedCategory === 'all'
                ? 'All Products'
                : categories.find((c) => c.id === selectedCategory)?.name}
            </h1>
            <p className="text-gray-600">
              Discover the perfect romantic gift for your loved one
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="w-full md:w-48 justify-between"
            >
              {sortOptions.find((s) => s.id === sortBy)?.name}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id)
                      setShowSortDropdown(false)
                    }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm hover:bg-light-pink transition-colors',
                      sortBy === option.id && 'bg-light-pink text-primary font-medium'
                    )}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              'w-64 shrink-0 transition-all duration-300',
              showFilters ? 'block' : 'hidden md:block'
            )}
          >
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setPriceRange([0, 300])
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        selectedCategory === category.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-light-pink text-gray-600'
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredProducts.length} products
            </p>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('')
                    setSelectedCategory('all')
                    setPriceRange([0, 300])
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
