'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Rocket, 
  Zap, 
  TrendingUp, 
  Users, 
  Timer, 
  Gift, 
  Star, 
  Crown, 
  Target,
  ArrowRight,
  Copy,
  CheckCircle,
  Sparkles,
  DollarSign,
  Award,
  Coins,
  Activity,
  Flame,
  Clock,
  Gamepad2,
  Trophy,
  Sword,
  Shield,
  Joystick
} from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/navigation'
import ConnectWalletModal from '@/components/ConnectWalletModal'

// Dynamically import the ThreeScene component with SSR disabled
const ThreeScene = dynamic(() => import('@/components/three/ThreeScene'), { ssr: false })

interface LiveStat {
  label: string
  value: number
  displayValue: string
  icon: React.ReactNode
  color: string
  change: string
}

interface CountdownTimer {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const GOLDIUM_GAME_URL = 'https://games.goldium.io'
const CONTRACT_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'

export default function ViralHeroSection() {
  const [copied, setCopied] = useState(false)
  const [playersOnline, setPlayersOnline] = useState(127847)
  const [gamesPlayed, setGamesPlayed] = useState(8473920)
  const [tokensEarned, setTokensEarned] = useState(284739200)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()



  // Live gaming stats updates
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setPlayersOnline(prev => prev + Math.floor(Math.random() * 50) - 25)
      setGamesPlayed(prev => prev + Math.floor(Math.random() * 100))
      setTokensEarned(prev => prev + Math.floor(Math.random() * 5000))
    }, 2000)

    return () => clearInterval(statsInterval)
  }, [])

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy contract address:', err)
    }
  }

  const handlePlayNow = () => {
    if (connected) {
      // Open goldium.io game in new tab
      window.open(GOLDIUM_GAME_URL, '_blank')
    } else {
      setVisible(true)
    }
  }

  const handlePlay2D = () => {
    if (connected) {
      // Redirect to 2D games page
      router.push('/games')
    } else {
      setVisible(true)
    }
  }



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-purple-900/20 to-black matrix-bg">
      {/* Elegant Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-holographic opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-600/20 via-purple-400/20 to-slate-400/20 rounded-full blur-3xl animate-floating" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 via-amber-500/20 to-blue-500/20 rounded-full blur-3xl animate-floating" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-slate-400/15 via-purple-400/15 to-yellow-400/15 rounded-full blur-2xl animate-rotate-glow" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-gold rounded-full animate-sparkle" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full animate-sparkle" style={{animationDelay: '0.5s'}} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-sparkle" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-400 rounded-full animate-sparkle" style={{animationDelay: '1.5s'}} />
        
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {Array.from({length: 400}).map((_, i) => (
              <div key={i} className="border border-cyan-400/20 animate-cyber-pulse" style={{animationDelay: `${i * 0.01}s`}} />
            ))}
          </div>
        </div>
      </div>
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 z-10" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 z-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-30 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Gaming Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-4 py-2 text-sm font-medium">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Web3 Gaming Universe Now Live!
            </Badge>
          </motion.div>

          {/* Premium Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
              <span className="holographic-text animate-neon-glow relative z-10">
                GOLDIUM
              </span>
              <div className="absolute inset-0 holographic-text blur-xl opacity-50 animate-pulse" style={{animationDelay: '0.5s'}}>
                GOLDIUM
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-shimmer" />
            </h1>
            <motion.p 
              className="text-xl md:text-2xl premium-text mb-8 max-w-3xl mx-auto animate-floating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              The Ultimate Web3 Gaming & DeFi Ecosystem
            </motion.p>
          </motion.div>

          {/* Super Premium Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-bold holographic-text mb-2 animate-wave text-amber-200">
                {(playersOnline / 1000).toFixed(0)}K
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Players Online</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-amber-500/40 via-purple-400/40 to-slate-400/40 rounded-full animate-shimmer" />
              </div>
            </motion.div>
            
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{animationDelay: '0.5s'}}
            >
              <div className="text-4xl font-bold holographic-text mb-2 animate-wave text-amber-200">
                {(gamesPlayed / 1000000).toFixed(1)}M
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Games Played</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-purple-500/40 via-amber-500/40 to-blue-500/40 rounded-full animate-shimmer" />
              </div>
            </motion.div>
            
            <motion.div 
              className="super-premium-card rounded-xl p-6 text-center animate-floating cyber-border bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-amber-500/20"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{animationDelay: '1s'}}
            >
              <div className="text-4xl font-bold holographic-text mb-2 animate-wave text-amber-200">
                {(tokensEarned / 1000000).toFixed(0)}M
              </div>
              <div className="premium-text text-sm uppercase tracking-wider text-slate-300 opacity-70">Tokens Earned</div>
              <div className="mt-2 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-cyan-400/40 via-purple-400/40 to-amber-500/40 rounded-full animate-shimmer" />
              </div>
            </motion.div>
          </motion.div>



          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Web3 Gaming Ecosystem
                  </Badge>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    GOLDIUM
                  </span>
                  <br />
                  <span className="text-white">Web3 Gaming</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Universe
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed">
                  Experience the future of gaming and finance in one unified ecosystem. GOLDIUM combines 
                  <span className="text-green-400 font-bold">immersive 3D worlds</span>, thrilling 2D adventures, and real economic opportunities powered by the 
                  <span className="text-yellow-400 font-bold">GOLD token</span>. Own your in-game assets as NFTs, earn rewards through play-to-earn mechanics, 
                  and grow your wealth via staking, trading, and DeFi utilities.
                </p>
              </motion.div>

              {/* Gaming Features Highlight */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Gamepad2 className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Gaming Features</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">3D Adventure (games.goldium.io)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Joystick className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">2D Arcade Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-300">Play-to-Earn Rewards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300">NFT Asset Ownership</span>
                    </div>
                  </div>
                  
                  {/* Game Links */}
                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm font-medium">3D Game:</span>
                          <div className="text-blue-400 text-sm mt-1 hover:underline cursor-pointer" onClick={() => window.open(GOLDIUM_GAME_URL, '_blank')}>games.goldium.io</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(GOLDIUM_GAME_URL, '_blank')}
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Rocket className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-500/10 border border-gray-500/30 rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm font-medium">Token Contract:</span>
                          <div className="font-mono text-xs text-gray-300 mt-1 break-all">{CONTRACT_ADDRESS}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyContractAddress}
                          className="border-gray-500/30 text-gray-400 hover:bg-gray-500/20"
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Super Premium CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/60 via-purple-400/60 to-slate-400/60 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <Button
                    size="lg"
                    onClick={handlePlayNow}
                    className="relative super-premium-card text-white font-bold text-lg px-8 py-4 rounded-xl border-0 overflow-hidden bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-700/80 hover:to-amber-600/80 shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      <Sword className="w-5 h-5 mr-2 animate-sparkle" />
                      <span className="holographic-text">{connected ? 'Play 3D Game' : 'Connect & Play'}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </span>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, rotateX: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/60 via-amber-500/60 to-slate-500/60 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handlePlay2D}
                    className="relative cyber-border premium-text font-bold text-lg px-8 py-4 rounded-xl bg-transparent hover:bg-gradient-to-r hover:from-amber-500/15 hover:to-violet-500/15 transition-all duration-300 border-2 border-amber-500/30 text-white"
                  >
                    <Joystick className="w-5 h-5 mr-2 animate-sparkle" />
                    <span className="holographic-text">{connected ? '2D Games' : 'Connect for 2D'}</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Gaming Indicators */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-6 text-sm text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Play-to-Earn Enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>NFT Asset Ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-green-400" />
                  <span>Cross-Platform Gaming</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Live Gaming Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Live Gaming Stats Card */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 font-semibold">Live Gaming Stats</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {playersOnline.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Players Online</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-400">
                        {(gamesPlayed / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-400">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {(tokensEarned / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-400">Tokens Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        24/7
                      </div>
                      <div className="text-sm text-gray-400">Game Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gaming Performance */}
              <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-green-400 mb-4">Gaming Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Supply</span>
                      <span className="text-green-400 font-bold">1B GOLD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Circulating Supply</span>
                      <span className="text-green-400 font-bold">847K GOLD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Contract Address</span>
                      <span className="text-green-400 font-bold text-xs">APkBg8k...4pump</span>
                    </div>
                    <div className="border-t border-green-500/30 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Token Price</span>
                        <span className="text-green-400 font-bold text-lg">$0.0005</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game Status */}
              <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gamepad2 className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-semibold">Game Status</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    All gaming features are <span className="text-green-400 font-bold">fully operational</span>. 
                    Start playing and earning rewards in our Web3 gaming universe!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  )
}