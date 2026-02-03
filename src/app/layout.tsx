import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EternGift - Express Your Love with Perfect Gifts',
  description: 'Discover our collection of eternal roses, stunning jewelry, and romantic gift sets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
