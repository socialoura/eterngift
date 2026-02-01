'use client'

import { motion } from 'framer-motion'
import { Star, Heart, Quote } from 'lucide-react'
import { Testimonial } from '@/lib/types'

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah M.',
    date: 'January 2026',
    rating: 5,
    comment: 'The eternal rose box I ordered for my wife was absolutely stunning! She loved it and the quality exceeded our expectations. Will definitely order again!',
    product: 'Eternal Rose Box',
  },
  {
    id: 2,
    name: 'Michael R.',
    date: 'January 2026',
    rating: 5,
    comment: 'Fast shipping and the jewelry was even more beautiful in person. My girlfriend was so happy with her Valentine\'s gift. Highly recommend!',
    product: 'Rose Gold Heart Necklace',
  },
  {
    id: 3,
    name: 'Emily T.',
    date: 'December 2025',
    rating: 5,
    comment: 'I\'ve ordered from many gift shops but EternGift is by far the best. The presentation, quality, and customer service are all top-notch!',
    product: 'Premium Gift Set',
  },
  {
    id: 4,
    name: 'David K.',
    date: 'January 2026',
    rating: 5,
    comment: 'The teddy bear with roses was the perfect anniversary gift. My wife couldn\'t stop smiling. Thank you EternGift for making our day special!',
    product: 'Rose Bear Collection',
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-light-pink/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Join thousands of happy customers who found the perfect gift
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <Heart className="w-5 h-5 text-primary/20" />
              </div>

              <Quote className="w-8 h-8 text-rose-gold/30 mb-3" />

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {testimonial.comment}
              </p>

              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.date}</p>
                {testimonial.product && (
                  <p className="text-xs text-rose-gold mt-1">
                    Purchased: {testimonial.product}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
