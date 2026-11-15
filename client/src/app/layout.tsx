import type { Metadata } from 'next'
import Script from 'next/script'
import { League_Gothic, JetBrains_Mono, Inter_Tight, Caveat } from 'next/font/google'
import './globals.css'

const league = League_Gothic({ subsets: ['latin'], variable: '--font-league' })
const jet = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jet' })
const inter = Inter_Tight({ subsets: ['latin'], variable: '--font-inter' })
const caveat = Caveat({ subsets: ['latin'], weight: '600', variable: '--font-hand' })

const SITE = 'https://khushirathore.vercel.app'
const GA_ID = 'G-HRXERE0YT3'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: 'Khushi Rathore | Software Developer',
  description:
    'Khushi Rathore — software developer building web and mobile apps people use every day: MyDukan, Dizlie, FlexziStay, Zantalk and more.',
  keywords: 'Khushi Rathore, Software Developer, Full Stack Developer, React Developer, Next.js Developer, App Developer, Portfolio',
  authors: [{ name: 'Khushi Rathore' }],
  creator: 'Khushi Rathore',
  alternates: { canonical: '/' },
  robots: 'index, follow, max-image-preview:large',
  // site ownership checks carried over from the old site
  verification: {
    google: 'rpWxWxfA-R3SPJI6goG2WPlr64AZJ2hvRcVUykzFhjU',
    other: { 'msvalidate.01': 'BAFD1C07CCEA06E17F95D0E3EBAA26FE' },
  },
  openGraph: {
    title: 'Khushi Rathore | Software Developer',
    description: 'Web and mobile apps people use every day. Open to full-time roles and freelance projects.',
    url: SITE,
    siteName: 'Khushi Rathore',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Khushi Rathore — Software Developer' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khushi Rathore | Software Developer',
    description: 'Web and mobile apps people use every day.',
    images: ['/og-image.jpg'],
    creator: '@KhushieRathore',
    site: '@KhushieRathore',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${league.variable} ${jet.variable} ${inter.variable} ${caveat.variable}`}>
      <body>
        {children}

        {/* Google Analytics (same property as the old site) */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>

        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Khushi Rathore',
            url: SITE,
            image: `${SITE}/og-image.jpg`,
            jobTitle: 'Software Developer',
            knowsAbout: ['React', 'Next.js', 'TypeScript', 'React Native', 'Nest.js', 'Node.js', 'Full Stack Development'],
            sameAs: ['https://github.com/Khushee21', 'https://x.com/KhushieRathore', 'https://www.linkedin.com/in/khushi-rathore-5363a8257/'],
          })}
        </Script>
      </body>
    </html>
  )
}
