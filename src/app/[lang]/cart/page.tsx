'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/store/cart'
import { useCurrencyStore } from '@/store/currency'
import { useTranslation, useLocale } from '@/components/providers/I18nProvider'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalItems, getSubtotalUsd } = useCartStore()
  const { formatPrice } = useCurrencyStore()
  const { t } = useTranslation()
  const locale = useLocale()

  const subtotalUsd = getSubtotalUsd()
  const shippingUsd = subtotalUsd > 50 ? 0 : 9.99
  const totalUsd = subtotalUsd + shippingUsd

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-primary/50" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
            {t('cart.empty')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('cart.emptyDescription')}
          </p>
          <Link href={`/${locale}/collections`}>
            <Button>
              {t('cart.startShopping')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-light-pink/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
            {t('cart.yourCart')} ({getTotalItems()})
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-card flex gap-4"
                >
                  {/* Product Image */}
                  <Link href={`/${locale}/products/${item.product.id === 1 ? 'eternal-rose-bear' : 'eternal-rose-box'}`}>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-cream shrink-0">
                      <Image
                        src={item.product.imageUrl || '/images/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <Link href={`/${locale}/products/${item.product.id === 1 ? 'eternal-rose-bear' : 'eternal-rose-box'}`}>
                        <h3 className="font-heading font-semibold text-gray-800 hover:text-primary transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.product.category}
                    </p>

                    {(item.engravingLeftHeart || item.engravingRightHeart) && (
                      <div className="mt-2 text-xs text-gray-600 bg-light-pink/40 rounded-lg px-3 py-2">
                        {item.engravingLeftHeart && (
                          <p>
                            <span className="font-medium">{t('cart.leftHeart')}:</span> {item.engravingLeftHeart}
                          </p>
                        )}
                        {item.engravingRightHeart && (
                          <p>
                            <span className="font-medium">{t('cart.rightHeart')}:</span> {item.engravingRightHeart}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-primary">
                        {formatPrice(item.product.priceUsd * item.quantity)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link href={`/${locale}/collections`}>
                  <Button variant="outline">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t('common.continueShopping')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-card sticky top-24"
              >
                <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6">
                  {t('cart.yourCart')}
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.subtotal')}</span>
                    <span className="font-medium">{formatPrice(subtotalUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('cart.shipping')}</span>
                    <span className="font-medium">
                      {shippingUsd === 0 ? (
                        <span className="text-green-600">{t('cart.free')}</span>
                      ) : (
                        formatPrice(shippingUsd)
                      )}
                    </span>
                  </div>
                  {shippingUsd > 0 && (
                    <p className="text-xs text-gray-500">
                      Free shipping on orders over {formatPrice(50)}
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t('cart.total')}</span>
                      <span className="text-primary">{formatPrice(totalUsd)}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/${locale}/checkout`} className="block mt-6">
                  <Button className="w-full" size="lg">
                    {t('cart.proceedToCheckout')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-4 text-gray-400">
                    <Image
                      src="/logos/payment-methods/visa.svg"
                      alt="Visa"
                      width={40}
                      height={25}
                      className="h-6 w-auto opacity-60"
                    />
                    <Image
                      src="/logos/payment-methods/mastercard.svg"
                      alt="Mastercard"
                      width={40}
                      height={25}
                      className="h-6 w-auto opacity-60"
                    />
                    <Image
                      src="/logos/payment-methods/paypal.svg"
                      alt="PayPal"
                      width={40}
                      height={25}
                      className="h-6 w-auto opacity-60"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Secure checkout powered by industry-leading encryption
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
