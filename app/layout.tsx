import type { Metadata } from 'next'
import { Cinzel, EB_Garamond, Inter } from 'next/font/google'
import './globals.css'

// Inscriptional capitals, used once for the wordmark.
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-display',
})

// The Seneca passage, set the way it would be printed.
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-prose',
})

// Numerals: years, ages, counts.
const inter = Inter({ subsets: ['latin'], variable: '--font-data' })

export const metadata: Metadata = {
  title: 'Memento Mori',
  description: 'Your life in weeks. A reminder that the supply is finite.',
  authors: [{ name: 'shadoath' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={`${cinzel.variable} ${ebGaramond.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
