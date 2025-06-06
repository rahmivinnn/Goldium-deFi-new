'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Wallet, Send, ArrowRightLeft, Coins } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

// Enhanced wallet button with error handling
const ClientWalletButton = dynamic(
  () => Promise.resolve(({ className, onClick }: { className: string; onClick?: () => void }) => {
    const handleClick = (e: React.MouseEvent) => {
      try {
        if (onClick) {
          onClick()
        }
      } catch (error) {
        console.error('Wallet button click error:', error)
        e.preventDefault()
      }
    }
    
    return (
      <WalletMultiButton 
        className={className} 
        onClick={handleClick}
      />
    )
  }),
  { ssr: false }
)

export function ConnectWalletButton() {
  const { connected, publicKey, wallet, connecting } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  
  // Check wallet readiness
  useEffect(() => {
    const checkWalletReadiness = () => {
      if (typeof window !== 'undefined') {
        // Check if wallet extensions are available
        const hasPhantom = !!(window as any).phantom?.solana
        const hasSolflare = !!(window as any).solflare
        setIsReady(hasPhantom || hasSolflare)
      }
    }
    
    checkWalletReadiness()
    
    // Recheck after a delay to allow extensions to load
    const timer = setTimeout(checkWalletReadiness, 1000)
    return () => clearTimeout(timer)
  }, [])
  
  const handleWalletClick = () => {
    try {
      if (!isReady) {
        toast({
          title: "Wallet Not Available",
          description: "Please install Phantom or Solflare wallet extension.",
          variant: "destructive",
        })
        return
      }
      
      if (wallet && !wallet.readyState) {
        toast({
          title: "Wallet Not Ready",
          description: "Please unlock your wallet and try again.",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      console.error('Wallet click handler error:', error)
    }
  }
  
  const handleQuickAction = (action: string) => {
    // Ensure wallet is properly connected before navigating
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first. If using Phantom, make sure you have the browser extension installed, not the mobile app.",
        variant: "destructive",
      })
      return
    }
    
    switch (action) {
      case 'send':
        router.push('/defi?tab=transfer')
        break
      case 'swap':
        router.push('/defi?tab=swap')
        break
      case 'stake':
        router.push('/defi?tab=stake')
        break
      case 'defi':
        router.push('/defi')
        break
      default:
        break
    }
  }
  
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <ClientWalletButton 
          onClick={handleWalletClick}
          className="!bg-gradient-to-r !from-green-500 !to-green-600 !text-white !font-medium !px-4 !py-2 !rounded-lg hover:!from-green-600 hover:!to-green-700 !transition-all !duration-200 !border-0 !text-sm !min-w-[140px] !h-10 !flex !items-center !justify-center !gap-2 !shadow-lg"
        />
        
        {/* Quick Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-green-500/30 text-green-400 hover:bg-green-500/20 h-10 px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleQuickAction('send')} className="cursor-pointer">
              <Send className="mr-2 h-4 w-4 text-green-400" />
              Send Tokens
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAction('swap')} className="cursor-pointer">
              <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-400" />
              Swap Tokens
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAction('stake')} className="cursor-pointer">
              <Coins className="mr-2 h-4 w-4 text-yellow-400" />
              Stake Tokens
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleQuickAction('defi')} className="cursor-pointer">
              <Wallet className="mr-2 h-4 w-4 text-purple-400" />
              DeFi Hub
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
  
  return (
    <div className="flex items-center">
      <ClientWalletButton 
        onClick={handleWalletClick}
        className={
          connecting
            ? "!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white !font-medium !px-4 !py-2 !rounded-lg !transition-all !duration-200 !border-0 !text-sm !min-w-[140px] !h-10 !flex !items-center !justify-center !gap-2 !shadow-lg !opacity-75"
            : "!bg-gradient-to-r !from-amber-500 !to-yellow-500 !text-black !font-medium !px-4 !py-2 !rounded-lg hover:!from-amber-600 hover:!to-yellow-600 !transition-all !duration-200 !border-0 !text-sm !min-w-[140px] !h-10 !flex !items-center !justify-center !gap-2 !shadow-lg hover:!shadow-xl"
        }
      />
    </div>
  )
}

export default ConnectWalletButton