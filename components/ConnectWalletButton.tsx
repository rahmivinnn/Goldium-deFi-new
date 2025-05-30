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
  const { publicKey, connected } = useWallet()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58())
    } else {
      setWalletAddress(null)
    }
  }, [connected, publicKey])

  return (
    <div className="flex flex-col items-center gap-2">
      <ClientWalletButton className="!bg-gradient-to-r !from-gold-500 !to-gold-600 !text-black !font-semibold !px-6 !py-2 !rounded-lg hover:!from-gold-600 hover:!to-gold-700 !transition-all !duration-200" />
      {walletAddress && (
        <p className="text-white text-sm mt-2">
          Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
        </p>
      )}
    </div>
  )
}

export default ConnectWalletButton