import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { inter, playfair } from '@/lib/fonts'
import './globals.css'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1434519064736453'

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased font-body" suppressHydrationWarning>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17893452047"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17893452047');`}
        </Script>

        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
