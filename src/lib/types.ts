export interface Product {
  id: number
  name: string
  description: string | null
  priceUsd: number
  imageUrl: string | null
  imagesUrl: string[]
  category: string | null
  stock: number
  rating: number | null
  reviewCount: number
  status: string
  badge: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  orderNumber: string
  customerEmail: string
  customerName: string
  customerCurrency: string
  subtotalUsd: number
  taxUsd: number
  totalUsd: number
  totalDisplayed: number | null
  exchangeRate: number | null
  shippingAddressStreet: string | null
  shippingAddressCity: string | null
  shippingAddressPostal: string | null
  shippingAddressCountry: string | null
  paymentMethod: string
  paymentId: string | null
  status: string
  emailSent: boolean
  discordNotified: boolean
  createdAt: Date
  updatedAt: Date
  orderItems: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  priceUsd: number
  quantity: number
  totalUsd: number
}

export interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface Testimonial {
  id: number
  name: string
  date: string
  rating: number
  comment: string
  product?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}
