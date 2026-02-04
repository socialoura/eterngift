'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Loader2, Plus, Trash2 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Order { order_number: string; total_usd: number; subtotal_usd: number; status: string; created_at: string }
interface GoogleAdsExpense { month: string; amount: number }
const COLORS = ['#B71C1C', '#D4AF88', '#8B1538', '#FFB74D']

export function AnalyticsDashboard({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [expenses, setExpenses] = useState<GoogleAdsExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [newMonth, setNewMonth] = useState('')
  const [newAmount, setNewAmount] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/google-ads-expenses', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ]).then(([ordersData, expensesData]) => {
      if (ordersData.orders) setOrders(ordersData.orders)
      if (expensesData.expenses) setExpenses(expensesData.expenses)
    }).finally(() => setLoading(false))
  }, [token])

  const addExpense = async () => {
    if (!newMonth || !newAmount) return
    await fetch('/api/admin/google-ads-expenses', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ month: newMonth, amount: parseFloat(newAmount) }),
    })
    setNewMonth(''); setNewAmount('')
    const res = await fetch('/api/admin/google-ads-expenses', { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.expenses) setExpenses(data.expenses)
  }

  const deleteExpense = async (month: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/admin/google-ads-expenses/${month}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setExpenses(expenses.filter(e => e.month !== month))
  }

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_usd || 0), 0)
  const totalProfit = totalRevenue

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toISOString().split('T')[0]
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), revenue: orders.filter(o => o.created_at?.startsWith(dayStr)).reduce((s, o) => s + Number(o.total_usd || 0), 0) }
  })

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() - (11 - i))
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const mo = orders.filter(o => o.created_at?.startsWith(m))
    const rev = mo.reduce((s, o) => s + Number(o.total_usd || 0), 0)
    const ads = Number(expenses.find(e => e.month === m)?.amount || 0)
    return { month: d.toLocaleDateString('en', { month: 'short' }), revenue: rev, netProfit: rev - ads }
  })

  const productData = [{ name: 'Rose Box', value: Math.floor(orders.length * 0.6) }, { name: 'Rose Bear', value: Math.floor(orders.length * 0.4) }]

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#B71C1C]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-[#B71C1C]" /><h2 className="text-2xl font-bold">Analytics</h2></div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ l: 'Revenue', v: `€${totalRevenue.toFixed(2)}`, c: 'text-green-600' }, { l: 'Orders', v: orders.length, c: 'text-blue-600' }, { l: 'Avg Order', v: `€${(orders.length ? totalRevenue/orders.length : 0).toFixed(2)}`, c: 'text-purple-600' }, { l: 'Profit', v: `€${totalProfit.toFixed(2)}`, c: totalProfit >= 0 ? 'text-green-600' : 'text-red-600' }].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border"><p className="text-sm text-gray-500">{s.l}</p><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p></div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">Revenue (7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}><LineChart data={last7Days}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#B71C1C" /></LineChart></ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">Products</h3>
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={productData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>{productData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">Monthly Net Profit</h3>
        <ResponsiveContainer width="100%" height={250}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="revenue" fill="#B71C1C" name="Revenue" /><Bar dataKey="netProfit" fill="#D4AF88" name="Net Profit" /></BarChart></ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border"><h3 className="font-semibold mb-4">Google Ads Expenses</h3>
        <div className="flex gap-4 mb-4">
          <input type="month" value={newMonth} onChange={e => setNewMonth(e.target.value)} className="px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="EUR" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="px-3 py-2 border rounded-lg w-32" />
          <button onClick={addExpense} className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg"><Plus className="w-4 h-4" />Add</button>
        </div>
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Month</th><th className="px-4 py-2 text-left text-xs text-gray-500">Amount</th><th className="px-4 py-2"></th></tr></thead>
          <tbody>{expenses.map(e => <tr key={e.month} className="border-t"><td className="px-4 py-2">{e.month}</td><td className="px-4 py-2">€{Number(e.amount).toFixed(2)}</td><td className="px-4 py-2"><button onClick={() => deleteExpense(e.month)} className="text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
