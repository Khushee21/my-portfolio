

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

        {/* Vanta Background Scripts */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.birds.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta/dist/vanta.fog.min.js"></script>

        {/*  Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX'); 
          `}
           {/*UPDATE KRNA BAKI H....................................................................*/}
        </Script>
      </head>
      <body className={`${poppins.variable} ${ubuntu.variable} ${nunito.variable} ${geistSans.variable} ${geistMono.variable} font-poppins antialiased`}>
        {children}
      </body>
    </html>
  );
}
