export const locales = ['en', 'fr', 'es', 'de', 'it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
}

export const localeCurrencies: Record<Locale, string> = {
  en: 'USD',
  fr: 'EUR',
  es: 'EUR',
  de: 'EUR',
  it: 'EUR',
}

// Map browser language codes to our supported locales
export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  
  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';')
    return code.toLowerCase().split('-')[0]
  })
  
  for (const lang of languages) {
    if (locales.includes(lang as Locale)) {
      return lang as Locale
    }
  }
  
  return defaultLocale
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
