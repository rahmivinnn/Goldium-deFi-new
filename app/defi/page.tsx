'use client'

import PageLayout from '@/components/PageLayout'
import AdvancedYieldFarming from '@/components/defi/AdvancedYieldFarming'

export default function DeFiPage() {
  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Advanced DeFi Ecosystem</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Earn yield through advanced liquidity provision, staking, and automated strategies with real contract addresses
          </p>
        </div>

        {/* Advanced Yield Farming Component */}
        <AdvancedYieldFarming />
      </div>
    </PageLayout>
  )
}
