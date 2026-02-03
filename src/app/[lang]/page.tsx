import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection'
import { WhyEternGift } from '@/components/home/WhyEternGift'
import { Testimonials } from '@/components/home/Testimonials'
import { Newsletter } from '@/components/home/Newsletter'

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
