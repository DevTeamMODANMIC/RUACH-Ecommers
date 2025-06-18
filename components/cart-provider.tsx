"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  country: string
  category: string
  brand: string
  inStock: boolean
  maxQuantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (productId: number) => boolean
  getCartItem: (productId: number) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart-items", [])
  const { toast } = useToast()

  const addToCart = (product: any, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stockCount || 99)
        if (newQuantity > existingItem.quantity) {
          toast({
            title: "Cart updated",
            description: `${product.name} quantity updated to ${newQuantity}`,
          })
        } else {
          toast({
            title: "Stock limit reached",
            description: `Cannot add more ${product.name} to cart`,
            variant: "destructive",
          })
        }
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
      } else {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity,
          country: product.country,
          category: product.category,
          brand: product.brand,
          inStock: product.inStock,
          maxQuantity: product.stockCount || 99,
        }
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        })
        return [...prevItems, cartItem]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === productId)
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.name} has been removed from your cart`,
        })
      }
      return prevItems.filter((item) => item.id !== productId)
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(quantity, item.maxQuantity) } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const isInCart = (productId: number) => {
    return items.some((item) => item.id === productId)
  }

  const getCartItem = (productId: number) => {
    return items.find((item) => item.id === productId)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
