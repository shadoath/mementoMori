import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

// Vendored rather than fetched from Google Fonts at build time: next/font/google
// downloads during `next build`, so one slow response from fonts.gstatic.com
// fails the deploy. See app/fonts/README.md.

// Inscriptional capitals, used once for the wordmark.
const cinzel = localFont({
  src: './fonts/cinzel-latin.woff2',
  weight: '400 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  variable: '--font-display',
})

// The Seneca passage, set the way it would be printed.
const ebGaramond = localFont({
  src: [
    {
      path: './fonts/eb-garamond-latin.woff2',
      weight: '400 800',
      style: 'normal',
    },
    {
      path: './fonts/eb-garamond-latin-italic.woff2',
      weight: '400 800',
      style: 'italic',
    },
  ],
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: 'Times New Roman',
  variable: '--font-prose',
})

// Numerals: years, ages, counts.
const inter = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
  variable: '--font-data',
})

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
