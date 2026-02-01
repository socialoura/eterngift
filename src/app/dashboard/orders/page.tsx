'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, Mail, Truck, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const orders = [
  {
    id: 'EG-M2O9K-ABC1',
    customer: 'Sarah Mitchell',
    email: 'sarah@example.com',
    total: 149.99,
    items: 2,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    date: '2026-02-01',
  },
  {
    id: 'EG-N3P0L-DEF2',
    customer: 'John Davis',
    email: 'john@example.com',
    total: 79.99,
    items: 1,
    status: 'shipped',
    paymentMethod: 'PayPal',
    date: '2026-02-01',
  },
  {
    id: 'EG-O4Q1M-GHI3',
    customer: 'Emily Roberts',
    email: 'emily@example.com',
    total: 249.99,
    items: 3,
    status: 'processing',
    paymentMethod: 'Credit Card',
    date: '2026-01-31',
  },
  {
    id: 'EG-P5R2N-JKL4',
    customer: 'Michael Kim',
    email: 'michael@example.com',
    total: 89.99,
    items: 1,
    status: 'pending',
    paymentMethod: 'PayPal',
    date: '2026-01-31',
  },
  {
    id: 'EG-Q6S3O-MNO5',
    customer: 'Lisa Thompson',
    email: 'lisa@example.com',
    total: 129.99,
    items: 2,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    date: '2026-01-30',
  },
  {
    id: 'EG-R7T4P-PQR6',
    customer: 'David Brown',
    email: 'david@example.com',
    total: 199.99,
    items: 2,
    status: 'shipped',
    paymentMethod: 'Credit Card',
    date: '2026-01-30',
  },
]

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  processing: { label: 'Processing', variant: 'secondary' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
}

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">${order.total}</span>
                    <span className="text-sm text-gray-500 ml-1">({order.items} items)</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusConfig[order.status].variant}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Order"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                      {order.status === 'processing' && (
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as Shipped"
                        >
                          <Truck className="w-4 h-4 text-blue-500" />
                        </button>
                      )}
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
            Showing {filteredOrders.length} of {orders.length} orders
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
