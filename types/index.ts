export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  origin: string
  inStock: boolean
  images: string[]
  discount?: number
  rating?: number
  reviews?: Review[]
  options?: ProductOption[]
  featured?: boolean
  bulkPricing?: BulkPricingTier[]
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  shippingClass?: string
}

export type Review = {
  id: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  date: string
  helpful?: number
  verified?: boolean
}

export type ProductOption = {
  name: string
  values: string[]
}

export type BulkPricingTier = {
  quantity: number
  price: number
}

export type CartItem = {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  options?: Record<string, string>
}

export type UserAddress = {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export type Order = {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: UserAddress
  billingAddress: UserAddress
  paymentMethod: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  email: string
  name?: string
  avatar?: string
  addresses?: UserAddress[]
}

export type Country = {
  code: string
  name: string
  currency: {
    code: string
    symbol: string
    rate: number // Exchange rate relative to base currency (e.g., USD or GBP)
  }
  shipping: {
    available: boolean
    methods: ShippingMethod[]
  }
  vat: number // VAT rate as percentage
}

export type ShippingMethod = {
  id: string
  name: string
  price: number
  estimatedDelivery: string
}
