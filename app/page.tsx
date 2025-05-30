import HeroSection from "@/components/home/HeroSection"
import InteractiveFeatures from "@/components/home/InteractiveFeatures"
import RealTimeStats from "@/components/home/RealTimeStats"
import CTASection from "@/components/home/CTASection"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <HeroSection />
      <InteractiveFeatures />
      <RealTimeStats />
      <CTASection />
      <Footer />
    </main>
  )
}
