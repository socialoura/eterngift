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

  // Skip API routes, static files, etc.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // Static files like .png, .svg, etc.
  ) {
    return NextResponse.next()
  }

  // Determine the locale to use
  let locale = defaultLocale

  // 1. Check for saved preference in cookie
  const savedLocale = request.cookies.get('preferred-locale')?.value
  if (savedLocale && isValidLocale(savedLocale)) {
    locale = savedLocale
  } else {
    // 2. Use Accept-Language header
    const acceptLanguage = request.headers.get('accept-language')
    locale = getLocaleFromAcceptLanguage(acceptLanguage)
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
    // Match all paths except api, _next/static, _next/image, favicon, and files with extensions
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
