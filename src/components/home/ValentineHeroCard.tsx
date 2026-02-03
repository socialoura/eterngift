'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function CoupleIllustration() {
  return (
    <svg viewBox="0 0 520 520" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="skin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#FFD7C2" />
          <stop offset="1" stopColor="#FFBFA3" />
        </linearGradient>
        <linearGradient id="hair" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#6A2C2C" />
          <stop offset="1" stopColor="#3A1414" />
        </linearGradient>
        <linearGradient id="accent" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#D4AF88" />
          <stop offset="1" stopColor="#B71C1C" />
        </linearGradient>
      </defs>

      <g opacity="0.18">
        <path
          d="M420 80c20-18 48-12 60 10 14 26-4 56-60 90-56-34-74-64-60-90 12-22 40-28 60-10Z"
          fill="#fff"
        />
        <path
          d="M320 40c12-10 30-6 38 8 9 16-3 35-38 56-35-21-47-40-38-56 8-14 26-18 38-8Z"
          fill="#fff"
        />
        <path
          d="M110 120c16-14 40-10 50 8 12 22-4 48-50 74-46-26-62-52-50-74 10-18 34-22 50-8Z"
          fill="#fff"
        />
      </g>

      <g>
        <g transform="translate(250 90)">
          <path d="M0 140h180v200H0z" fill="#fff" opacity="0.12" rx="24" />

          <path d="M94 88c46 0 82 36 82 82v18H12v-18c0-46 36-82 82-82Z" fill="#FAD0D7" opacity="0.95" />
          <path d="M52 88c8-46 34-70 76-74 42 4 68 28 76 74-24-14-50-22-76-22S76 74 52 88Z" fill="url(#hair)" />
          <circle cx="94" cy="118" r="54" fill="url(#skin)" />
          <circle cx="72" cy="120" r="6" fill="#2B0E0E" opacity="0.85" />
          <circle cx="118" cy="120" r="6" fill="#2B0E0E" opacity="0.85" />
          <path d="M86 140c10 10 22 10 34 0" stroke="#2B0E0E" strokeWidth="6" strokeLinecap="round" opacity="0.75" fill="none" />
          <circle cx="60" cy="140" r="10" fill="#FF7AA8" opacity="0.5" />
          <circle cx="128" cy="140" r="10" fill="#FF7AA8" opacity="0.5" />

          <path d="M28 188h132" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
          <path
            d="M150 190c16-14 40-10 50 8 12 22-4 48-50 74-46-26-62-52-50-74 10-18 34-22 50-8Z"
            fill="url(#accent)"
          />
        </g>

        <g transform="translate(250 300)">
          <path d="M40 40h180v200H40z" fill="#fff" opacity="0.10" rx="24" />

          <path d="M130 74c42 0 76 34 76 76v18H54v-18c0-42 34-76 76-76Z" fill="#FFE5E5" opacity="0.92" />
          <path d="M86 74c6-36 28-56 64-60 36 4 58 24 64 60-20-12-42-18-64-18s-44 6-64 18Z" fill="url(#hair)" />
          <circle cx="130" cy="106" r="48" fill="url(#skin)" />
          <circle cx="112" cy="106" r="6" fill="#2B0E0E" opacity="0.85" />
          <circle cx="148" cy="106" r="6" fill="#2B0E0E" opacity="0.85" />
          <path d="M118 124c10 12 24 12 34 0" stroke="#2B0E0E" strokeWidth="6" strokeLinecap="round" opacity="0.75" fill="none" />
          <circle cx="100" cy="126" r="9" fill="#FF7AA8" opacity="0.5" />
          <circle cx="160" cy="126" r="9" fill="#FF7AA8" opacity="0.5" />

          <path d="M72 168h120" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
          <path
            d="M70 182c12-10 30-6 38 8 9 16-3 35-38 56-35-21-47-40-38-56 8-14 26-18 38-8Z"
            fill="url(#accent)"
          />
        </g>
      </g>
    </svg>
  )
}

export function ValentineHeroCard() {
  const hearts = [
    { top: '8%', left: '6%', size: 28, opacity: 0.18, delay: 0 },
    { top: '18%', left: '40%', size: 22, opacity: 0.14, delay: 0.6 },
    { top: '30%', left: '22%', size: 18, opacity: 0.12, delay: 1.1 },
    { top: '12%', left: '78%', size: 26, opacity: 0.14, delay: 0.4 },
    { top: '60%', left: '10%', size: 30, opacity: 0.12, delay: 0.9 },
    { top: '70%', left: '46%', size: 20, opacity: 0.10, delay: 0.2 },
    { top: '78%', left: '84%', size: 34, opacity: 0.12, delay: 0.8 },
  ]

  return (
    <section className="bg-light-pink/40">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#ff1f70] via-[#ff0f6a] to-[#e60055] shadow-romantic">
          <div className="absolute inset-0">
            {hearts.map((h, idx) => (
              <motion.div
                key={idx}
                className="absolute text-white"
                style={{ top: h.top, left: h.left, opacity: h.opacity }}
                animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
              >
                <Heart className="fill-current" style={{ width: h.size, height: h.size }} />
              </motion.div>
            ))}
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center px-6 py-10 md:px-12 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white/90 backdrop-blur-sm">
                <Heart className="w-4 h-4 fill-white" />
                <span className="text-sm font-medium">EternGift Valentine Special</span>
              </div>

              <div className="mt-7">
                <p className="text-white/90 text-3xl md:text-4xl font-heading italic tracking-wide">
                  Happy
                </p>
                <h1 className="mt-2 text-white text-6xl md:text-7xl font-heading font-extrabold leading-[0.95]">
                  Valentine&apos;s
                </h1>
                <p className="mt-2 text-white/90 text-3xl md:text-4xl font-heading italic">
                  Day
                </p>
              </div>

              <p className="mt-6 text-white/85 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
                Make your love unforgettable with romantic gifts that feel premium and timeless.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/products?category=gift-sets" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary focus:ring-white"
                  >
                    Send Wishes
                  </Button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 focus:ring-white"
                  >
                    Buy Gifts
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative mx-auto h-[320px] w-full max-w-[520px] md:h-[400px]">
                <div className="absolute inset-0 rounded-3xl bg-white/10 blur-2xl" />
                <div className="relative h-full w-full">
                  <CoupleIllustration />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
