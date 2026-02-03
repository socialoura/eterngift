'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Heart, Package, Truck, RefreshCw, CreditCard, Gift, MessageCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/components/providers/I18nProvider'

const faqCategories = [
  {
    id: 'products',
    nameKey: 'faqPage.catProducts',
    icon: Gift,
    questions: [
      {
        qKey: 'faqPage.qa.products.q1',
        aKey: 'faqPage.qa.products.a1',
      },
      {
        qKey: 'faqPage.qa.products.q2',
        aKey: 'faqPage.qa.products.a2',
      },
      {
        qKey: 'faqPage.qa.products.q3',
        aKey: 'faqPage.qa.products.a3',
      },
      {
        qKey: 'faqPage.qa.products.q4',
        aKey: 'faqPage.qa.products.a4',
      },
    ],
  },
  {
    id: 'shipping',
    nameKey: 'faqPage.catShipping',
    icon: Truck,
    questions: [
      {
        qKey: 'faqPage.qa.shipping.q1',
        aKey: 'faqPage.qa.shipping.a1',
      },
      {
        qKey: 'faqPage.qa.shipping.q2',
        aKey: 'faqPage.qa.shipping.a2',
      },
      {
        qKey: 'faqPage.qa.shipping.q3',
        aKey: 'faqPage.qa.shipping.a3',
      },
      {
        qKey: 'faqPage.qa.shipping.q4',
        aKey: 'faqPage.qa.shipping.a4',
      },
    ],
  },
  {
    id: 'returns',
    nameKey: 'faqPage.catReturns',
    icon: RefreshCw,
    questions: [
      {
        qKey: 'faqPage.qa.returns.q1',
        aKey: 'faqPage.qa.returns.a1',
      },
      {
        qKey: 'faqPage.qa.returns.q2',
        aKey: 'faqPage.qa.returns.a2',
      },
      {
        qKey: 'faqPage.qa.returns.q3',
        aKey: 'faqPage.qa.returns.a3',
      },
    ],
  },
  {
    id: 'payment',
    nameKey: 'faqPage.catPayment',
    icon: CreditCard,
    questions: [
      {
        qKey: 'faqPage.qa.payment.q1',
        aKey: 'faqPage.qa.payment.a1',
      },
      {
        qKey: 'faqPage.qa.payment.q2',
        aKey: 'faqPage.qa.payment.a2',
      },
      {
        qKey: 'faqPage.qa.payment.q3',
        aKey: 'faqPage.qa.payment.a3',
      },
    ],
  },
  {
    id: 'care',
    nameKey: 'faqPage.catCare',
    icon: Heart,
    questions: [
      {
        qKey: 'faqPage.qa.care.q1',
        aKey: 'faqPage.qa.care.a1',
      },
      {
        qKey: 'faqPage.qa.care.q2',
        aKey: 'faqPage.qa.care.a2',
      },
      {
        qKey: 'faqPage.qa.care.q3',
        aKey: 'faqPage.qa.care.a3',
      },
    ],
  },
]

function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-b border-gray-100 last:border-0"
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className={cn(
          'text-lg font-medium transition-colors',
          isOpen ? 'text-[#B71C1C]' : 'text-gray-800 group-hover:text-[#B71C1C]'
        )}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
            isOpen ? 'bg-[#B71C1C] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#FFE5E5] group-hover:text-[#B71C1C]'
          )}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState('products')
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  const currentCategory = faqCategories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8F8] to-white">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF88]/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-full mb-6"
            >
              <MessageCircle className="w-10 h-10 text-[#B71C1C]" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6">
              {t('faqPage.title')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] to-[#D4AF88]">
                {t('faqPage.titleHighlight')}
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {t('faqPage.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  {t('faqPage.categories')}
                </h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setOpenQuestion(null)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-[#FFE5E5] hover:text-[#B71C1C]'
                      )}
                    >
                      <category.icon className="w-5 h-5" />
                      <span className="font-medium">{t(category.nameKey)}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Questions */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl p-6 lg:p-8"
                >
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    {currentCategory && (
                      <>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-xl flex items-center justify-center">
                          <currentCategory.icon className="w-6 h-6 text-[#B71C1C]" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-heading font-bold text-gray-900">
                            {t(currentCategory.nameKey)}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {currentCategory.questions.length} {t('faqPage.questions')}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="divide-y divide-gray-100">
                    {currentCategory?.questions.map((item, index) => (
                      <FAQItem
                        key={index}
                        question={t(item.qKey)}
                        answer={t(item.aKey)}
                        isOpen={openQuestion === `${activeCategory}-${index}`}
                        onClick={() => 
                          setOpenQuestion(
                            openQuestion === `${activeCategory}-${index}` 
                              ? null 
                              : `${activeCategory}-${index}`
                          )
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#8B1538] via-[#B71C1C] to-[#D4AF88] rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">
                Still Have Questions?
              </h2>

              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Our friendly support team is here to help. Reach out to us and we&apos;ll get back to you within 24 hours.
              </p>

              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-[#B71C1C] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-shadow"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
