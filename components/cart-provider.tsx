"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/types"

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (productId: string) => boolean
  getCartItem: (productId: string) => CartItem | undefined
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("cart-items", [])
  const { toast } = useToast()

  // Sync cart across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart-items' && e.newValue) {
        try {
          const newItems = JSON.parse(e.newValue);
          setItems(newItems);
        } catch (error) {
          console.error('Failed to parse cart items from storage', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setItems]);

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.productId === item.productId)

      if (existingItem) {
        return prevItems.map((i) => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        )
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => {
      return prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
    })
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

  const isInCart = (productId: string) => {
    return items.some((item) => item.productId === productId)
  }

  const getCartItem = (productId: string) => {
    return items.find((item) => item.productId === productId)
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
