'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Create a client-only wallet button to prevent hydration issues
const ClientWalletButton = dynamic(
  () => Promise.resolve(({ className }: { className: string }) => (
    <WalletMultiButton className={className} />
  )),
  { ssr: false }
)

export function ConnectWalletButton() {
  return (
    <div className="flex items-center">
      <ClientWalletButton className="!bg-gradient-to-r !from-gold-500 !to-gold-600 !text-black !font-semibold !px-6 !py-2 !rounded-lg hover:!from-gold-600 hover:!to-gold-700 !transition-all !duration-200" />
    </div>
  )
}

export default ConnectWalletButton