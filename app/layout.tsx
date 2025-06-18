import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/globals.css"
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

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ayotayo - Premium African & International Foods",
  description:
    "Discover authentic African and international foods, spices, and beverages. Fresh produce, quality ingredients, and traditional flavors delivered to your door.",
  keywords: "African food, international cuisine, spices, beverages, fresh produce, online grocery",
  authors: [{ name: "Ayotayo" }],
  openGraph: {
    title: "Ayotayo - Premium African & International Foods",
    description: "Discover authentic African and international foods, spices, and beverages.",
    url: "https://ayotayo.co.uk",
    siteName: "Ayotayo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayotayo - Premium African & International Foods",
    description: "Discover authentic African and international foods, spices, and beverages.",
    images: ["/og-image.jpg"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CountryProvider>
              <CurrencyProvider>
                <CartProvider>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                  <div className="fixed bottom-4 right-4 z-50">
                    <Button 
                      asChild 
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-10"
                    >
                      <Link href="/login">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Test Login</span>
                        <span className="xs:hidden">Login</span>
                      </Link>
                    </Button>
                  </div>
                </CartProvider>
              </CurrencyProvider>
            </CountryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
