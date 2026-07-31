'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useParams } from 'next/navigation'

type Status = 'loading' | 'not_found' | 'expired' | 'already_used' | 'ready' | 'submitting' | 'done' | 'error'

interface RecoveryInfo {
  orderNumber: string
  customerName: string
}

export default function RecoverPage() {
  const params = useParams<{ token: string }>()
  const token = params?.token ?? ''
  const [status, setStatus] = useState<Status>('loading')
  const [info, setInfo] = useState<RecoveryInfo | null>(null)
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Auto-detect lang from navigator
  const isFr = typeof navigator !== 'undefined' && /^fr/i.test(navigator.language || 'en')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const r = await fetch(`/api/engraving-recovery/${token}`)
        if (cancelled) return
        if (r.status === 404) return setStatus('not_found')
        if (r.status === 410) {
          // could be expired or already_used; try to infer
          return setStatus('expired')
        }
        if (!r.ok) return setStatus('error')
        const data = (await r.json()) as RecoveryInfo
        setInfo(data)
        setStatus('ready')
      } catch (e) {
        if (!cancelled) setStatus('error')
      }
    }
    if (token) load()
    return () => { cancelled = true }
  }, [token])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const r = await fetch(`/api/engraving-recovery/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ left, right }),
      })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        setErrorMsg(err.error || 'submit_failed')
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const t = (en: string, fr: string) => (isFr ? fr : en)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#B71C1C]">EternGift</h1>
          <p className="text-sm text-gray-500 mt-1 tracking-widest">FOREVER IN LOVE</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {status === 'loading' && (
            <div className="text-center py-12 text-gray-500">{t('Loading…', 'Chargement…')}</div>
          )}

          {status === 'not_found' && (
            <div className="text-center">
              <p className="text-red-600 font-medium">{t('Link not found', 'Lien introuvable')}</p>
              <p className="text-sm text-gray-500 mt-2">
                {t('This link is invalid or has been deleted.', 'Ce lien est invalide ou a été supprimé.')}
              </p>
            </div>
          )}

          {(status === 'expired' || status === 'already_used') && (
            <div className="text-center">
              <p className="text-orange-600 font-medium">
                {status === 'already_used'
                  ? t('Link already used', 'Lien déjà utilisé')
                  : t('Link expired', 'Lien expiré')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t(
                  'Please reply to the original email so we can update your engraving.',
                  'Répondez à l\'email d\'origine pour que nous mettions à jour votre gravure.'
                )}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <p className="text-red-600 font-medium">{t('Something went wrong', 'Une erreur est survenue')}</p>
              {errorMsg && <p className="text-xs text-gray-500 mt-1">{errorMsg}</p>}
            </div>
          )}

          {status === 'ready' && info && (
            <form onSubmit={submit}>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {t('Choose your engraving', 'Choisissez votre gravure')}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {t(
                  `Order #${info.orderNumber} — Two short texts, one for each side of the heart pendant.`,
                  `Commande #${info.orderNumber} — Deux textes courts, un pour chaque face du pendentif cœur.`
                )}
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Left heart', 'Cœur gauche')}{' '}
                    <span className="text-gray-400 text-xs">({left.length}/15)</span>
                  </label>
                  <input
                    type="text"
                    value={left}
                    onChange={(e) => setLeft(e.target.value.slice(0, 15))}
                    maxLength={15}
                    placeholder={isFr ? 'Ex: Mon amour' : 'e.g. My love'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('Right heart', 'Cœur droit')}{' '}
                    <span className="text-gray-400 text-xs">({right.length}/15)</span>
                  </label>
                  <input
                    type="text"
                    value={right}
                    onChange={(e) => setRight(e.target.value.slice(0, 15))}
                    maxLength={15}
                    placeholder={isFr ? 'Ex: Pour toujours' : 'e.g. Forever'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#B71C1C] to-[#8B1538] text-white font-bold py-3 rounded-lg hover:opacity-95 transition"
                >
                  {t('💝 Save my engraving', '💝 Enregistrer ma gravure')}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                {t(
                  'Leave a field empty if you only want one side engraved.',
                  'Laissez un champ vide si vous ne voulez graver qu\'une seule face.'
                )}
              </p>
            </form>
          )}

          {status === 'done' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t('Engraving saved!', 'Gravure enregistrée !')}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {t(
                  'Your order is now ready. We\'ll prepare your gift with care.',
                  'Votre commande est finalisée. Nous préparons votre cadeau avec soin.'
                )}
              </p>
            </div>
          )}

          {status === 'submitting' && (
            <div className="text-center py-12 text-gray-500">{t('Saving…', 'Enregistrement…')}</div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EternGift
        </p>
      </div>
    </div>
  )
}