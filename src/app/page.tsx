import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'
import { Product } from '@/lib/types'

const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Eternal Rose Box - Red',
    description: 'A stunning preserved red rose in an elegant gift box. Lasts up to 3 years.',
    priceUsd: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
    imagesUrl: [],
    category: 'Roses',
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
    category: 'Jewelry',
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
    category: 'Plush',
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
    category: 'Gift Sets',
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
    category: 'Roses',
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
    category: 'Jewelry',
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
    category: 'Roses',
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
    category: 'Gift Sets',
    stock: 45,
    rating: 4.7,
    reviewCount: 38,
    status: 'active',
    badge: 'New',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts products={featuredProducts} />
      <Testimonials />
      <Newsletter />
    </>
  )
}
