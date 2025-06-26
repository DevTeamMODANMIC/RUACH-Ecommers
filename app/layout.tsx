import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import "./tailwind.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { CurrencyProvider } from "@/components/currency-provider"
import { CartProvider } from "@/components/cart-provider"
import { CountryProvider } from "@/components/country-provider"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Site name should be consistent across all environments
const SITE_NAME = "BorderlessBuy";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Premium African & International Foods`,
  description:
    "Discover authentic African and international foods, spices, and beverages. Fresh produce, quality ingredients, and traditional flavors delivered to your door.",
  keywords: "African food, international cuisine, spices, beverages, fresh produce, online grocery, Heritage of Skegness",
  authors: [{ name: SITE_NAME }],
  metadataBase: new URL("https://borderlessbuy.co.uk"),
  openGraph: {
    title: `${SITE_NAME} - Heritage of Skegness`,
    description: "Discover authentic African and international foods, spices, and beverages.",
    url: "https://borderlessbuy.co.uk",
    siteName: SITE_NAME,
    images: [
      {
        url: "/images/logo/borderlessbuy-logo.png",
        width: 800,
        height: 800,
        alt: "BorderlessBuy - Heritage of Skegness"
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Heritage of Skegness`,
    description: "Discover authentic African and international foods, spices, and beverages.",
    images: ["/images/logo/borderlessbuy-logo.png"],
  },
  generator: SITE_NAME
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/images/logo/borderlessbuy-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo/borderlessbuy-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-800`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <CountryProvider>
            <CurrencyProvider>
              <CartProvider>
                <AuthProvider>
                  <Header />
                  <main className="min-h-screen pt-20 sm:pt-24 md:pt-28">
                    {children}
                  </main>
                  <Footer />
                  <Toaster />
                  <div className="fixed bottom-4 right-4 z-50 hidden md:block">
                    <Button 
                      asChild 
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10 rounded-full shadow-lg"
                    >
                      <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 mr-2 inline-block"><path strokeLinecap="round" strokeLinejoin="round" d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.28.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.61-.48-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.44.03 1.44 1.02 2.84 1.16 3.04.14.2 2.01 3.08 4.88 4.2.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" /></svg>
                        <span>WhatsApp</span>
                      </a>
                    </Button>
                  </div>
                </AuthProvider>
              </CartProvider>
            </CurrencyProvider>
          </CountryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
