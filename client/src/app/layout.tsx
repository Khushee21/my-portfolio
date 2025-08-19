import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins, Ubuntu, Nunito } from "next/font/google";
import Script from "next/script";

const poppins = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const ubuntu = Ubuntu({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
});

const nunito = Nunito({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-nunito',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khushi Rathore | Full Stack Developer",
  description: "Portfolio of Khushi Rathore - Fullstack Developer & Designer",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Khushi Rathore | Full Stack Developer",
    description: "Portfolio of Khushi Rathore - Fullstack Developer & Designer",
    url: "https://khushirathore.vercel.app",
    siteName: "Khushi Rathore Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khushi Rathore Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khushi Rathore | Full Stack Developer",
    description: "Portfolio of Khushi Rathore - Fullstack Developer & Designer",
    images: ["/og-image.png"],
    creator: "@KhushieRathore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://khushirathore.vercel.app" />
        <link rel="icon" href="/favicon.ico" />

        {/* ✅ Vanta Scripts */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.birds.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.fog.min.js"
          strategy="beforeInteractive"
        />

        {/* ✅ Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HRXERE0YT3"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HRXERE0YT3');
          `}
        </Script>

        {/* ✅ JSON-LD Structured Data */}
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Khushi Rathore",
            "url": "https://khushirathore.vercel.app",
            "sameAs": [
              "https://github.com/Khushee21",
              "https://x.com/KhushieRathore",
              "https://www.linkedin.com/in/khushi-rathore-5363a8257/"
            ]
          })}
        </Script>
      </head>
      <body
        className={`${poppins.variable} ${ubuntu.variable} ${nunito.variable} ${geistSans.variable} ${geistMono.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
