'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, Heart, MessageCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@eterngift.com',
    description: 'We reply within 24 hours',
    href: 'mailto:support@eterngift.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-6pm EST',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Love Street',
    description: 'New York, NY 10001',
    href: '#',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon - Fri: 9am - 6pm',
    description: 'Weekend: 10am - 4pm',
    href: '#',
  },
]

const subjects = [
  'General Inquiry',
  'Order Status',
  'Product Question',
  'Return/Exchange',
  'Shipping Issue',
  'Partnership',
  'Other',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#FFF8F8] to-white">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF88]/20 rounded-full blur-3xl opacity-50" />
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
              Get In{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B71C1C] to-[#D4AF88]">
                Touch
              </span>
            </h1>

            <p className="text-lg text-gray-600">
              Have a question or need assistance? We&apos;re here to help make your gifting experience perfect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFE5E5] to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <info.icon className="w-7 h-7 text-[#B71C1C]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-[#B71C1C] font-medium mb-1">{info.value}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10"
            >
              <h2 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                    Message Sent! 💕
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We&apos;ll respond within 24 hours.
                  </p>
                  <Button
                    onClick={() => setStatus('idle')}
                    variant="outline"
                    className="border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/20 outline-none transition-all bg-white"
                    >
                      <option value="">Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#B71C1C] focus:ring-2 focus:ring-[#B71C1C]/20 outline-none transition-all resize-none"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      isLoading={status === 'loading'}
                      className="w-full bg-gradient-to-r from-[#B71C1C] to-[#D4AF88] hover:from-[#8B1538] hover:to-[#B71C1C] text-white py-4 text-lg font-semibold"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              )}
            </motion.div>

            {/* Right - Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900 mb-4">
                  We&apos;re Here to Help
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  At EternGift, we believe every gift should be perfect. Whether you have questions 
                  about our products, need help with an order, or just want to share your experience, 
                  our team is ready to assist you.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: '⚡', title: 'Fast Response', text: 'We reply within 24 hours, usually much faster!' },
                  { icon: '💝', title: 'Friendly Support', text: 'Our team truly cares about your experience.' },
                  { icon: '🔒', title: 'Secure & Private', text: 'Your information is always protected.' },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-500">{feature.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social proof */}
              <div className="bg-gradient-to-r from-[#FFE5E5] to-pink-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-6 h-6 text-[#B71C1C] fill-[#B71C1C]" />
                  <span className="font-bold text-gray-900">Trusted by 50,000+ Customers</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Join thousands of happy customers who have trusted EternGift for their 
                  most special moments. Our 4.9★ rating speaks for itself!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (placeholder) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#8B1538] to-[#B71C1C] rounded-3xl p-8 lg:p-12 text-center"
          >
            <h2 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-4">
              Follow Our Journey
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Stay connected with us on social media for exclusive offers, 
              behind-the-scenes content, and romantic gift inspiration.
            </p>
            <div className="flex justify-center gap-4">
              {['Instagram', 'Facebook', 'Pinterest', 'TikTok'].map((social) => (
                <motion.button
                  key={social}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
                >
                  {social}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
