import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { locales, type Locale, localeCurrencies } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { I18nProvider } from '@/components/providers/I18nProvider'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
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
    <I18nProvider locale={locale} dictionary={dictionary} defaultCurrency={defaultCurrency}>
      <Header />
      <main className="flex-1 pt-[104px]">{children}</main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </I18nProvider>
  )
}
