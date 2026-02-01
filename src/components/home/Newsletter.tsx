'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Heart, Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-white/10">
          <Heart className="w-20 h-20 fill-current" />
        </div>
        <div className="absolute bottom-10 right-10 text-white/10">
          <Heart className="w-16 h-16 fill-current" />
        </div>
        <div className="absolute top-1/2 left-1/4 text-white/5">
          <Heart className="w-32 h-32 fill-current" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Get 10% Off Your First Order
          </h2>
          <p className="text-white/80 mb-8">
            Subscribe to our newsletter for exclusive offers, gift ideas, and early access to new collections.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
            >
              <Heart className="w-12 h-12 text-white fill-white mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Thank you for subscribing!</p>
              <p className="text-white/80 text-sm mt-2">
                Check your email for your exclusive 10% discount code.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/30"
              />
              <Button
                type="submit"
                variant="secondary"
                isLoading={status === 'loading'}
                className="sm:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-white/60 text-xs mt-4">
            By subscribing, you agree to our Privacy Policy. Contact us at{' '}
            <a href="mailto:support@eterngift.com" className="underline hover:text-white">
              support@eterngift.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
