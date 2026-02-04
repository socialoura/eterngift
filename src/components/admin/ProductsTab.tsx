'use client'

import { useState, useEffect } from 'react'
import { Package, Save, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  base_price: number
  stock: number
}

export function ProductsTab({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editedProducts, setEditedProducts] = useState<Record<string, { basePrice: number; stock: number }>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
        const initial: Record<string, { basePrice: number; stock: number }> = {}
        data.products.forEach((p: Product) => {
          initial[p.id] = { basePrice: Number(p.base_price), stock: p.stock }
        })
        setEditedProducts(initial)
      }
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (productId: string) => {
    setSaving(productId)
    try {
      await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(editedProducts[productId]),
      })
      await fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
    } finally {
      setSaving(null)
    }
  }

  const updateField = (productId: string, field: 'basePrice' | 'stock', value: number) => {
    setEditedProducts(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value }
    }))
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' }
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' }
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#B71C1C]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-[#B71C1C]" />
        <h2 className="text-2xl font-bold text-gray-900">Products & Pricing</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((product) => {
          const edited = editedProducts[product.id] || { basePrice: 0, stock: 0 }
          const status = getStockStatus(edited.stock)
          
          return (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={edited.basePrice}
                      onChange={(e) => updateField(product.id, 'basePrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      value={edited.stock}
                      onChange={(e) => updateField(product.id, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSave(product.id)}
                  disabled={saving === product.id}
                  className="w-full flex items-center justify-center gap-2 bg-[#B71C1C] text-white py-2 rounded-lg hover:bg-[#8B1538] transition-colors disabled:opacity-50"
                >
                  {saving === product.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
