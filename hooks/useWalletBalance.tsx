"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { useNetwork } from "@/components/providers/NetworkContextProvider"
import { GOLD_TOKEN, USDC_TOKEN, BONK_TOKEN } from "@/constants/tokens"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token"

export function useWalletBalance() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const { network } = useNetwork()
  const { toast } = useToast()

  // Initialize with null to indicate "not loaded yet" state
  const [solBalance, setSolBalance] = useState<number | undefined>(undefined)
  const [balances, setBalances] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshBalances = useCallback(async () => {
    console.log("🔄 refreshBalances called")
    console.log("📊 Wallet status:", { 
      publicKey: publicKey?.toString(), 
      connected, 
      hasConnection: !!connection,
      network,
      endpoint: connection?.rpcEndpoint
    })
    
    if (!publicKey || !connected || !connection) {
      console.log("⚠️ Missing requirements for balance fetch:", {
        publicKey: !!publicKey,
        connected,
        connection: !!connection
      })
      // Reset balances when disconnected
      setSolBalance(undefined)
      setBalances({})
      return
    }

    // TEMPORARY: Set a test balance to verify the UI is working
    console.log("🧪 TESTING: Setting temporary balance for debugging")
    setSolBalance(1.5) // Test with 1.5 SOL
    setBalances({
      [GOLD_TOKEN.symbol]: 100,
      SOL: 1.5,
    })
    console.log("🧪 Test balances set - SOL: 1.5, GOLD: 100")
    return // Early return for testing

    setIsLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching balances for wallet:", publicKey.toString())
      console.log("🌐 Connection endpoint:", connection.rpcEndpoint)
      
      // Fetch SOL balance with retry logic
      let solBalanceValue = 0
      try {
        console.log("📡 Calling connection.getBalance()...")
        const balanceInLamports = await connection.getBalance(publicKey)
        console.log("💰 Raw balance in lamports:", balanceInLamports)
        
        // Convert lamports to SOL using LAMPORTS_PER_SOL constant
        solBalanceValue = balanceInLamports / LAMPORTS_PER_SOL
        setSolBalance(solBalanceValue)
        console.log("✅ SOL Balance converted:", solBalanceValue, "SOL")
        console.log("🔢 LAMPORTS_PER_SOL:", LAMPORTS_PER_SOL)
      } catch (solError) {
        console.error("❌ Failed to fetch SOL balance:", solError)
        console.error("Error details:", {
          message: solError.message,
          code: solError.code,
          stack: solError.stack
        })
        setSolBalance(0)
        solBalanceValue = 0
      }

      // Get GOLD balance from blockchain (real token account)
       let goldBalance = 0
       try {
         const goldMintPublicKey = new PublicKey(GOLD_TOKEN.mint)
         const goldTokenAccount = await getAssociatedTokenAddress(
           goldMintPublicKey,
           publicKey
         )
         
         try {
           const goldAccountInfo = await getAccount(connection, goldTokenAccount)
           goldBalance = Number(goldAccountInfo.amount) / Math.pow(10, GOLD_TOKEN.decimals)
           console.log("GOLD Balance from blockchain:", goldBalance)
         } catch (accountError) {
           // Token account doesn't exist, balance is 0
           console.log("GOLD token account not found, balance is 0")
           goldBalance = 0
         }
       } catch (error) {
         console.warn("Error fetching GOLD balance, using 0:", error)
         goldBalance = 0
       }

      // Set token balances (only SOL and GOLD)
      const newBalances: Record<string, number> = {
        [GOLD_TOKEN.symbol]: goldBalance,
        SOL: solBalanceValue,
      }

      console.log("Final balances object:", newBalances)
      setBalances(newBalances)
      setIsLoading(false)
    } catch (err: any) {
      console.error("Failed to fetch balances", err)
      setError(err.message || "Failed to fetch balances")
      setIsLoading(false)

      toast({
        title: "Error fetching balances",
        description: err.message || "Failed to fetch wallet balances",
        variant: "destructive",
      })

      // Set default values on error (all balances are 0 for real blockchain)
      setSolBalance(0)
      setBalances({
        [GOLD_TOKEN.symbol]: 0,
        SOL: 0,
      })
    }
  }, [connection, publicKey, connected, toast])

  // Fetch balances when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalances()
    } else {
      // Reset balances when disconnected
      setSolBalance(undefined)
      setBalances({})
    }
  }, [connected, publicKey, refreshBalances])

  // Real-time balance updates - refresh every 10 seconds
  useEffect(() => {
    if (!connected || !publicKey) return

    const interval = setInterval(() => {
      refreshBalances()
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [connected, publicKey, refreshBalances])

  // Function to update balance after transfer
  const updateTokenBalance = useCallback((tokenSymbol: string, newBalance: number) => {
    if (!publicKey) return

    // For real blockchain transactions, we should refetch the balance
    // instead of manually updating it, as the balance will be updated
    // by the actual blockchain transaction
    if (tokenSymbol === GOLD_TOKEN.symbol || tokenSymbol === 'SOL') {
      // Trigger a balance refresh after transaction
      refreshBalances()
    } else {
      // Update state for other tokens (if any)
      setBalances(prev => ({
        ...prev,
        [tokenSymbol]: newBalance
      }))
    }
  }, [publicKey, refreshBalances])

  // Function to deduct balance after successful transfer
  const deductBalance = useCallback((tokenSymbol: string, amount: number) => {
    if (!publicKey) return
    
    const currentBalance = balances[tokenSymbol] || 0
    const newBalance = Math.max(0, currentBalance - amount)
    updateTokenBalance(tokenSymbol, newBalance)
  }, [publicKey, balances, updateTokenBalance])

  return {
    solBalance: solBalance ?? 0, // Provide default value of 0 if undefined
    goldBalance: balances[GOLD_TOKEN.symbol] ?? 0, // Legacy support
    balances, // New balances object
    isLoading,
    error,
    refreshBalances,
    updateTokenBalance,
    deductBalance,
  }
}

export default useWalletBalance
