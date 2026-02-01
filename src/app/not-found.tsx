import Link from 'next/link'
import { Heart, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-light-pink/30">
      <div className="text-center px-4">
        <div className="relative inline-block mb-8">
          <span className="text-9xl font-heading font-bold text-primary/20">404</span>
          <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-primary fill-primary" />
        </div>
        
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for seems to have wandered off. 
          Let&apos;s get you back to finding the perfect gift.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Products
            </Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Need help? Contact us at{' '}
          <a href="mailto:support@eterngift.com" className="text-primary hover:underline">
            support@eterngift.com
          </a>
        </p>
      </div>
    </div>
  )
}
