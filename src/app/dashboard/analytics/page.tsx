'use client'

import { motion } from 'framer-motion'
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react'

const monthlyData = [
  { month: 'Aug', revenue: 8500 },
  { month: 'Sep', revenue: 9200 },
  { month: 'Oct', revenue: 10100 },
  { month: 'Nov', revenue: 11500 },
  { month: 'Dec', revenue: 15800 },
  { month: 'Jan', revenue: 12450 },
]

const paymentBreakdown = [
  { method: 'Credit Card', percentage: 68, amount: 8466 },
  { method: 'PayPal', percentage: 32, amount: 3984 },
]

const topProducts = [
  { name: 'Romantic Gift Set Deluxe', revenue: 4199.72, percentage: 33.7 },
  { name: 'Eternal Rose Box - Red', revenue: 3599.55, percentage: 28.9 },
  { name: 'Premium Rose Bear - Pink', revenue: 2789.69, percentage: 22.4 },
  { name: 'Rose Gold Heart Necklace', revenue: 1860.04, percentage: 14.9 },
]

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track your store performance and insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Orders (MTD)</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">$79.81</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="font-heading font-semibold text-gray-900 mb-6">
            Revenue Trend (Last 6 Months)
          </h2>
          <div className="flex items-end gap-4 h-48">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                />
                <p className="text-xs text-gray-500 mt-2">{data.month}</p>
                <p className="text-xs font-medium text-gray-700">${(data.revenue / 1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="font-heading font-semibold text-gray-900 mb-6">
            Payment Methods Breakdown
          </h2>
          <div className="space-y-6">
            {paymentBreakdown.map((method) => (
              <div key={method.method}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{method.method}</span>
                  <span className="text-gray-600">${method.amount.toLocaleString()}</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-rose-gold rounded-full"
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">{method.percentage}% of total</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products by Revenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="font-heading font-semibold text-gray-900 mb-6">
          Top Products by Revenue
        </h2>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-light-pink rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">{product.name}</span>
                  <span className="font-semibold text-primary">${product.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-gold rounded-full"
                    style={{ width: `${product.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
