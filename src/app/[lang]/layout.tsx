import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { locales, type Locale, localeCurrencies } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { I18nProvider } from '@/components/providers/I18nProvider'
import '../globals.css'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: 'EternGift - Express Your Love with Perfect Gifts',
  description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets. Perfect for Valentine\'s Day, anniversaries, and special moments.',
  keywords: ['eternal roses', 'romantic gifts', 'valentine gifts', 'jewelry', 'gift sets', 'rose bears'],
  authors: [{ name: 'EternGift' }],
  openGraph: {
    title: 'EternGift - Express Your Love with Perfect Gifts',
    description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets.',
    url: 'https://eterngift.com',
    siteName: 'EternGift',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EternGift - Express Your Love with Perfect Gifts',
    description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets.',
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = (locales.includes(lang as Locale) ? lang : 'en') as Locale
  const dictionary = await getDictionary(locale)
  const defaultCurrency = localeCurrencies[locale]

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <I18nProvider locale={locale} dictionary={dictionary} defaultCurrency={defaultCurrency}>
          <Header />
          <main className="flex-1 pt-[104px]">{children}</main>
          <Footer />
        </I18nProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
