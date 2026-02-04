'use client'

import { useState } from 'react'
import { Settings, Save, Loader2, CheckCircle, XCircle } from 'lucide-react'

export function SettingsTab({ token }: { token: string }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [secretKey, setSecretKey] = useState('')
  const [publishableKey, setPublishableKey] = useState('')
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'invalid' | null>(null)

  const changePassword = async () => {
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'Passwords do not match' }); return }
    if (newPw.length < 8) { setPwMsg({ type: 'error', text: 'Min 8 characters' }); return }
    setPwLoading(true); setPwMsg(null)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      })
      const data = await res.json()
      setPwMsg(data.success ? { type: 'success', text: 'Password changed' } : { type: 'error', text: data.error || 'Failed' })
      if (data.success) { setCurrentPw(''); setNewPw(''); setConfirmPw('') }
    } catch { setPwMsg({ type: 'error', text: 'Error' }) }
    finally { setPwLoading(false) }
  }

  const saveStripe = async () => {
    if (!secretKey.startsWith('sk_') || !publishableKey.startsWith('pk_')) return
    setStripeLoading(true)
    await fetch('/api/admin/stripe-settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ secretKey, publishableKey }),
    })
    setStripeLoading(false)
    setStripeStatus('connected')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Settings className="w-8 h-8 text-[#B71C1C]" /><h2 className="text-2xl font-bold">Settings</h2></div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <input type="password" placeholder="Current Password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="New Password" value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" placeholder="Confirm Password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          {pwMsg && <p className={pwMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>{pwMsg.text}</p>}
          <button onClick={changePassword} disabled={pwLoading} className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg disabled:opacity-50">
            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Stripe API Keys</h3>
        <div className="space-y-4 max-w-md">
          <input type="password" placeholder="Secret Key (sk_...)" value={secretKey} onChange={e => setSecretKey(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          <input type="text" placeholder="Publishable Key (pk_...)" value={publishableKey} onChange={e => setPublishableKey(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          {stripeStatus && <div className="flex items-center gap-2">{stripeStatus === 'connected' ? <><CheckCircle className="w-5 h-5 text-green-500" />Connected</> : <><XCircle className="w-5 h-5 text-red-500" />Invalid</>}</div>}
          <button onClick={saveStripe} disabled={stripeLoading} className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg disabled:opacity-50">
            {stripeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </div>
  )
}
