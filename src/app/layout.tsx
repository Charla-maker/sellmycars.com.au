import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sell My Cars - Get Cash for Your Car Today',
  description: 'Get instant cash for your car in Sydney. Free pickup, same-day service, and top dollar for any vehicle. Call 0420 587 575 for a quote.',
  keywords: 'sell my car sydney, cash for cars, car buyers sydney, sell car fast',
  openGraph: {
    title: 'Sell My Cars - Get Cash for Your Car Today',
    description: 'Get instant cash for your car in Sydney. Free pickup, same-day service, and top dollar for any vehicle.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
