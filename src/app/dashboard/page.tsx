'use client'

import { motion } from 'framer-motion'
import { 
  DollarSign, ShoppingCart, Package, Users, 
  TrendingUp, ArrowUpRight, ArrowDownRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  {
    title: 'Total Revenue',
    value: '$12,450.00',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Total Orders',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    title: 'Products',
    value: '48',
    change: '+4',
    trend: 'up',
    icon: Package,
    color: 'bg-purple-500',
  },
  {
    title: 'New Customers',
    value: '89',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-rose-gold',
  },
]

const recentOrders = [
  { id: 'EG-ABC123', customer: 'Sarah M.', total: '$149.99', status: 'Delivered', date: '2 hours ago' },
  { id: 'EG-DEF456', customer: 'John D.', total: '$79.99', status: 'Shipped', date: '5 hours ago' },
  { id: 'EG-GHI789', customer: 'Emily R.', total: '$249.99', status: 'Processing', date: '1 day ago' },
  { id: 'EG-JKL012', customer: 'Michael K.', total: '$89.99', status: 'Pending', date: '1 day ago' },
  { id: 'EG-MNO345', customer: 'Lisa T.', total: '$129.99', status: 'Delivered', date: '2 days ago' },
]

const topProducts = [
  { name: 'Eternal Rose Box - Red', sales: 45, revenue: '$3,599.55' },
  { name: 'Romantic Gift Set Deluxe', sales: 28, revenue: '$4,199.72' },
  { name: 'Rose Gold Heart Necklace', sales: 52, revenue: '$2,599.48' },
  { name: 'Premium Rose Bear - Pink', sales: 31, revenue: '$2,789.69' },
]

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-3 rounded-lg', stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={cn(
                  'flex items-center text-sm font-medium',
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 ml-1" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900">Recent Orders</h2>
            <a href="/dashboard/orders" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.total}</p>
                  <span
                    className={cn(
                      'inline-block px-2 py-1 text-xs rounded-full',
                      statusColors[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-semibold text-gray-900">Top Products</h2>
            <a href="/dashboard/products" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {topProducts.map((product, index) => (
              <div key={product.name} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-light-pink rounded-full flex items-center justify-center text-primary font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{product.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Sales are up 12.5% this month!</h3>
            <p className="text-white/80">
              Keep up the great work. Your romantic gifts are making customers happy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
