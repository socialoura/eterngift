import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'EternGift - Eternal Roses & Personalized Jewelry | Perfect Valentine\'s Gift',
    template: '%s | EternGift',
  },
  description: 'Discover handcrafted eternal roses, personalized necklaces with custom engraving, and luxury gift sets. Free worldwide shipping. The perfect romantic gift for Valentine\'s Day, anniversaries & special occasions.',
  keywords: ['eternal roses', 'personalized jewelry', 'valentine gift', 'romantic gifts', 'rose bear', 'engraved necklace', 'luxury gift box', 'anniversary gift', 'forever roses', 'preserved roses'],
  authors: [{ name: 'EternGift' }],
  creator: 'EternGift',
  publisher: 'EternGift',
  metadataBase: new URL('https://eterngift.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'fr': '/fr',
      'es': '/es',
      'de': '/de',
      'it': '/it',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eterngift.com',
    siteName: 'EternGift',
    title: 'EternGift - Eternal Roses & Personalized Jewelry',
    description: 'Express your eternal love with handcrafted roses and personalized jewelry. Free worldwide shipping on orders $50+.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EternGift - Eternal Roses and Personalized Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EternGift - Eternal Roses & Personalized Jewelry',
    description: 'Express your eternal love with handcrafted roses and personalized jewelry.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#B71C1C',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
