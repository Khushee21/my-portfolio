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
  title: "Khushi Rathore | Full Stack Developer | Freelancer",
  description: "Khushi Rathore - Expert Full Stack Developer & Software Engineer specializing in modern web technologies. Browse portfolio projects in React, Next.js, and full-stack development.",
  keywords: "Khushi Rathore, Full Stack Developer, Software Developer, React Developer, Next.js Developer, Web Developer, Portfolio, JavaScript Developer",
  authors: [{ name: "Khushi Rathore" }],
  creator: "Khushi Rathore",
  publisher: "Khushi Rathore",
  robots: "index, follow, max-image-preview:large",
  metadataBase: new URL('https://khushirathore.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Khushi Rathore | Full Stack Developer & Freelancer",
    description: "Portfolio of Khushi Rathore - Expert Full Stack Developer specializing in React, Next.js, and modern web development technologies.",
    url: "https://khushirathore.vercel.app",
    siteName: "Khushi Rathore Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Khushi Rathore - Full Stack Developer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khushi Rathore | Full Stack Developer",
    description: "Portfolio of Khushi Rathore - Expert Full Stack Developer & Software Engineer",
    images: ["/og-image.png"],
    creator: "@KhushieRathore",
    site: "@KhushieRathore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="rpWxWxfA-R3SPJI6goG2WPlr64AZJ2hvRcVUykzFhjU" />
        <meta name="msvalidate.01" content="BAFD1C07CCEA06E17F95D0E3EBAA26FE" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3B82F6" />

        <meta property="og:first_name" content="Khushi" />
        <meta property="og:last_name" content="Rathore" />
        <meta property="og:username" content="khushirathore" />

        <meta name="author" content="Khushi Rathore" />
        <meta name="classification" content="Software Development, Web Development" />

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
            gtag('config', 'G-HRXERE0YT3', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Khushi Rathore",
            "alternateName": "Khushi Software Developer",
            "url": "https://khushirathore.vercel.app",
            "image": "https://khushirathore.vercel.app/og-image.png",
            "description": "Full Stack Developer and Software Engineer specializing in modern web technologies",
            "jobTitle": "Full Stack Developer",
            "worksFor": [
              {
                "@type": "Organization",
                "name": "Newral",
                "description": "Software Development Company"
              },
              {
                "@type": "Organization",
                "name": "Flexzistay",
                "description": "Hospitality Technology Company"
              }
            ],
            "knowsAbout": [
              "JavaScript",
              "TypeScript",
              "React",
              "Next.js",
              "Node.js",
              "Full Stack Development",
              "Web Development",
              "Software Engineering"
            ],
            "sameAs": [
              "https://github.com/Khushee21",
              "https://x.com/KhushieRathore",
              "https://www.linkedin.com/in/khushi-rathore-5363a8257/",
              "https://khushirathore.vercel.app"
            ]
          })}
        </Script>

        <Script id="website-schema" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Khushi Rathore Portfolio",
            "alternateName": "Khushi Rathore Software Developer",
            "url": "https://khushirathore.vercel.app",
            "description": "Portfolio website of Khushi Rathore - Full Stack Developer and Software Engineer",
            "publisher": {
              "@type": "Person",
              "name": "Khushi Rathore"
            }
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