'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Mail, CreditCard, Bell, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your store configuration</p>
      </div>

      <div className="grid gap-6">
        {/* Store Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-gray-900">Store Information</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Store Name" defaultValue="EternGift" disabled />
            <Input label="Store URL" defaultValue="https://eterngift.com" disabled />
            <Input label="Support Email" defaultValue="support@eterngift.com" disabled />
            <Input label="Base Currency" defaultValue="USD" disabled />
          </div>
        </motion.div>

        {/* Payment Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-heading font-semibold text-gray-900">Payment Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Stripe</p>
                  <p className="text-sm text-gray-500">Credit card payments</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0070ba] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PP</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-500">PayPal payments</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Email Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-heading font-semibold text-gray-900">Email Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">SendGrid</p>
                  <p className="text-sm text-gray-500">Transactional emails</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Input label="From Email" defaultValue="noreply@eterngift.com" disabled />
              <Input label="Reply-To Email" defaultValue="support@eterngift.com" disabled />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-heading font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5865F2] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DC</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Discord Webhook</p>
                  <p className="text-sm text-gray-500">Order notifications</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Connected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-light-pink/50 rounded-xl p-6"
        >
          <h3 className="font-heading font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            For any configuration changes or technical support, please contact us.
          </p>
          <a href="mailto:support@eterngift.com">
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
