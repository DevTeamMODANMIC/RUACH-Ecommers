"use client"

import Link from "next/link"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Mail, 
  Phone,
  Truck,
  CreditCard,
  Shield,
  Heart
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">About Us</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Your trusted source for authentic African and international foods, delivered to your doorstep with care and quality assurance.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-green-600 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-green-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="text-gray-600 hover:text-green-600 transition-colors">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-green-600 transition-colors flex items-center">
                  <span className="text-green-600 mr-1">›</span>
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-green-600 transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-green-600 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">123 Market Street, London, UK</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">+44 (0) 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600">info@borderlessbuy.com</span>
              </li>
              <li>
                <Link href="https://www.borderlessbuy.com" className="text-gray-600 hover:text-green-600 transition-colors">
                  www.borderlessbuy.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* USP Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-8">
          <div className="flex items-center">
            <Truck className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <span className="text-sm font-medium">Fast Delivery</span>
              <p className="text-xs text-gray-500">Free on orders over £50</p>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <span className="text-sm font-medium">Secure Payment</span>
              <p className="text-xs text-gray-500">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <span className="text-sm font-medium">Quality Products</span>
              <p className="text-xs text-gray-500">Authentic guaranteed</p>
            </div>
          </div>
          <div className="flex items-center">
            <Heart className="h-5 w-5 text-green-600 mr-2" />
            <div>
              <span className="text-sm font-medium">Customer Love</span>
              <p className="text-xs text-gray-500">24/7 dedicated support</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6">
          <div className="mb-4 md:mb-0 flex items-center">
            <span className="text-gray-500 text-sm mr-3">We Accept</span>
            <div className="flex space-x-2">
              <div className="px-2 py-1">
                <svg className="h-8 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.435 22.375H13.093L11.125 30.812H15.467L17.435 22.375Z" fill="#00579F"/>
                  <path d="M30.9 22.562C29.933 22.188 28.967 22 27.813 22C24.533 22 22.19 23.75 22.19 26.25C22.19 28.188 23.907 29.125 25.25 29.75C26.593 30.375 27 30.75 27 31.312C27 32.125 26.033 32.5 25.067 32.5C23.72 32.5 23.033 32.312 21.78 31.75L21.223 31.5L20.667 35.125C21.78 35.5 23.627 35.875 25.533 35.875C29 35.875 31.267 34.125 31.267 31.5C31.267 29.938 30.34 28.75 28.34 27.875C27.187 27.312 26.5 26.938 26.5 26.375C26.5 25.875 27.093 25.375 28.34 25.375C29.373 25.375 30.153 25.562 30.713 25.75L31.08 25.875L31.637 22.75L30.9 22.562Z" fill="#00579F"/>
                  <path d="M36.5 22.375C35.627 22.375 35.067 22.562 34.32 23.312L31.5 30.812H34.967L35.44 29.312H38.747L39.027 30.812H42.12L39.773 22.375H36.5ZM36.127 26.875L37.073 25.062L37.64 26.875H36.127Z" fill="#00579F"/>
                  <path d="M20.013 22.375L16.733 28.375L16.36 26.75C15.767 25.125 14.053 23.375 12.06 22.562L15.093 30.812H18.56L24.033 22.375H20.013Z" fill="#00579F"/>
                </svg>
              </div>
              <div className="px-2 py-1">
                <svg className="h-8 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 30.812H12.5L15 18.188H19L16.5 30.812Z" fill="#FF5F00"/>
                  <circle cx="19" cy="24.5" r="6.5" fill="#EB001B"/>
                  <path d="M32.5 24.5C32.5 21.7 31.05 19.25 28.85 17.8C26.65 16.35 23.9 16.35 21.7 17.8C19.5 19.25 18.05 21.7 18.05 24.5C18.05 27.3 19.5 29.75 21.7 31.2C23.9 32.65 26.65 32.65 28.85 31.2C31.05 29.75 32.5 27.3 32.5 24.5Z" fill="#F79E1B"/>
                </svg>
              </div>
              <div className="px-2 py-1">
                <svg className="h-8 w-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M33.5 17.5H38.5C39.05 17.5 39.5 17.95 39.5 18.5V30.5C39.5 31.05 39.05 31.5 38.5 31.5H33.5C32.95 31.5 32.5 31.05 32.5 30.5V18.5C32.5 17.95 32.95 17.5 33.5 17.5Z" fill="#253B80"/>
                  <path d="M36 17.5C38.485 17.5 40.5 19.515 40.5 22V27C40.5 29.485 38.485 31.5 36 31.5C33.515 31.5 31.5 29.485 31.5 27V22C31.5 19.515 33.515 17.5 36 17.5Z" fill="#179BD7"/>
                  <path d="M12.5 24.5L13.75 18.5H16.5L15.25 24.5H12.5Z" fill="#253B80"/>
                  <path d="M15.25 24.5L16.5 18.5H22.5C23.6 18.5 24.5 19.4 24.5 20.5C24.5 21.6 23.6 22.5 22.5 22.5H19L18.25 24.5H15.25Z" fill="#253B80"/>
                  <path d="M18.25 24.5L19 22.5H22.5C23.6 22.5 24.5 23.4 24.5 24.5C24.5 25.6 23.6 26.5 22.5 26.5H19L18.25 24.5Z" fill="#179BD7"/>
                  <path d="M24.5 24.5L25.75 18.5H28.5L27.25 24.5H24.5Z" fill="#253B80"/>
                  <path d="M27.25 24.5L28.5 18.5H31.5L30.25 24.5H27.25Z" fill="#179BD7"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm">
            <p>© {currentYear} BorderlessBuy. All rights reserved.</p>
            <div className="hidden md:block">
              <Link href="/admin" className="text-green-600 hover:text-green-700 text-sm font-medium bg-green-50 px-3 py-1 rounded-md transition-colors">
                Admin Login
            </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
