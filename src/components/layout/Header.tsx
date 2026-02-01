'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Heart, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore, } from '@/store/currency'
import { SUPPORTED_CURRENCIES } from '@/lib/currency'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { currency, setCurrency } = useCurrencyStore()

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/products?category=roses', label: 'Roses' },
    { href: '/products?category=jewelry', label: 'Jewelry' },
    { href: '/products?category=gift-sets', label: 'Gift Sets' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-light-pink">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="EternGift"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl md:text-2xl font-heading font-bold text-primary">
              EternGift
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-1 px-2 py-1 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                <span>{currency}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCurrencyOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code)
                        setIsCurrencyOpen(false)
                      }}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-light-pink transition-colors',
                        currency === curr.code && 'bg-light-pink text-primary font-medium'
                      )}
                    >
                      {curr.symbol} {curr.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <Link href="/products" className="p-2 text-gray-600 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-gray-600 hover:text-primary transition-colors hidden md:block">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-light-pink">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
