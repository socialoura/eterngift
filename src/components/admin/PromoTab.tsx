'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus, Trash2, Edit2, Loader2, X } from 'lucide-react'

interface PromoCode {
  code: string
  discount_type: string
  discount_value: number
  max_uses: number
  current_uses: number
  expires_at: string | null
  is_active: boolean
}

export function PromoTab({ token }: { token: string }) {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [promoEnabled, setPromoEnabled] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editCode, setEditCode] = useState<PromoCode | null>(null)
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, maxUses: -1, expiresAt: '', isActive: true })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const [codesRes, settingsRes] = await Promise.all([
      fetch('/api/admin/promo-codes', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/admin/promo-settings', { headers: { Authorization: `Bearer ${token}` } })
    ])
    const codesData = await codesRes.json()
    const settingsData = await settingsRes.json()
    if (codesData.codes) setCodes(codesData.codes)
    setPromoEnabled(settingsData.enabled || false)
    setLoading(false)
  }

  const togglePromoField = async () => {
    await fetch('/api/admin/promo-settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ enabled: !promoEnabled })
    })
    setPromoEnabled(!promoEnabled)
  }

  const saveCode = async () => {
    const method = editCode ? 'PUT' : 'POST'
    const url = editCode ? `/api/admin/promo-codes/${editCode.code}` : '/api/admin/promo-codes'
    await fetch(url, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    setShowModal(false)
    setEditCode(null)
    setForm({ code: '', discountType: 'percentage', discountValue: 10, maxUses: -1, expiresAt: '', isActive: true })
    fetchData()
  }

  const deleteCode = async (code: string) => {
    if (!confirm('Delete this promo code?')) return
    await fetch(`/api/admin/promo-codes/${code}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    fetchData()
  }

  const openEdit = (c: PromoCode) => {
    setEditCode(c)
    setForm({ code: c.code, discountType: c.discount_type, discountValue: Number(c.discount_value), maxUses: c.max_uses, expiresAt: c.expires_at?.split('T')[0] || '', isActive: c.is_active })
    setShowModal(true)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#B71C1C]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3"><Tag className="w-8 h-8 text-[#B71C1C]" /><h2 className="text-2xl font-bold">Promo Codes</h2></div>

      <div className="bg-white rounded-xl p-6 shadow-sm border flex items-center justify-between">
        <div><h3 className="font-semibold">Enable Promo Field</h3><p className="text-sm text-gray-500">Show promo code input at checkout</p></div>
        <button onClick={togglePromoField} className={`w-14 h-8 rounded-full transition-colors ${promoEnabled ? 'bg-[#B71C1C]' : 'bg-gray-300'}`}>
          <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${promoEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Promo Codes</h3>
          <button onClick={() => { setEditCode(null); setForm({ code: '', discountType: 'percentage', discountValue: 10, maxUses: -1, expiresAt: '', isActive: true }); setShowModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-[#B71C1C] text-white rounded-lg"><Plus className="w-4 h-4" />New Code</button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Code</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Discount</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Uses</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Expires</th>
            <th className="px-4 py-2 text-left text-xs text-gray-500">Active</th>
            <th className="px-4 py-2"></th>
          </tr></thead>
          <tbody>{codes.map(c => (
            <tr key={c.code} className="border-t">
              <td className="px-4 py-2 font-mono font-bold">{c.code}</td>
              <td className="px-4 py-2">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `€${Number(c.discount_value).toFixed(2)}`}</td>
              <td className="px-4 py-2">{c.current_uses}/{c.max_uses === -1 ? '∞' : c.max_uses}</td>
              <td className="px-4 py-2">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
              <td className="px-4 py-2"><span className={`px-2 py-1 rounded text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
              <td className="px-4 py-2 flex gap-2">
                <button onClick={() => openEdit(c)} className="text-blue-600"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteCode(c.code)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4"><h3 className="font-semibold">{editCode ? 'Edit' : 'New'} Promo Code</h3><button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <input placeholder="CODE" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} disabled={!!editCode} className="w-full px-4 py-2 border rounded-lg uppercase disabled:bg-gray-100" />
              <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                <option value="percentage">Percentage (%)</option><option value="fixed_amount">Fixed Amount (€)</option>
              </select>
              <input type="number" placeholder="Value" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
              <input type="number" placeholder="Max Uses (-1 = unlimited)" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg" />
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />Active</label>
              <button onClick={saveCode} className="w-full py-2 bg-[#B71C1C] text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
