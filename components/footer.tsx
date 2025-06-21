"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, MapPin, Mail, Phone, Send, Heart, CreditCard, ShieldCheck, Truck, Clock, ChevronRight } from "lucide-react"

export default function Footer() {
  const scrollToNewsletter = () => {
    const newsletterSection = document.getElementById('newsletter-section')
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* USP Banner */}
      <div className="bg-green-600 py-4 hidden md:block">
        <div className="container">
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center justify-center">
              <Truck className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Fast UK Delivery</span>
            </div>
            <div className="flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">100% Authentic Products</span>
            </div>
            <div className="flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">24/7 Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center mb-6">
              <div className="bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl mr-2">
                B
              </div>
              <span className="text-xl font-bold">BorderlessBuy</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted online destination for authentic African and Caribbean groceries, delivering quality products directly to your doorstep across the UK.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-800 hover:bg-green-600 h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-300">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-300">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-300">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Blog
                </Link>
              </li>
              <li>
                <button 
                  onClick={scrollToNewsletter} 
                  className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Subscribe to Newsletter
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500">
              Customer Service
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white hover:translate-x-1 flex items-center transition-all duration-300">
                  <ChevronRight className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-5 relative pl-3 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 leading-tight">123 Market Street, London, E14 5AB, United Kingdom</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span className="text-gray-400">+44 20 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <a href="mailto:info@borderlessbuy.co.uk" className="text-gray-400 hover:text-white">
                  info@borderlessbuy.co.uk
                </a>
              </li>
              <li className="pt-4">
                <p className="text-xs text-gray-500">
                  Business Hours: Monday to Friday, 9 AM - 6 PM
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Pre-Copyright Payment Options */}
      <div className="border-t border-gray-800 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex items-center">
              <span className="text-gray-400 text-sm mr-3">Payment Options:</span>
              <div className="flex space-x-2">
                <div className="h-6 w-10 bg-gray-800 rounded"></div>
                <div className="h-6 w-10 bg-gray-800 rounded"></div>
                <div className="h-6 w-10 bg-gray-800 rounded"></div>
                <div className="h-6 w-10 bg-gray-800 rounded"></div>
              </div>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Secure Shopping:</span>
              <span className="text-gray-300 text-sm ml-2 flex items-center">
                <ShieldCheck className="h-4 w-4 mr-1 text-green-500" /> 
                SSL Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BorderlessBuy. All Rights Reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-gray-500 text-sm flex items-center">
                Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> in London, UK
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
