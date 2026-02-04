'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Trash2, ExternalLink, Loader2, Edit2, Check, X } from 'lucide-react'

interface Order {
  id: number
  order_number: string
  customer_email: string
  customer_name: string
  total_usd: number
  subtotal_usd: number
  status: string
  payment_method: string
  payment_id: string | null
  created_at: string
}

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'cancelled', 'refunded']

export function OrdersTab({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingCost, setEditingCost] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [tempCost, setTempCost] = useState(0)
  const [tempNotes, setTempNotes] = useState('')

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.orders) setOrders(data.orders)
    } catch (err) { console.error(err) } 
    finally { setLoading(false) }
  }

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  const saveCost = async (orderId: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cost: tempCost }),
    })
    setEditingCost(null)
    fetchOrders()
  }

  const saveNotes = async (orderId: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes: tempNotes }),
    })
    setEditingNotes(null)
    fetchOrders()
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchOrders()
  }

  const filteredOrders = orders.filter(o => {
    const matchSearch = (o.customer_email || '').toLowerCase().includes(search.toLowerCase()) || 
                       (o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
                       (o.order_number || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#B71C1C]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-[#B71C1C]" />
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, name, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C]"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.order_number} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{order.customer_name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{order.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">€{Number(order.total_usd || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{order.payment_method || 'card'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.order_number, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {order.payment_id && (
                        <a href={`https://dashboard.stripe.com/payments/${order.payment_id}`} target="_blank" className="p-1 text-blue-600 hover:text-blue-800"><ExternalLink className="w-4 h-4" /></a>
                      )}
                      <button onClick={() => deleteOrder(order.order_number)} className="p-1 text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  )
}
