'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Menu, X, ChevronDown, Globe } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { SUPPORTED_CURRENCIES } from '@/lib/currency'
import { locales, localeNames, localeFlags, localeCurrencies, type Locale } from '@/lib/i18n/config'
import { useTranslation } from '@/components/providers/I18nProvider'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [logoSrc, setLogoSrc] = useState('/logo.png')
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { currency, setCurrency } = useCurrencyStore()

  // Extract current locale from pathname
  const currentLocale = (locales.find(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) || 'en') as Locale
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'

  // Only use transparent header on homepage
  const isHomepage = pathnameWithoutLocale === '/'
  const useTransparentHeader = isHomepage && !isScrolled

  const { t } = useTranslation()

  const switchLocale = (newLocale: Locale) => {
    // Set user-selected-locale to indicate manual selection (overrides Accept-Language)
    document.cookie = `user-selected-locale=${newLocale};path=/;max-age=31536000`
    document.cookie = `preferred-locale=${newLocale};path=/;max-age=31536000`
    document.cookie = `preferred-currency=${localeCurrencies[newLocale]};path=/;max-age=31536000`
    setCurrency(localeCurrencies[newLocale] as 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD')
    router.push(`/${newLocale}${pathnameWithoutLocale}`)
    setIsLangOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: `/${currentLocale}`, labelKey: 'common.home' },
    { href: `/${currentLocale}/collections`, labelKey: 'common.collections' },
    { href: `/${currentLocale}/products/eternal-rose-bear`, labelKey: 'common.roseBear' },
    { href: `/${currentLocale}/products/eternal-rose-box`, labelKey: 'common.roseBox' },
    { href: `/${currentLocale}/faq`, labelKey: 'common.faq' },
    { href: `/${currentLocale}/contact`, labelKey: 'common.contact' },
  ]

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500',
        useTransparentHeader 
          ? 'bg-transparent' 
          : 'bg-white/98 backdrop-blur-lg shadow-lg shadow-black/5'
      )}
    >
      {/* Top bar - promo */}
      <div className={cn(
        'text-white text-center py-2 text-sm transition-all duration-300',
        useTransparentHeader 
          ? 'bg-black/20 backdrop-blur-sm' 
          : 'bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF88]'
      )}>
        <p className="flex items-center justify-center gap-2">
          <span>💝</span>
          <span className="font-medium">{t('header.promo')}</span>
          <span>💝</span>
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Image
                key={logoSrc}
                src={logoSrc}
                alt="EternGift"
                width={44}
                height={44}
                className="w-10 h-10 lg:w-11 lg:h-11"
                onError={() => setLogoSrc('/logo.svg')}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className={cn(
                'text-xl lg:text-2xl font-heading font-bold transition-all',
                useTransparentHeader 
                  ? 'text-white' 
                  : 'bg-gradient-to-r from-[#8B1538] to-[#B71C1C] bg-clip-text text-transparent'
              )}>
                EternGift
              </span>
              <span className={cn(
                'text-[10px] font-medium tracking-widest uppercase hidden sm:block transition-all',
                useTransparentHeader ? 'text-white/70' : 'text-gray-400'
              )}>
                {t('header.foreverInLove')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 transition-colors font-medium group',
                  useTransparentHeader 
                    ? 'text-white/90 hover:text-white' 
                    : 'text-gray-600 hover:text-[#B71C1C]'
                )}
              >
                <span className="relative z-10">{t(link.labelKey)}</span>
                <span className={cn(
                  'absolute inset-0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 origin-center',
                  useTransparentHeader ? 'bg-white/20' : 'bg-[#FFE5E5]'
                )} />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                  isCurrencyOpen 
                    ? 'bg-[#FFE5E5] text-[#B71C1C]' 
                    : useTransparentHeader 
                      ? 'text-white/80 hover:bg-white/20' 
                      : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <span>{currency}</span>
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform',
                  isCurrencyOpen && 'rotate-180'
                )} />
              </button>
              
              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrency(curr.code)
                          setIsCurrencyOpen(false)
                        }}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2',
                          currency === curr.code 
                            ? 'bg-gradient-to-r from-[#FFE5E5] to-pink-50 text-[#B71C1C] font-semibold' 
                            : 'hover:bg-gray-50 text-gray-600'
                        )}
                      >
                        <span className="text-lg">{curr.symbol}</span>
                        <span>{curr.code}</span>
                        {currency === curr.code && (
                          <span className="ml-auto text-[#B71C1C]">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={cn(
                  'flex items-center gap-1 px-2 py-2 text-sm font-medium rounded-lg transition-all',
                  isLangOpen 
                    ? 'bg-[#FFE5E5] text-[#B71C1C]' 
                    : useTransparentHeader 
                      ? 'text-white/80 hover:bg-white/20' 
                      : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{localeFlags[currentLocale]}</span>
                <ChevronDown className={cn(
                  'w-3 h-3 transition-transform',
                  isLangOpen && 'rotate-180'
                )} />
              </button>
              
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => switchLocale(loc)}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2',
                          currentLocale === loc 
                            ? 'bg-gradient-to-r from-[#FFE5E5] to-pink-50 text-[#B71C1C] font-semibold' 
                            : 'hover:bg-gray-50 text-gray-600'
                        )}
                      >
                        <span className="text-lg">{localeFlags[loc]}</span>
                        <span>{localeNames[loc]}</span>
                        {currentLocale === loc && (
                          <span className="ml-auto text-[#B71C1C]">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link 
              href={`/${currentLocale}/wishlist`}
              className={cn(
                'hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-all',
                useTransparentHeader 
                  ? 'text-white/80 hover:text-white hover:bg-white/20' 
                  : 'text-gray-500 hover:text-[#B71C1C] hover:bg-[#FFE5E5]'
              )}
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link 
              href={`/${currentLocale}/cart`}
              className={cn(
                'relative flex items-center justify-center w-10 h-10 rounded-full transition-all',
                useTransparentHeader 
                  ? 'text-white/80 hover:text-white hover:bg-white/20' 
                  : 'text-gray-500 hover:text-[#B71C1C] hover:bg-[#FFE5E5]'
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'lg:hidden flex items-center justify-center w-10 h-10 rounded-full transition-all',
                useTransparentHeader 
                  ? 'text-white/80 hover:text-white hover:bg-white/20' 
                  : 'text-gray-500 hover:text-[#B71C1C] hover:bg-[#FFE5E5]'
              )}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#B71C1C] hover:bg-[#FFE5E5] rounded-xl transition-all font-medium"
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] rounded-full" />
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile wishlist */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#B71C1C] hover:bg-[#FFE5E5] rounded-xl transition-all font-medium"
                >
                  <Heart className="w-5 h-5 text-[#B71C1C]" />
                  My Wishlist
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
