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
      <ClientWalletButton className="!bg-gradient-to-r !from-yellow-400 !via-yellow-500 !to-amber-600 !text-black !font-bold !px-8 !py-3 !rounded-xl !shadow-2xl !shadow-yellow-500/30 hover:!from-yellow-300 hover:!via-yellow-400 hover:!to-amber-500 hover:!shadow-yellow-400/50 !transition-all !duration-300 !transform hover:!scale-105 !border-2 !border-yellow-300/50 hover:!border-yellow-200 !backdrop-blur-sm" />
    </div>
  )
}

export default ConnectWalletButton