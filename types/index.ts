export interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image?: string
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  origin?: string
  localName?: string
  discount?: number
  isOrganic?: boolean
  isHalal?: boolean
  isSale?: boolean
  isNew?: boolean
  tags: string[]
  availableCountries?: string[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}
