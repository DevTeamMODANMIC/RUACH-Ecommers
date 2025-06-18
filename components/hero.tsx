"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Premium African & International Foods",
    subtitle: "Discover authentic flavors from around the world",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Fresh Produce & Quality Ingredients",
    subtitle: "Farm-fresh vegetables and premium spices",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "Explore Products",
  },
  {
    id: 3,
    title: "Traditional Beverages & Drinks",
    subtitle: "Authentic drinks from your homeland",
    image: "/placeholder.svg?height=600&width=1200",
    cta: "View Collection",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden bg-gray-900">
      {/* Test Login Button - Make it more responsive */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3">
          <Link href="/login">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Login</span>
            <span className="xs:hidden">Log</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2 sm:px-3">
          <Link href="/register">
            <span className="hidden xs:inline">Register</span>
            <span className="xs:hidden">Reg</span>
          </Link>
        </Button>
      </div>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4">{slide.title}</h1>
              <p className="text-sm sm:text-xl md:text-2xl mb-4 sm:mb-8 text-gray-200">{slide.subtitle}</p>
              <Button 
                size="default" 
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Hide on smallest screens */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}
