'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [logoSrc, setLogoSrc] = useState('/logo.svg')
  const { t } = useTranslation()
  const locale = useLocale()

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
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rose-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/eterngift_com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-rose-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/collections`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.shopAll')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/eternal-rose-box`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.eternalRoses')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products/eternal-rose-bear`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.jewelry')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collections`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.giftSets')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">{t('footer.customerService')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('common.faq')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.shippingInfo')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.returnsExchanges')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-400 hover:text-rose-gold transition-colors text-sm">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4">{t('footer.contactUs')}</h3>
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
              © {currentYear} EternGift. {t('footer.allRightsReserved')}
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm flex items-center">
                {t('footer.madeWithForLoversPrefix')} <Heart className="w-4 h-4 text-primary mx-1" /> {t('footer.madeWithForLoversSuffix')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image src="/cb.png" alt="Cards" width={120} height={30} className="h-7 w-auto opacity-70" />
              <Image src="/paypal.svg" alt="PayPal" width={40} height={25} className="h-6 w-auto opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
