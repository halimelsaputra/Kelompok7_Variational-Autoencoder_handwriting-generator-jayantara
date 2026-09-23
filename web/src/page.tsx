import { HeroSection } from "@/components/hero-section"
import Aurora from "@/components/Aurora"
import { ConcepsSection } from "@/components/conceps-section"
import { GeneratingSection } from "@/components/generating-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <main className="min-h-screen relative">
        <div className="fixed inset-0 w-full h-full pointer-events-none">
          <Aurora colorStops={["#475569", "#64748b", "#475569"]} amplitude={1.2} blend={0.6} speed={0.8} />
        </div>
        <div className="relative z-10">
          <HeroSection />
          <GeneratingSection />
          <ConcepsSection />
          <Footer />
        </div>
      </main>
    </div>
  )
}
