'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const products = [
  {
    id: 1,
    name: 'Eternal Rose Box - Red',
    category: 'Roses',
    price: 79.99,
    stock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=100',
  },
  {
    id: 2,
    name: 'Rose Gold Heart Necklace',
    category: 'Jewelry',
    price: 49.99,
    stock: 75,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100',
  },
  {
    id: 3,
    name: 'Premium Rose Bear - Pink',
    category: 'Plush',
    price: 89.99,
    stock: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100',
  },
  {
    id: 4,
    name: 'Romantic Gift Set Deluxe',
    category: 'Gift Sets',
    price: 149.99,
    stock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100',
  },
  {
    id: 5,
    name: 'Crystal Rose - Gold',
    category: 'Roses',
    price: 69.99,
    stock: 0,
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100',
  },
  {
    id: 6,
    name: 'Diamond Heart Earrings',
    category: 'Jewelry',
    price: 59.99,
    stock: 60,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100',
  },
]

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${product.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'font-medium',
                        product.stock === 0 ? 'text-red-500' : product.stock < 20 ? 'text-yellow-600' : 'text-gray-900'
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
