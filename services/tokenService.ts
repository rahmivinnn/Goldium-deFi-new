import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getMint,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token"
import type { WalletContextState } from "@solana/wallet-adapter-react"

// Network type
export type NetworkType = "mainnet-beta" | "devnet" | "testnet"

// GOLD token mint addresses for different networks
export const GOLD_MINT_ADDRESS = {
  "mainnet-beta": "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on mainnet
  devnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on devnet
  testnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLD token on testnet
}

// GOLD token metadata
export const GOLD_TOKEN_METADATA = {
  name: "Goldium",
  symbol: "GOLD",
  decimals: 6, // Updated to match the actual token decimals
  totalSupply: 1_000_000, // 1 million tokens
}

// Function to validate and verify token mint address
export async function validateTokenMint(
  connection: Connection,
  mintAddress: string
): Promise<{ isValid: boolean; mintInfo?: any; error?: string }> {
  try {
    const mintPublicKey = new PublicKey(mintAddress)
    
    // Check if the mint address is valid
    const mintInfo = await getMint(connection, mintPublicKey)
    
    return {
      isValid: true,
      mintInfo: {
        address: mintAddress,
        decimals: mintInfo.decimals,
        supply: mintInfo.supply.toString(),
        mintAuthority: mintInfo.mintAuthority?.toString(),
        freezeAuthority: mintInfo.freezeAuthority?.toString(),
        isInitialized: mintInfo.isInitialized
      }
    }
  } catch (error) {
    console.error("Token validation error:", error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown validation error"
    }
  }
}

// Function to check if token is detectable and has activity
export async function checkTokenActivity(
  connection: Connection,
  mintAddress: string
): Promise<{ hasActivity: boolean; holders?: number; error?: string }> {
  try {
    const mintPublicKey = new PublicKey(mintAddress)
    
    // Get token accounts for this mint
    const tokenAccounts = await connection.getTokenAccountsByMint(mintPublicKey)
    
    return {
      hasActivity: tokenAccounts.value.length > 0,
      holders: tokenAccounts.value.length
    }
  } catch (error) {
    console.error("Token activity check error:", error)
    return {
      hasActivity: false,
      error: error instanceof Error ? error.message : "Unknown activity check error"
    }
  }
}

// Mint GOLD tokens (for testing/faucet purposes)
export async function mintGoldTokens(
  connection: Connection,
  wallet: WalletContextState,
  amount: number,
  network: NetworkType = "testnet",
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    // In a real implementation, this would interact with a token mint authority
    // For testing purposes, we'll simulate the minting process

    // Create a mock transaction signature
    const mockSignature = `mock_mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return mockSignature
  } catch (error) {
    console.error("Error minting GOLD tokens:", error)
    throw error
  }
}

// Burn GOLD tokens
export async function burnGoldTokens(
  connection: Connection,
  wallet: WalletContextState,
  amount: number,
  network: NetworkType = "testnet",
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    // In a real implementation, this would create a burn transaction
    // For testing purposes, we'll simulate the burning process

    // Create a mock transaction signature
    const mockSignature = `mock_burn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return mockSignature
  } catch (error) {
    console.error("Error burning GOLD tokens:", error)
    throw error
  }
}

// Get token balance for any token
export async function getTokenBalance(
  connection: Connection,
  walletPublicKey: PublicKey,
  mintAddress: string,
): Promise<number> {
  try {
    // Get the associated token account
    const tokenAccount = await getAssociatedTokenAddress(new PublicKey(mintAddress), walletPublicKey)

    // Get the token account info
    try {
      const tokenAccountInfo = await connection.getAccountInfo(tokenAccount)

      if (!tokenAccountInfo) {
        return 0
      }

      // Parse the token account data
      const accountData = tokenAccountInfo.data
      if (accountData.length < 64) {
        return 0
      }

      // Extract the amount (8 bytes starting at offset 64)
      const amountBytes = accountData.slice(64, 72)
      const amount = Buffer.from(amountBytes).readBigUInt64LE()

      // Get the mint info to determine decimals
      const mintInfo = await getMint(connection, new PublicKey(mintAddress))
      const balance = Number(amount) / Math.pow(10, mintInfo.decimals)

      return balance
    } catch (accountError) {
      // Token account doesn't exist
      return 0
    }
  } catch (error) {
    console.error("Error getting token balance:", error)
    return 0
  }
}

