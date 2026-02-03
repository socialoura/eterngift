import { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection'
import { WhyEternGift } from '@/components/home/WhyEternGift'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

export const metadata: Metadata = {
  title: 'EternGift - Eternal Roses & Personalized Jewelry | Valentine\'s Day Gifts',
  description: 'Shop handcrafted eternal rose bears, personalized necklaces with custom engraving, and luxury gift boxes. Free worldwide shipping. Perfect for Valentine\'s Day, anniversaries & special occasions.',
  openGraph: {
    title: 'EternGift - Eternal Roses & Personalized Jewelry',
    description: 'Express your eternal love with our handcrafted roses and personalized jewelry. Free shipping on orders $50+.',
  },
}

export default function HomePage() {
  return (
    <main className="overflow-hidden -mt-[104px]">
      <HeroSection />
      <FeaturedProductsSection />
      <WhyEternGift />
      <Testimonials />
      <Newsletter />
    </main>
  )
}
