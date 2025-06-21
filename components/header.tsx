"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  Search, 
  User, 
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Package,
  Coffee,
  Apple,
  Tag,
  Award,
  Percent,
  Home,
  Info,
  ShoppingBag,
  MessageCircle,
  BookOpen
} from "lucide-react"

const mainNavItems = [
  { title: "Home", href: "/", icon: Home },
  { 
    title: "Shop", 
    href: "/shop",
    icon: ShoppingBag,
    dropdown: [
      { title: "Beverages", href: "/shop?category=beverages", icon: Coffee },
      { title: "Food Items", href: "/shop?category=food", icon: Apple },
      { title: "New Arrivals", href: "/shop?sort=newest", icon: Package },
      { title: "Best Sellers", href: "/shop?sort=popular", icon: Award },
      { title: "Special Offers", href: "/shop?discount=true", icon: Percent }
    ]
  },
  { title: "About us", href: "/about", icon: Info },
  { title: "Bulk Order", href: "/bulk-order", icon: Package },
  { title: "Contact us", href: "/contact", icon: MessageCircle },
  { title: "Blog", href: "/blog", icon: BookOpen }
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle dropdown menu
  const toggleDropdown = (title: string) => {
    if (activeDropdown === title) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(title)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])
  
  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 mr-1" />
              <span>+44 123 456 7890</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1" />
              <a href="mailto:info@borderlessbuy.co.uk" className="hover:underline">
                info@borderlessbuy.co.uk
              </a>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>London, UK</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a href="#" className="hover:text-green-200 transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="hover:text-green-200 transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="hover:text-green-200 transition-colors"><Instagram className="h-4 w-4" /></a>
            </div>
            <span className="border-r border-green-500 h-4"></span>
            <Link href="/login" className="text-sm hover:text-green-200 flex items-center transition-colors">
              <User className="h-3.5 w-3.5 mr-1" />
              Login / Register
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-xl mr-2 shadow-md group-hover:shadow-lg transition-all">
                B
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800">BorderlessBuy</span>
                <span className="text-xs text-green-600 -mt-1 hidden sm:block">International Groceries</span>
              </div>
            </Link>
            
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  size="icon" 
                  className="absolute right-0 top-0 h-full bg-green-600 hover:bg-green-700 rounded-l-none rounded-r-full"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
            
            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/wishlist" className="relative hover:text-green-600 p-2 transition-colors">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="relative hover:text-green-600 p-2 transition-colors">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
          
          {/* Search Bar - Mobile */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for products..."
                className="pr-10 border-gray-300 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                size="icon" 
                className="absolute right-0 top-0 h-full bg-green-600 hover:bg-green-700 rounded-l-none rounded-r-full"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="bg-white border-t border-b hidden md:block">
        <div className="container">
          <ul className="flex justify-center items-center">
            {mainNavItems.map((item, index) => (
              <li key={item.title} className="relative group">
                <div
                  onClick={(e) => {
                    if (item.dropdown) {
                      e.stopPropagation();
                      toggleDropdown(item.title);
                    }
                  }}
                  className={`flex items-center cursor-pointer px-4 ${index !== mainNavItems.length - 1 ? 'border-r border-gray-200' : ''}`}
                >
                  <Link
                    href={item.href}
                    className={`flex h-12 items-center font-medium transition-colors gap-1.5 ${
                      pathname === item.href
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-700 hover:text-green-600"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </Link>
                  {item.dropdown && (
                    <ChevronDown 
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.title ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </div>
                
                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div
                    className={`absolute top-full left-0 bg-white shadow-xl rounded-b-lg w-56 z-30 transition-all duration-300 border-t-2 border-green-500 ${
                      activeDropdown === item.title
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible"
                    }`}
                  >
                    <ul className="py-2">
                      {item.dropdown.map((subItem) => {
                        const IconComponent = subItem.icon;
                        return (
                          <li key={subItem.title}>
                            <Link 
                              href={subItem.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {IconComponent && <IconComponent className="h-4 w-4 mr-3 text-green-600" />}
                              {subItem.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white absolute w-full shadow-xl transform transition-transform duration-300 max-h-[80vh] overflow-y-auto">
          <div className="container py-4">
            <ul className="space-y-4 divide-y divide-gray-100">
              {mainNavItems.map((item) => (
                <li key={item.title} className="py-2">
                  {!item.dropdown ? (
                    <Link
                      href={item.href}
                      className={`flex items-center py-2 space-x-2 ${
                        pathname === item.href
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </Link>
                  ) : (
                    <div>
                      <div 
                        className="flex justify-between items-center py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(item.title);
                        }}
                      >
                        <div className={`flex items-center space-x-2 ${
                          pathname === item.href
                            ? "text-green-600 font-medium"
                            : "text-gray-700"
                        }`}>
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown 
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.title ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      
                      {/* Mobile Dropdown */}
                      {activeDropdown === item.title && item.dropdown && (
                        <ul className="pl-4 mt-2 border-l-2 border-green-100 space-y-2">
                          {item.dropdown.map((subItem) => {
                            const IconComponent = subItem.icon;
                            return (
                              <li key={subItem.title}>
                                <Link
                                  href={subItem.href}
                                  className="flex items-center py-2 text-gray-600 hover:text-green-600"
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    setMobileMenuOpen(false);
                                  }}
                                >
                                  {IconComponent && <IconComponent className="h-4 w-4 mr-2 text-green-600" />}
                                  {subItem.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
              
              {/* Mobile-specific elements */}
              <li className="pt-4 flex flex-col space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  <span>+44 123 456 7890</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-3.5 w-3.5 mr-2" />
                  <a href="mailto:info@borderlessbuy.co.uk">info@borderlessbuy.co.uk</a>
                </div>
                <div className="flex space-x-4 pt-2">
                  <a href="#" className="text-gray-600 hover:text-green-600"><Facebook className="h-5 w-5" /></a>
                  <a href="#" className="text-gray-600 hover:text-green-600"><Twitter className="h-5 w-5" /></a>
                  <a href="#" className="text-gray-600 hover:text-green-600"><Instagram className="h-5 w-5" /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}
