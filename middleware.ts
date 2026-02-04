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
    // Extract locale and set currency cookie if not already set
    const locale = pathname.split('/')[1]
    if (isValidLocale(locale)) {
      const response = NextResponse.next()
      
      // Set preferred currency based on locale if not already set
      if (!request.cookies.get('preferred-currency')) {
        response.cookies.set('preferred-currency', localeCurrencies[locale], {
          path: '/',
          maxAge: 60 * 60 * 24 * 365, // 1 year
        })
      }
      
      // Set locale cookie
      response.cookies.set('preferred-locale', locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
      
      return response
    }
    return NextResponse.next()
  }

  // Skip API routes, static files, dashboard, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/dashboard') ||
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
  
  // Set cookies for locale and currency
  response.cookies.set('preferred-locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
  
  if (!request.cookies.get('preferred-currency')) {
    response.cookies.set('preferred-currency', localeCurrencies[locale], {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except api, _next, dashboard, favicon, and files with extensions
    '/((?!api|_next|dashboard|favicon.ico|sitemap|robots|manifest).*)',
  ],
}
