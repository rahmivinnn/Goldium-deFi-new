"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { useNetwork } from "@/components/providers/NetworkContextProvider"
import { TOKEN_MINT_ADDRESSES, TOKEN_METADATA } from "@/services/tokenService"
import { GOLD_TOKEN } from "@/constants/tokens"
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

    // Remove testing code - now fetching real balances from blockchain

    setIsLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching balances for wallet:", publicKey.toString())
      console.log("🌐 Connection endpoint:", connection.rpcEndpoint)
      
      // Fetch SOL balance with retry logic
      let solBalanceValue = 0
      try {
        console.log("📡 Calling connection.getBalance()...")
        console.log("🔗 Using endpoint:", connection.rpcEndpoint)
        console.log("🏦 Wallet address:", publicKey.toString())
        
        // Test connection first
        const slot = await connection.getSlot()
        console.log("📊 Current slot:", slot)
        
        const balanceInLamports = await connection.getBalance(publicKey)
        console.log("💰 Raw balance in lamports:", balanceInLamports)
        console.log("💰 Balance type:", typeof balanceInLamports)
        console.log("💰 Balance is number:", typeof balanceInLamports === 'number')
        console.log("💰 Balance is bigint:", typeof balanceInLamports === 'bigint')
        
        // Handle both number and bigint types
        const lamportsValue = typeof balanceInLamports === 'bigint' ? Number(balanceInLamports) : balanceInLamports
        console.log("💰 Converted lamports value:", lamportsValue)
        
        // Convert lamports to SOL using LAMPORTS_PER_SOL constant
        solBalanceValue = lamportsValue / LAMPORTS_PER_SOL
        setSolBalance(solBalanceValue)
        console.log("✅ SOL Balance converted:", solBalanceValue, "SOL")
        console.log("🔢 LAMPORTS_PER_SOL:", LAMPORTS_PER_SOL)
        console.log("🧮 Calculation:", lamportsValue, "/", LAMPORTS_PER_SOL, "=", solBalanceValue)
        
        if (solBalanceValue === 0) {
          console.log("⚠️ Balance is 0 - this might be normal for a new wallet or you might be on the wrong network")
          console.log("🌐 Current network:", network)
          console.log("💡 If you're testing, try switching to devnet and using the faucet")
        }
      } catch (solError) {
        console.error("❌ Failed to fetch SOL balance:", solError)
        console.error("Error details:", {
          message: solError.message,
          code: solError.code,
          stack: solError.stack,
          endpoint: connection.rpcEndpoint,
          network: network
        })
        setSolBalance(0)
        solBalanceValue = 0
        
        // Show user-friendly error
        toast({
          title: "Error fetching SOL balance",
          description: `Failed to get balance from ${network}. Please check your connection.`,
          variant: "destructive",
        })
      }

      // Get balances for all supported tokens from blockchain
      const tokenBalances: Record<string, number> = { SOL: solBalanceValue }
      
      // Fetch real token balances for supported tokens
      for (const [tokenSymbol, addresses] of Object.entries(TOKEN_MINT_ADDRESSES)) {
        try {
          const mintAddress = addresses[network as keyof typeof addresses]
          if (mintAddress) {
            const balance = await getTokenBalance(connection, publicKey, mintAddress)
            tokenBalances[tokenSymbol] = balance
            console.log(`${tokenSymbol} Balance from blockchain:`, balance)
          }
        } catch (error) {
          console.warn(`Error fetching ${tokenSymbol} balance:`, error)
          tokenBalances[tokenSymbol] = 0
        }
      }

      // Set token balances
      const newBalances: Record<string, number> = tokenBalances

      console.log("Final balances object:", newBalances)
      setBalances(newBalances)
      setIsLoading(false)
    } catch (err: any) {
      console.error("Failed to fetch balances", err)
      setError(err.message || "Failed to fetch balances")
      setIsLoading(false)

      toast({
        title: "Error fetching balances",
        description: "Failed to fetch balances from blockchain. Please check your connection and network.",
        variant: "destructive",
      })

      // Set zero balances on error
      const zeroBalances: Record<string, number> = { SOL: 0 }
      
      // Add zero balances for all supported tokens
      for (const tokenSymbol of Object.keys(TOKEN_MINT_ADDRESSES)) {
        zeroBalances[tokenSymbol] = 0
      }
      
      setBalances(zeroBalances)
      setSolBalance(0)
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

  // Function to request SOL airdrop for testing (devnet/testnet only)
  const requestAirdrop = useCallback(async (amount: number = 1) => {
    if (!publicKey || !connected || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return false
    }

    if (network === "mainnet-beta") {
      toast({
        title: "Airdrop not available",
        description: "Airdrop is only available on devnet and testnet",
        variant: "destructive",
      })
      return false
    }

    try {
      setIsLoading(true)
      console.log(`🪂 Requesting ${amount} SOL airdrop for ${publicKey.toString()}`)
      
      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      )
      
      console.log(`✅ Airdrop signature: ${signature}`)
      
      // Wait for confirmation
      await connection.confirmTransaction(signature)
      
      toast({
        title: "Airdrop successful!",
        description: `Received ${amount} SOL`,
      })
      
      // Refresh balances after airdrop
      await refreshBalances()
      
      return true
    } catch (error) {
      console.error("Airdrop failed:", error)
      toast({
        title: "Airdrop failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connected, connection, network, toast, refreshBalances])

  return {
    solBalance, // Return actual value (undefined when not loaded, number when loaded)
    goldBalance: balances[GOLD_TOKEN.symbol] ?? 0, // Legacy support
    balances, // New balances object
    isLoading,
    error,
    refreshBalances,
    updateTokenBalance,
    deductBalance,
    requestAirdrop, // New airdrop function
  }
}

export default useWalletBalance
