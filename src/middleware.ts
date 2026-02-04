import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, getLocaleFromAcceptLanguage, isValidLocale, localeCurrencies } from '@/lib/i18n/config'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    // Extract locale and always sync currency with locale
    const locale = pathname.split('/')[1]
    if (isValidLocale(locale)) {
      const response = NextResponse.next()
      
      // Always set preferred currency based on locale to keep in sync
      response.cookies.set('preferred-currency', localeCurrencies[locale], {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
      
      // Set locale cookie
      response.cookies.set('preferred-locale', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      
      return response
    }
    return NextResponse.next()
  }

  // Skip API routes, static files, admin, dashboard, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/robots') ||
    pathname.includes('.') // Static files like .png, .svg, etc.
  ) {
    return NextResponse.next()
  }

  // Determine the locale to use
  // Always use Accept-Language header for automatic detection
  // Cookie is only used when user manually selects a language
  const acceptLanguage = request.headers.get('accept-language')
  let locale = getLocaleFromAcceptLanguage(acceptLanguage)
  
  // Only override with cookie if user explicitly changed language (has 'user-selected-locale' cookie)
  const userSelectedLocale = request.cookies.get('user-selected-locale')?.value
  if (userSelectedLocale && isValidLocale(userSelectedLocale)) {
    locale = userSelectedLocale
  }

  // Redirect to the localized version
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  newUrl.search = request.nextUrl.search
  
  const response = NextResponse.redirect(newUrl)
  
  // Set cookies for locale and currency (always sync currency with locale)
  response.cookies.set('preferred-locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  
  response.cookies.set('preferred-currency', localeCurrencies[locale], {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
