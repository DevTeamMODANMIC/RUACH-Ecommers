"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, User, Heart, Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { CountrySelectorDropdown } from "@/components/country-selector-dropdown"

const categories = [
  "Drinks",
  "Flour",
  "Rice",
  "Pap/Custard",
  "Spices",
  "Beverages",
  "Dried Spices",
  "Oil",
  "Provisions",
  "Fresh Produce",
  "Fresh Vegetables",
  "Snack/Bread/Cereal",
  "Vegetable Oil",
  "Meat/Beef",
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all-categories")
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery, "in category:", selectedCategory)
  }

  return (
    <header className="bg-background border-b">
      {/* Top Bar */}
      <div className="bg-muted/50 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>📧 info@ayotayo.co.uk</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-green-600 transition-colors">
              About us
            </Link>
            <Link href="/shop" className="hover:text-green-600 transition-colors">
              Shop
            </Link>
            <Link href="/bulk-order" className="hover:text-green-600 transition-colors">
              Bulk Order
            </Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">
              Contact us
            </Link>
            <Link href="/blog" className="hover:text-green-600 transition-colors">
              Blog
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-xl font-bold text-green-600">Ayotayo</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 rounded-r-none border-r-0">
                  <SelectValue placeholder="SELECT CATEGORY" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-none border-x-0"
              />
              <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Country Selector - hide on smallest screens */}
            <div className="hidden sm:block">
              <CountrySelectorDropdown variant="header" showLabel={false} />
            </div>

            {/* Theme Toggle - hide on smallest screens */}
            <div className="hidden sm:block">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>

            {/* User Account */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-4 w-4" />
                  {user && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="p-2 border-b">
                      <p className="font-medium">{user.displayName || 'Logged In User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="p-2 border-b">
                      <p className="font-medium">Not logged in</p>
                      <p className="text-xs text-muted-foreground">Login to access your account</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist - hide on smallest screens */}
            <div className="hidden sm:block">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Shopping Cart */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {user ? '3' : '0'}
                </Badge>
              </Link>
            </Button>
            {/* Price - hide on smallest screens */}
            <span className="hidden sm:inline-block text-sm font-medium">{user ? '£34.99' : '£0.00'}</span>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="flex">
            <Input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Category Navigation */}
      <div className="bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex space-x-6 py-3 overflow-x-auto">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                className="whitespace-nowrap hover:text-green-200 transition-colors text-sm"
              >
                {category}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link href="/" className="block hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="block hover:text-green-600 transition-colors">
              About us
            </Link>
            <Link href="/shop" className="block hover:text-green-600 transition-colors">
              Shop
            </Link>
            <Link href="/bulk-order" className="block hover:text-green-600 transition-colors">
              Bulk Order
            </Link>
            <Link href="/contact" className="block hover:text-green-600 transition-colors">
              Contact us
            </Link>
            <Link href="/blog" className="block hover:text-green-600 transition-colors">
              Blog
            </Link>
            <Link href="/wishlist" className="block hover:text-green-600 transition-colors sm:hidden">
              Wishlist
            </Link>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Theme</h3>
                <Button variant="outline" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? (
                    <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
                  ) : (
                    <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
                  )}
                </Button>
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    className="text-sm hover:text-green-600 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