// Get SOL balance
export async function getSolBalance(connection: Connection, walletPublicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(walletPublicKey)
    return balance / 1e9 // Convert lamports to SOL
  } catch (error) {
    console.error("Error getting SOL balance:", error)
    return 0
  }
}

// Create token account if it doesn't exist
export async function createTokenAccountIfNeeded(
  connection: Connection,
  wallet: WalletContextState,
  mintAddress: string,
  owner: PublicKey,
): Promise<PublicKey> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    const mint = new PublicKey(mintAddress)
    const tokenAccount = await getAssociatedTokenAddress(mint, owner)

    // Check if the account already exists
    const accountInfo = await connection.getAccountInfo(tokenAccount)
    if (accountInfo) {
      return tokenAccount
    }

    // Create the associated token account
    const transaction = new Transaction().add(
      createAssociatedTokenAccountInstruction(wallet.publicKey, tokenAccount, owner, mint),
    )

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    // Sign and send transaction
    const signedTransaction = await wallet.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    // Confirm transaction
    await connection.confirmTransaction(signature)

    return tokenAccount
  } catch (error) {
    console.error("Error creating token account:", error)
    throw error
  }
}

// Generic token transfer function
export async function transferTokens(
  connection: Connection,
  wallet: WalletContextState,
  mintAddress: string,
  recipient: PublicKey,
  amount: number,
  decimals: number = 9,
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    const mint = new PublicKey(mintAddress)
    
    // Get or create sender's token account
    const senderTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey)
    
    // Get or create recipient's token account
    const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipient)
    
    // Check if sender has the token account
    const senderAccountInfo = await connection.getAccountInfo(senderTokenAccount)
    if (!senderAccountInfo) {
      throw new Error("You don't have a token account for this token")
    }
    
    // Create transaction
    const transaction = new Transaction()
    
    // Check if recipient token account exists, if not create it
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount)
    if (!recipientAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          recipientTokenAccount, // ata
          recipient, // owner
          mint // mint
        )
      )
    }
    
    // Add transfer instruction
    const transferAmount = Math.floor(amount * Math.pow(10, decimals))
    transaction.add(
      createTransferInstruction(
        senderTokenAccount, // from
        recipientTokenAccount, // to
        wallet.publicKey, // owner
        transferAmount // amount
      )
    )
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey
    
    // Sign and send transaction
    const signedTransaction = await wallet.signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    
    // Confirm transaction
    await connection.confirmTransaction(signature)
    
    return signature
  } catch (error) {
    console.error("Error transferring tokens:", error)
    throw error
  }
}

// Transfer GOLD tokens (legacy function for backward compatibility)
export async function transferGoldTokens(
  connection: Connection,
  wallet: WalletContextState,
  recipient: PublicKey,
  amount: number,
  network: NetworkType = "testnet",
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    // Get the mint
    const mintPublicKey = new PublicKey(GOLD_MINT_ADDRESS[network])

    // Get the sender's token account
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions!,
      },
      mintPublicKey,
      wallet.publicKey,
    )

    // Get or create the recipient's token account
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions!,
      },
      mintPublicKey,
      recipient,
    )

    // Transfer tokens
    const signature = await transfer(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions!,
      },
      senderTokenAccount.address,
      recipientTokenAccount.address,
      wallet.publicKey,
      amount * Math.pow(10, GOLD_TOKEN_METADATA.decimals),
    )

    return signature
  } catch (error) {
    console.error("Error transferring GOLD tokens:", error)
    throw error
  }
}

// Get token supply
export async function getGoldTokenSupply(connection: Connection, network: NetworkType = "testnet"): Promise<number> {
  try {
    const mintPublicKey = new PublicKey(GOLD_MINT_ADDRESS[network])
    const mintInfo = await getMint(connection, mintPublicKey)

    // Update any references to token supply or distribution to reflect 1M total supply
    return Number(mintInfo.supply) / Math.pow(10, GOLD_TOKEN_METADATA.decimals)
  } catch (error) {
    console.error("Error getting GOLD token supply:", error)
    return 0
  }
}
