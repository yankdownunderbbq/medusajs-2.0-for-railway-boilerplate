import type { Metadata } from "next";
import { Inter, Anek_Devanagari } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const anekDevanagari = Anek_Devanagari({ 
  subsets: ['latin'],
  variable: '--font-anek-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Yank DownUnder BBQ - Authentic American BBQ in Australia",
  description: "Regional American BBQ popup experiences in Australia. Kansas City burnt ends, Carolina pulled pork, Memphis ribs - experience them all.",
  keywords: "BBQ, American BBQ, Kansas City, Carolina, Memphis, popup restaurant, Brisbane, Australia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anekDevanagari.variable}`}>
      <head>
        {/* Font Awesome for icons */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
      </head>
      <body className="font-body">
        <Navigation />
        <main>
          {children}
        </main>
        <Footer />
        
        {/* Smooth scrolling script - only run once */}
        <Script id="smooth-scroll" strategy="afterInteractive">
          {`
            if (!window.smoothScrollInitialized) {
              // Smooth scrolling for navigation links
              document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                  e.preventDefault();
                  const target = document.querySelector(this.getAttribute('href'));
                  if (target) {
                    target.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                });
              });
              window.smoothScrollInitialized = true;
            }
          `}
        </Script>
      </body>
    </html>
  );
}
