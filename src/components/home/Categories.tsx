'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'roses',
    name: 'Eternal Roses',
    description: 'Forever blooming beauty',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
    slug: 'roses',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    description: 'Elegant pieces she\'ll adore',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
    slug: 'jewelry',
  },
  {
    id: 'gift-sets',
    name: 'Gift Sets',
    description: 'Complete romantic collections',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600',
    slug: 'gift-sets',
  },
  {
    id: 'plush',
    name: 'Rose Bears',
    description: 'Cuddly love tokens',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    slug: 'plush',
  },
]

export function Categories() {
  return (
    <section className="py-16 md:py-24 bg-cream/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Find the perfect gift for every romantic occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-heading font-semibold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center text-rose-gold text-sm font-medium group-hover:translate-x-2 transition-transform">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
