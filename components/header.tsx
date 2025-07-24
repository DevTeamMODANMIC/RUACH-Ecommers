"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  Home,
  ShoppingBag,
  Info,
  Package,
  MessageCircle,
  LogOut,
  Phone,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useSafeCurrency } from "@/hooks/use-safe-currency";
import React from "react";
import { useAuth } from "@/components/auth-provider";
import { useWishlist } from "@/hooks/use-wishlist";
import ClientOnly from "@/components/client-only";
import { useVendor } from "@/hooks/use-vendor";

// We'll use CSS classes instead of inline styles

const mainNavItems = [
  { title: "Home", href: "/", icon: Home },
  {
    title: "Shop",
    href: "/shop",
    icon: ShoppingBag,
    dropdown: [
      { title: "Drinks", href: "/shop?category=drinks" },
      { title: "Flour", href: "/shop?category=flour" },
      { title: "Rice", href: "/shop?category=rice" },
      { title: "Pap/Custard", href: "/shop?category=pap-custard" },
      { title: "Spices", href: "/shop?category=spices" },
      { title: "Beverages", href: "/shop?category=beverages" },
      { title: "Dried Spices", href: "/shop?category=dried-spices" },
      { title: "Oil", href: "/shop?category=oil" },
      { title: "Provisions", href: "/shop?category=provisions" },
      { title: "Fresh Produce", href: "/shop?category=fresh-produce" },
      { title: "Fresh Vegetables", href: "/shop?category=fresh-vegetables" },
    ],
  },
  { title: "About us", href: "/about", icon: Info },
  { title: "Bulk Order", href: "/bulk-order", icon: Package },
  { title: "Contact us", href: "/contact", icon: MessageCircle },
];

