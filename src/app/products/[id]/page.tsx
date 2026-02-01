'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Heart, ShoppingCart, Star, Truck, RotateCcw, Shield, 
  Minus, Plus, ChevronLeft, Check 
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

const products: Product[] = [
  {
    id: 1,
    name: 'Eternal Rose Box - Red',
    description: 'A stunning preserved red rose in an elegant gift box. This beautiful eternal rose has been carefully preserved to maintain its natural beauty for up to 3 years. Each rose is hand-selected at peak bloom and undergoes a special preservation process that keeps it looking fresh and vibrant. The luxurious gift box features a soft velvet interior and magnetic closure, making it the perfect romantic gift for any occasion.',
    priceUsd: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
    imagesUrl: [
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
      'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800',
    ],
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
    description: 'Elegant rose gold plated necklace with heart pendant and cubic zirconia. This stunning piece features a delicate chain with an adjustable length and a beautiful heart-shaped pendant encrusted with sparkling cubic zirconia stones. The rose gold plating adds a warm, romantic glow that complements any skin tone. Perfect for expressing your love on Valentine\'s Day, anniversaries, or any special occasion.',
    priceUsd: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    imagesUrl: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    ],
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
    description: 'Adorable teddy bear made entirely of soft foam roses. This unique and romantic gift features hundreds of carefully crafted foam roses arranged in the shape of a cuddly teddy bear. Standing at 25cm tall, this rose bear makes a stunning display piece and a lasting symbol of your love. Unlike real flowers, this bear will never wilt or fade.',
    priceUsd: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
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
    description: 'Complete gift set with eternal rose, jewelry, and premium chocolates. This luxurious collection includes a preserved eternal rose in an elegant box, a beautiful rose gold necklace, and a selection of premium Belgian chocolates. All beautifully presented in a premium gift box with satin ribbon. The ultimate romantic gesture for your special someone.',
    priceUsd: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800',
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
]

const reviews = [
  { id: 1, name: 'Sarah M.', rating: 5, date: 'January 2026', comment: 'Absolutely beautiful! My wife loved it. The quality is amazing and it looks just like the photos.' },
  { id: 2, name: 'Michael R.', rating: 5, date: 'January 2026', comment: 'Perfect gift for Valentine\'s Day. Fast shipping and great packaging.' },
  { id: 3, name: 'Emily T.', rating: 4, date: 'December 2025', comment: 'Very pretty and well-made. Would definitely recommend to others.' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = parseInt(params.id as string)
  const product = products.find((p) => p.id === productId) || products[0]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const { formatPrice } = useCurrencyStore()
  const addItem = useCartStore((state) => state.addItem)

  const images = product.imagesUrl.length > 0 ? product.imagesUrl : [product.imageUrl || '']

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-pink/20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {product.badge}
                  </Badge>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-rose-gold'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              {formatPrice(product.priceUsd)}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock} in stock
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={cn(isWishlisted && 'text-primary border-primary')}
              >
                <Heart
                  className={cn('w-5 h-5', isWishlisted && 'fill-primary')}
                />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto text-rose-gold mb-2" />
                <p className="text-sm font-medium text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 mx-auto text-rose-gold mb-2" />
                <p className="text-sm font-medium text-gray-700">30-Day Returns</p>
                <p className="text-xs text-gray-500">Easy returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto text-rose-gold mb-2" />
                <p className="text-sm font-medium text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-light-pink/50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a
                  href="mailto:support@eterngift.com"
                  className="text-primary hover:underline font-medium"
                >
                  support@eterngift.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                <p className="font-medium text-gray-800">{review.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
