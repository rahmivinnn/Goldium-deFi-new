"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"
import { AVAILABLE_TOKENS, PUMP_TOKEN } from "@/constants/tokens"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import { useTheme } from "@/components/providers/WalletContextProvider"
import { transferTokens } from "@/services/tokenService"

export default function TokenTransfer() {
  const { connected, publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()
  const { theme } = useTheme()
  const { balances, refreshBalances, deductBalance } = useWalletBalance()
  const isDarkTheme = theme === "dark"

  const [selectedToken, setSelectedToken] = useState('SOL')
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)

  const selectedTokenData = AVAILABLE_TOKENS.find(token => token.symbol === selectedToken) || PUMP_TOKEN
  
  // Get available tokens - only SOL and GOLD
  const availableTokens = AVAILABLE_TOKENS.filter(token => 
    token.symbol === 'SOL' || token.symbol === 'GOLD'
  )

  // Get token balance
  const tokenBalance = balances[selectedToken] || 0

  const handleTransfer = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    if (!recipientAddress) {
      toast({
        title: "Missing recipient",
        description: "Please enter a recipient address",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (Number(amount) > tokenBalance) {
      toast({
        title: "Insufficient balance",
        description: "You only have " + tokenBalance.toFixed(6) + " " + selectedToken,
        variant: "destructive",
      })
      return
    }

    try {
      setIsTransferring(true)
      
      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch {
        throw new Error("Invalid recipient address format")
      }

      let signature: string
      
      // Handle different token types
      if (selectedToken === 'SOL') {
        // For SOL transfers, simulate the transfer
        // In production, you would use SystemProgram.transfer
        signature = `sol_demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // For SOL, we update the balance directly since it's fetched from blockchain
        // In demo mode, we'll simulate by updating the balances state
        deductBalance(selectedToken, Number(amount))
      } else {
        // For token transfers (GOLD, USDC, BONK, etc.)
        // In demo mode, we'll simulate the transfer by updating localStorage
        signature = `demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Deduct balance from sender
        deductBalance(selectedToken, Number(amount))
      }

      // Create Solscan link for transaction tracking
      const solscanUrl = `https://solscan.io/tx/${signature}`
      
      toast({
        title: "Transfer successful!",
        description: (
          <div className="space-y-2">
            <p>Successfully transferred {amount} {selectedToken}</p>
            <a 
              href={solscanUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline block"
            >
              View on Solscan →
            </a>
          </div>
        ),
      })

      // Reset form
      setAmount("")
      setRecipientAddress("")

    } catch (error) {
      console.error("Transfer error:", error)
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Failed to transfer tokens",
        variant: "destructive",
      })
    } finally {
      setIsTransferring(false)
    }
  }

  const handleMaxAmount = () => {
    setAmount(tokenBalance.toString())
  }

  if (!connected) {
    return (
      <Card className={"w-full max-w-md mx-auto " + (isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
        <CardContent className="p-6 flex justify-center items-center h-64">
          <div className="flex flex-col items-center text-center">
            <p className={"text-lg font-medium mb-4 " + (isDarkTheme ? "text-gray-300" : "text-gray-700")}>
              Connect your wallet to transfer tokens
            </p>
            <p className={"text-sm " + (isDarkTheme ? "text-gray-400" : "text-gray-500")}>
              You need to connect your wallet to send tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={"w-full max-w-md mx-auto " + (isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200")}>
      <CardHeader>
        <CardTitle className={"text-center " + (isDarkTheme ? "text-white" : "text-gray-900")}>
          Transfer Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Token Selection */}
        <div className="space-y-2">
          <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Token</Label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className={isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}>
              {availableTokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol} className={isDarkTheme ? "text-white hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}>
                  <div className="flex items-center space-x-2">
                    <span>{token.symbol}</span>
                    <span className={"text-sm " + (isDarkTheme ? "text-gray-400" : "text-gray-500")}>({token.name})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-between items-center">
            <span className={"text-sm " + (isDarkTheme ? "text-gray-400" : "text-gray-500")}>Available Balance</span>
            <span className={"text-sm " + (isDarkTheme ? "text-gray-300" : "text-gray-700")}>
              {tokenBalance.toFixed(6)} {selectedToken}
            </span>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="space-y-2">
          <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Recipient Address</Label>
          <Input
            type="text"
            placeholder="Enter Solana wallet address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className={isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300"}
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label className={isDarkTheme ? "text-gray-300" : "text-gray-700"}>Amount</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                  setAmount(e.target.value)
                }
              }}
              className={(isDarkTheme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-300") + " pr-16"}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-amber-500 h-6 px-2"
              onClick={handleMaxAmount}
            >
              MAX
            </Button>
          </div>
        </div>

        {/* Transfer Button */}
        <Button
          onClick={handleTransfer}
          disabled={
            isTransferring ||
            !recipientAddress ||
            !amount ||
            Number(amount) <= 0 ||
            Number(amount) > tokenBalance
          }
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
        >
          {isTransferring ? (
            <div className="flex items-center">
              <span className="mr-2">Transferring</span>
              <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin" />
            </div>
          ) : (
            "Transfer " + selectedToken
          )}
        </Button>

        {/* Info */}
        <div className={"text-xs " + (isDarkTheme ? "text-gray-500" : "text-gray-600") + " text-center"}>
          <p>Make sure the recipient address is correct.</p>
          <p>Transactions on Solana are irreversible.</p>
        </div>
      </CardContent>
    </Card>
  )
}