const categoryNavItems = [
  { title: "Drinks", href: "/shop?category=drinks" },
  { title: "Flour", href: "/shop?category=flour" },
  { title: "Rice", href: "/shop?category=rice" },
  { title: "Pap/Custard", href: "/shop?category=pap-custard" },
  { title: "Spices", href: "/shop?category=spices" },
  { title: "Drinks & Beverages", href: "/shop?category=drinks" },
  { title: "Dried Spices", href: "/shop?category=dried-spices" },
  { title: "Oil", href: "/shop?category=oil" },
  { title: "Provisions", href: "/shop?category=provisions" },
  { title: "Fresh Produce", href: "/shop?category=fresh-produce" },
  { title: "Fresh Vegetables", href: "/shop?category=fresh-vegetables" },
  { title: "Fish & Meat", href: "/shop?category=meat" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, getTotalItems, getTotalPrice, isClient } = useCart();
  const { formatCurrency } = useSafeCurrency();
  const { wishlistCount } = useWishlist();
  const [logoError, setLogoError] = useState(false);
  const { user, logout } = useAuth();
  const { isVendor } = useVendor();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dropdown menu
  const toggleDropdown = (title: string) => {
    if (activeDropdown === title) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(title);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown &&
        !(event.target as Element).closest(".dropdown-menu-container")
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  const handleLogout = async () => {
    try {
      await logout();
      setActiveDropdown(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ${isScrolled ? "py-1" : "py-2"}`}
      >
        <div className="container mx-auto px-4">
          {/* Top Bar - Optional contact info or announcements */}
          <div className="hidden md:flex justify-end items-center space-x-6 py-1 text-xs text-gray-500 border-b border-gray-100">
            <span className="flex items-center">
              <Phone className="h-3 w-3 mr-1.5" /> +44 123 456 7890
            </span>
            <span className="font-medium text-green-600">Free UK delivery on orders over £50</span>
            <Link href="/vendor/register" className="hover:underline ml-4">
              Sell with Us
            </Link>
          </div>
          
          {/* Main Header */}
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {!logoError ? (
                <div className="relative h-12 w-12 mr-2 rounded-full overflow-hidden bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                  <Image
                    src="/logo/ruachi-logo.png"
                    alt="Ruach Logo"
                    width={48}
                    height={48}
                    className="object-cover rounded-full"
                    priority
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="bg-green-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg mr-2 shadow-md">
                  R
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 tracking-tight leading-tight">

                  RUACH PRODUCTION
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <form onSubmit={handleSearch} className="relative w-full flex">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pr-10 h-10 bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-l-md focus:border-green-500 focus:ring-green-500 shadow-sm text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-10 bg-green-600 hover:bg-green-700 rounded-l-none rounded-r-md shadow-sm w-10"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              <ul className="flex items-center">
                {mainNavItems.slice(0, 4).map((item, index) => (
                  <li key={item.title} className="relative">
                    <div
                      onClick={(e) => {
                        if (item.dropdown) {
                          e.stopPropagation();
                          toggleDropdown(item.title);
                        }
                      }}
                      className="flex items-center cursor-pointer dropdown-menu-container px-3"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center font-medium py-2 transition-colors duration-150 relative text-sm
                          ${
                            pathname === item.href
                              ? "text-green-700 after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-green-500 after:rounded-full"
                              : "text-gray-800 hover:text-green-600"
                          }`}
                      >
                        {item.title}
                      </Link>
                      {item.dropdown && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.title ? "rotate-180" : ""
                          } text-gray-500`}
                        />
                      )}
                    </div>

                    {/* Dropdown Menu */}
                    {item.dropdown && (
                      <div
                        className={`absolute top-full right-0 shadow-lg rounded-b-lg w-48 z-30 transition-all duration-300 dropdown-menu-container
                          bg-white border-t-2 border-green-500 ${
                            activeDropdown === item.title
                              ? "opacity-100 translate-y-0 visible"
                              : "opacity-0 -translate-y-2 invisible"
                          }`}
                      >
                        <ul className="py-1 max-h-60 overflow-y-auto">
                          {item.dropdown.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.href}
                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-sm"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
                {/* More menu dropdown */}
                <li className="relative">
                  <div
                    onClick={() => toggleDropdown("more-nav")}
                    className="flex items-center cursor-pointer dropdown-menu-container px-3"
                  >
                    <span className="flex items-center font-medium py-2 transition-colors duration-150 relative text-sm text-gray-800 hover:text-green-600">
                      More
                    </span>
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === "more-nav" ? "rotate-180" : ""
                      } text-gray-500`}
                    />
                  </div>
                  
                  {/* More Dropdown Menu */}
                  <div
                    className={`absolute top-full right-0 shadow-lg rounded-b-lg w-40 z-30 transition-all duration-300 dropdown-menu-container
                      bg-white border-t-2 border-green-500 ${
                        activeDropdown === "more-nav"
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                  >
                    <ul className="py-1">
                      {mainNavItems.slice(4).map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.href}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 text-sm"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              {/* Right Icons */}
              <div className="flex items-center space-x-5 ml-8 border-l pl-6 border-gray-100">
                <Link
                  href="/wishlist"
                  className="relative hover:text-green-600 p-2"
                >
                  <Heart className="h-6 w-6 text-gray-700" />
                  <ClientOnly>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </ClientOnly>
                </Link>

                <Link
                  href="/cart"
                  className="relative hover:text-green-600 p-2 flex items-center"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-700" />
                  <ClientOnly>
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </ClientOnly>
                  <ClientOnly>
                    <span className="hidden lg:inline-block ml-1 text-gray-800 font-medium text-sm">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </ClientOnly>
                </Link>

                <a
                  href="https://wa.me/2348012345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-200 shadow-sm"
                >
                  <Phone className="h-5 w-5" />
                  <span className="hidden lg:inline ml-1 text-sm">WhatsApp</span>
                </a>

                {user ? (
                  <div className="relative dropdown-menu-container">
                    <div
                      onClick={() => toggleDropdown("profile")}
                      className="hidden md:flex items-center hover:text-green-600 cursor-pointer p-1"
                    >
                      <div className="h-8 w-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-medium mr-1">
                        {user.displayName
                          ? user.displayName.charAt(0).toUpperCase()
                          : user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline text-sm font-medium text-gray-700">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === "profile" ? "rotate-180" : ""
                        } text-gray-500`}
                      />
                    </div>

                    {/* Profile Dropdown */}
                    <div
                      className={`absolute top-full right-0 shadow-lg rounded-lg w-48 z-30 transition-all duration-300
                        bg-white border-t-2 border-green-500 ${
                          activeDropdown === "profile"
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 -translate-y-2 invisible"
                        }`}
                    >
                      <div className="py-1">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-900">
                            {user.displayName || "Welcome!"}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <ul className="py-1">
                          <li>
                            <Link
                              href="/profile"
                              className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <User className="h-3 w-3 mr-1.5 text-gray-500" />
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile/orders"
                              className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Package className="h-3 w-3 mr-1.5 text-gray-500" />
                              My Orders
                            </Link>
                          </li>
                          {isVendor && (
                            <li>
                              <Link
                                href="/vendor/dashboard"
                                className="flex items-center px-3 py-1.5 text-gray-700 hover:bg-green-50 hover:text-green-700 text-xs"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Package className="h-3 w-3 mr-1.5 text-gray-500" />
                                Vendor Dashboard
                              </Link>
                            </li>
                          )}
                          <li>
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full text-left px-3 py-1.5 text-gray-700 hover:bg-red-50 hover:text-red-700 text-xs"
                            >
                              <LogOut className="h-3 w-3 mr-1.5 text-gray-500" />
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:flex items-center hover:text-green-600"
                  >
                    <User className="h-6 w-6 text-gray-700" />
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Right Icons */}
            <div className="flex md:hidden items-center space-x-3">
              <Link
                href="/wishlist"
                className="relative hover:text-green-600 p-1"
              >
                <Heart className="h-6 w-6 text-gray-700" />
                <ClientOnly>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </ClientOnly>
              </Link>

              <Link href="/cart" className="relative hover:text-green-600 p-1">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                <ClientOnly>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </ClientOnly>
              </Link>
              
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                suppressHydrationWarning
                className="flex items-center p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                <Phone className="h-5 w-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:bg-gray-100 p-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="py-1 md:hidden">
            <div className="relative flex">
              <Input
                type="search"
                placeholder="Search products..."
                className="pr-10 h-9 bg-gray-100 border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-l-full focus:border-green-500 focus:ring-green-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                size="sm"
                className="h-9 bg-green-600 hover:bg-green-700 rounded-l-none rounded-r-full"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Category Navigation removed – categories are now accessed via the "Shop" dropdown to create a cleaner header */}
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed top-[calc(7.5rem+1px)] left-0 right-0 md:hidden border-t shadow-lg transform transition-all duration-300 max-h-[80vh] overflow-y-auto
          bg-white border-t border-gray-200 z-40 ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          <ul className="space-y-4 divide-y divide-gray-200">
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
                      <div
                        className={`flex items-center space-x-2 ${
                          pathname === item.href
                            ? "text-green-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.title ? "rotate-180" : ""
                        } text-gray-500`}
                      />
                    </div>

                    {/* Mobile Dropdown */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        activeDropdown === item.title
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="pl-4 mt-2 border-l-2 border-green-500/30 space-y-2">
                        {item.dropdown.map((subItem) => (
                          <li key={subItem.title}>
                            <Link
                              href={subItem.href}
                              className="flex items-center py-2 text-gray-600 hover:text-green-600"
                              onClick={() => {
                                setActiveDropdown(null);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
            <li className="py-2">
              {/* WhatsApp Button for Mobile */}
              <a
                href="https://wa.me/2348012345678"
                target="_blank"
                rel="noopener noreferrer"
                suppressHydrationWarning
                className="flex items-center py-2 space-x-2 text-white bg-green-600 rounded-full justify-center mb-2 px-4"
              >
                <Phone className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
              {user ? (
                <>
                  <div className="flex items-center py-2 px-4 mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-medium mr-2">
                      {user.displayName
                        ? user.displayName.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName || "Welcome!"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center py-2 space-x-2 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="flex items-center py-2 space-x-2 text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center py-2 space-x-2 text-red-600 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center py-2 space-x-2 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Login / Register</span>
                </Link>
              )}
            </li>

            {/* Mobile Categories */}
            <li className="py-2">
              <div className="font-medium text-gray-900 py-2">Categories</div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link
                  href="/shop?category=drinks"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Drinks
                </Link>
                <Link
                  href="/shop?category=flour"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Flour
                </Link>
                <Link
                  href="/shop?category=rice"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rice
                </Link>
                <Link
                  href="/shop?category=custard"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pap/Custard
                </Link>
                <Link
                  href="/shop?category=spices"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Spices
                </Link>
                <Link
                  href="/shop?category=beverages"
                  className="text-gray-700 py-2 px-3 bg-gray-100 rounded hover:bg-gray-200 hover:text-green-600 text-sm transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Beverages
                </Link>
              </div>
            </li>

            {/* Mobile Search - Top of mobile menu */}
            <li className="py-2">
              <div className="font-medium text-gray-900 py-2">Search</div>
              <div className="lg:hidden pt-4 px-4">
                <form onSubmit={handleSearch} className="flex w-full">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="rounded-r-none border-r-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit"
                    className="rounded-l-none bg-green-600 hover:bg-green-700"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className={`${isScrolled ? "h-28" : "h-32"} md:h-40`}></div>
    </>
  );
}
