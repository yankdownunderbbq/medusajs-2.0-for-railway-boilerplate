import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";

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
    <html lang="en">
      <head>
        {/* Preload fonts for better performance */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@400;500;600;700;800&display=swap" 
          as="style"
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          as="style"
        />
        
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
        
        {/* Smooth scrolling script */}
        <Script id="smooth-scroll" strategy="afterInteractive">
          {`
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
          `}
        </Script>
      </body>
    </html>
  );
}
