"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { clusterApiUrl, Connection } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

export type NetworkType = "devnet" | "testnet" | "mainnet-beta"

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  connection: Connection
  endpoint: string
  walletAdapterNetwork: WalletAdapterNetwork
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkContextProvider")
  }
  return context
}

interface NetworkContextProviderProps {
  children: ReactNode
}

export function NetworkContextProvider({ children }: NetworkContextProviderProps) {
  const [network, setNetwork] = useState<NetworkType>("mainnet-beta")
  const { toast } = useToast()

  // Convert network type to WalletAdapterNetwork
  const walletAdapterNetwork =
    network === "mainnet-beta"
      ? WalletAdapterNetwork.Mainnet
      : network === "testnet"
        ? WalletAdapterNetwork.Testnet
        : WalletAdapterNetwork.Devnet

  // Get endpoint URL for the selected network with reliable RPC endpoints
  const getEndpoint = (network: NetworkType) => {
    switch (network) {
      case "mainnet-beta":
        // Use official Solana RPC endpoint for real transactions
        return "https://api.mainnet-beta.solana.com"
      case "testnet":
        return clusterApiUrl(WalletAdapterNetwork.Testnet)
      case "devnet":
        return clusterApiUrl(WalletAdapterNetwork.Devnet)
      default:
        return "https://api.mainnet-beta.solana.com"
    }
  }

  const endpoint = getEndpoint(network)

  // Create connection to the Solana cluster with better configuration
  const connection = new Connection(endpoint, {
    commitment: "confirmed",
    confirmTransactionInitialTimeout: 60000,
    disableRetryOnRateLimit: false,
  })

  // Handle network change
  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork)

    toast({
      title: "Network Changed",
      description: `Switched to ${newNetwork}`,
      variant: "default",
    })

    // Reload the page to ensure all components update properly
    // In a production app, you might want to handle this more gracefully
    window.location.reload()
  }

  // Expose the network context
  const value = {
    network,
    setNetwork: handleNetworkChange,
    connection,
    endpoint,
    walletAdapterNetwork,
  }

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}
