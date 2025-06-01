'use client'
import Navbar from '@/components/Navbar'
import ViralHeroSection from '@/components/home/ViralHeroSection'
import LiveStatsSection from '@/components/home/LiveStatsSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import RewardsSection from '@/components/home/RewardsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import WalletCTASection from '@/components/home/WalletCTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <ViralHeroSection />
      <LiveStatsSection />
      <HowItWorksSection />
      <RewardsSection />
      <TestimonialsSection />
      <WalletCTASection />
      <Footer />
    </main>
  )
}
