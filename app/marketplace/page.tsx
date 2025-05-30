'use client'

import PageLayout from '@/components/PageLayout'
import AdvancedNFTMarketplace from '@/components/nft/AdvancedNFTMarketplace'

export default function MarketplacePage() {
  return (
    <PageLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Advanced NFT Marketplace</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover, collect, and trade unique digital assets with real-time data and advanced analytics
          </p>
        </div>

        {/* Advanced NFT Marketplace Component */}
        <AdvancedNFTMarketplace />
      </div>
    </PageLayout>
  )
}