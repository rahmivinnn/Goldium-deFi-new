import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token"
import type { WalletContextState } from "@solana/wallet-adapter-react"

// Network type
export type NetworkType = "mainnet-beta" | "devnet" | "testnet"

// Token mint addresses for SOL and GOLD only
export const TOKEN_MINT_ADDRESSES: Record<string, Record<NetworkType, string>> = {
  SOL: {
    "mainnet-beta": "So11111111111111111111111111111111111111112", // Native SOL
    testnet: "So11111111111111111111111111111111111111112", // Native SOL
    devnet: "So11111111111111111111111111111111111111112", // Native SOL
  },
  GOLD: {
    "mainnet-beta": "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Real GOLDIUM CA
    testnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLDIUM testnet
    devnet: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // GOLDIUM devnet
  },
}

// GOLDIUM mint address for different networks
export const GOLD_MINT_ADDRESS: Record<NetworkType, string> = TOKEN_MINT_ADDRESSES.GOLD

export const GOLD_TOKEN_METADATA = {
  name: "Goldium",
  symbol: "GOLD",
  decimals: 9, // GOLDIUM has 9 decimals
  description: "Goldium - Premium digital gold token",
  image: "/tokens/gold.png",
}

// Token metadata for all supported tokens
export const TOKEN_METADATA: Record<string, any> = {
  SOL: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    description: "Solana native token",
    image: "/solana-logo.png",
  },
  GOLD: {
    name: "Goldium",
    symbol: "GOLD",
    decimals: 9,
    description: "Goldium - Premium digital gold token",
    image: "/tokens/gold.png",
  },
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
    console.log(`🔍 Getting token balance for mint: ${mintAddress}`);
    console.log(`👤 Wallet: ${walletPublicKey.toString()}`);
    
    // Get the associated token account address
    const tokenAccount = await getAssociatedTokenAddress(
      new PublicKey(mintAddress), 
      walletPublicKey
    )
    
    console.log(`🏦 Token account address: ${tokenAccount.toString()}`);

    // Try to get the token account using getAccount from @solana/spl-token
    try {
      const account = await getAccount(connection, tokenAccount)
      
      // Get the mint info to determine decimals
      const mintInfo = await getMint(connection, new PublicKey(mintAddress))
      const balance = Number(account.amount) / Math.pow(10, mintInfo.decimals)
      
      console.log(`✅ Token balance found: ${balance} (raw: ${account.amount}, decimals: ${mintInfo.decimals})`);
      return balance
    } catch (accountError) {
      console.log(`ℹ️ Token account doesn't exist for ${mintAddress}, balance is 0`);
      // Token account doesn't exist, which means balance is 0
      return 0
    }
  } catch (error) {
    console.error(`❌ Error getting token balance for ${mintAddress}:`, error)
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

    // Validate inputs
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0")
    }

    const mint = new PublicKey(mintAddress)
    
    // Get mint info to verify decimals and validate token
    let mintInfo
    try {
      mintInfo = await getMint(connection, mint)
    } catch (error) {
      throw new Error("Invalid token mint address or token does not exist")
    }
    
    // Use actual decimals from mint info
    const actualDecimals = mintInfo.decimals
    
    // Get sender's associated token account
    const senderTokenAccount = await getAssociatedTokenAddress(mint, wallet.publicKey)
    
    // Get recipient's associated token account
    const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipient)
    
    // Check if sender has the token account and sufficient balance
    const senderAccountInfo = await connection.getAccountInfo(senderTokenAccount)
    if (!senderAccountInfo) {
      throw new Error("You don't have a token account for this token. Please ensure you have some tokens first.")
    }
    
    // Get sender's token balance
    const senderBalance = await connection.getTokenAccountBalance(senderTokenAccount)
    const senderBalanceAmount = parseFloat(senderBalance.value.amount) / Math.pow(10, actualDecimals)
    
    if (senderBalanceAmount < amount) {
      throw new Error(`Insufficient balance. You have ${senderBalanceAmount.toFixed(actualDecimals)} tokens, but trying to send ${amount}`)
    }
    
    // Create transaction
    const transaction = new Transaction()
    
    // Check if recipient token account exists, if not create it
    const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAccount)
    if (!recipientAccountInfo) {
      console.log("Creating associated token account for recipient...")
      transaction.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          recipientTokenAccount, // ata
          recipient, // owner
          mint // mint
        )
      )
    }
    
    // Calculate transfer amount with proper decimals
    const transferAmount = Math.floor(amount * Math.pow(10, actualDecimals))
    
    // Add transfer instruction
    transaction.add(
      createTransferInstruction(
        senderTokenAccount, // from
        recipientTokenAccount, // to
        wallet.publicKey, // owner
        transferAmount // amount
      )
    )
    
    // Get recent blockhash with commitment level
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey
    
    console.log("Signing transaction...")
    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction)
    
    console.log("Sending transaction...")
    // Send transaction with proper options
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      }
    )
    
    console.log("Transaction sent, signature:", signature)
    console.log("Confirming transaction...")
    
    // Confirm transaction with timeout
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight
      },
      'confirmed'
    )
    
    if (confirmation.value.err) {
      throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`)
    }
    
    console.log("Transaction confirmed successfully")
    return signature
    
  } catch (error) {
    console.error("Error transferring tokens:", error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        throw new Error("Insufficient SOL for transaction fees. Please ensure you have at least 0.01 SOL for fees.")
      }
      if (error.message.includes('Invalid public key')) {
        throw new Error("Invalid recipient address format")
      }
      if (error.message.includes('failed to send transaction')) {
        throw new Error("Network error. Please check your connection and try again.")
      }
      throw error
    }
    
    throw new Error("An unexpected error occurred during the transfer")
  }
}

// Enhanced function specifically for GOLD token transfers
export async function transferGoldToken(
  connection: Connection,
  wallet: WalletContextState,
  recipientAddress: string,
  amount: number
): Promise<string> {
  try {
    // Validate recipient address
    let recipient: PublicKey
    try {
      recipient = new PublicKey(recipientAddress)
    } catch {
      throw new Error("Invalid recipient address format")
    }
    
    // Use the GOLD token mint address from constants
    const GOLD_MINT = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"
    
    return await transferTokens(
      connection,
      wallet,
      GOLD_MINT,
      recipient,
      amount,
      9 // GOLD token has 9 decimals
    )
  } catch (error) {
    console.error("Error transferring GOLD tokens:", error)
    throw error
  }
}

// Enhanced SOL transfer function
export async function transferSOL(
  connection: Connection,
  wallet: WalletContextState,
  recipientAddress: string,
  amount: number
): Promise<string> {
  try {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Wallet not connected")
    }

    if (amount <= 0) {
      throw new Error("Amount must be greater than 0")
    }

    // Validate recipient address
    let recipient: PublicKey
    try {
      recipient = new PublicKey(recipientAddress)
    } catch {
      throw new Error("Invalid recipient address format")
    }

    // Check sender's SOL balance
    const balance = await connection.getBalance(wallet.publicKey)
    const balanceInSOL = balance / LAMPORTS_PER_SOL
    const totalNeeded = amount + 0.000005 // Add transaction fee

    if (balanceInSOL < totalNeeded) {
      throw new Error(`Insufficient SOL balance. You have ${balanceInSOL.toFixed(6)} SOL, but need ${totalNeeded.toFixed(6)} SOL (including fees)`)
    }

    // Create transfer transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipient,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      })
    )

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
    transaction.recentBlockhash = blockhash
    transaction.feePayer = wallet.publicKey

    console.log("Signing SOL transfer transaction...")
    // Sign transaction
    const signedTransaction = await wallet.signTransaction(transaction)

    console.log("Sending SOL transfer transaction...")
    // Send transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      }
    )

    console.log("SOL transfer sent, signature:", signature)
    console.log("Confirming SOL transfer...")

    // Confirm transaction
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight
      },
      'confirmed'
    )

    if (confirmation.value.err) {
      throw new Error(`SOL transfer failed: ${confirmation.value.err.toString()}`)
    }

    console.log("SOL transfer confirmed successfully")
    return signature

  } catch (error) {
    console.error("Error transferring SOL:", error)
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

// Get token supply for any supported token
export async function getTokenSupply(connection: Connection, tokenSymbol: string = "GOLD", network: NetworkType = "mainnet-beta"): Promise<number> {
  try {
    const mintAddress = TOKEN_MINT_ADDRESSES[tokenSymbol]?.[network]
    if (!mintAddress) {
      throw new Error(`Token ${tokenSymbol} not found for network ${network}`)
    }

    const mintPublicKey = new PublicKey(mintAddress)
    const mintInfo = await getMint(connection, mintPublicKey)
    
    // Convert to human readable format
    const decimals = TOKEN_METADATA[tokenSymbol]?.decimals || 9
    const supply = Number(mintInfo.supply) / Math.pow(10, decimals)
    
    return supply
  } catch (error) {
    console.error(`Error getting ${tokenSymbol} supply:`, error)
    return 0
  }
}

// Legacy function for backward compatibility
export async function getGoldTokenSupply(connection: Connection, network: NetworkType = "mainnet-beta"): Promise<number> {
  return getTokenSupply(connection, "GOLD", network)
}
