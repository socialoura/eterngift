'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                key={logoSrc}
                src={logoSrc}
                alt="EternGift"
                width={40}
                height={40}
                className="w-10 h-10"
                onError={() => setLogoSrc('/logo.svg')}
              />
              <span className="text-xl font-heading font-bold text-rose-gold">
                EternGift
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Express your love with our premium eternal roses and romantic gifts. 
              Perfect for Valentine&apos;s Day, anniversaries, and special moments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/products?category=roses" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Eternal Roses
                </Link>
              </li>
              <li>
                <Link href="/products?category=jewelry" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/products?category=gift-sets" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Gift Sets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rose-gold" />
                <a href="mailto:support@eterngift.com" className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  support@eterngift.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rose-gold" />
                <span className="text-gray-400 text-sm">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-rose-gold mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Love Street<br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} EternGift. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm flex items-center">
                Made with <Heart className="w-4 h-4 text-primary mx-1" /> for lovers
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image src="/logos/payment-methods/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto opacity-60" />
              <Image src="/logos/payment-methods/mastercard.svg" alt="Mastercard" width={40} height={25} className="h-6 w-auto opacity-60" />
              <Image src="/logos/payment-methods/amex.svg" alt="Amex" width={40} height={25} className="h-6 w-auto opacity-60" />
              <Image src="/logos/payment-methods/paypal.svg" alt="PayPal" width={40} height={25} className="h-6 w-auto opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
