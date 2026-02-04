'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, ShoppingCart, BarChart3, Settings, Tag, LogOut, Menu, X,
  Loader2
} from 'lucide-react'
import { ProductsTab } from '@/components/admin/ProductsTab'
import { OrdersTab } from '@/components/admin/OrdersTab'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { SettingsTab } from '@/components/admin/SettingsTab'
import { PromoTab } from '@/components/admin/PromoTab'

type TabType = 'products' | 'orders' | 'analytics' | 'settings' | 'promo'

const tabs = [
  { id: 'products' as TabType, label: 'Products & Pricing', icon: Package },
  { id: 'orders' as TabType, label: 'Orders', icon: ShoppingCart },
  { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  { id: 'promo' as TabType, label: 'Promo Codes', icon: Tag },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('products')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')
    if (!storedToken) {
      router.push('/admin')
      return
    }

    try {
      const decoded = JSON.parse(atob(storedToken))
      if (decoded.exp < Date.now()) {
        localStorage.removeItem('adminToken')
        router.push('/admin')
        return
      }
      setToken(storedToken)
      setLoading(false)
    } catch {
      localStorage.removeItem('adminToken')
      router.push('/admin')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#B71C1C]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-gray-900">EternGift Admin</h1>
        <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">EternGift</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'products' && <ProductsTab token={token!} />}
          {activeTab === 'orders' && <OrdersTab token={token!} />}
          {activeTab === 'analytics' && <AnalyticsDashboard token={token!} />}
          {activeTab === 'settings' && <SettingsTab token={token!} />}
          {activeTab === 'promo' && <PromoTab token={token!} />}
        </motion.div>
      </main>
    </div>
  )
}
