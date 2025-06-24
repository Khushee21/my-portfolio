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
  title: "Khushi's Portfolio",
  description: "Portfolio of Khushi Rathore",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Khushi's Portfolio</title>
        <meta name="description" content="Portfolio of Khushi Rathore" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* ✅ Vanta Scripts via Script component */}
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
          `}
        </Script>
      </head>
      <body className={`${poppins.variable} ${ubuntu.variable} ${nunito.variable} ${geistSans.variable} ${geistMono.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
