'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Activity, 
  Globe, 
  Star,
  Award,
  Target,
  Coins
} from 'lucide-react'

interface LiveStat {
  id: string
  label: string
  value: number
  displayValue: string
  change: number
  changePercent: number
  icon: React.ReactNode
  color: string
  gradient: string
  prefix?: string
  suffix?: string
  trend: 'up' | 'down' | 'stable'
}

export default function LiveStatsSection() {
  const [stats, setStats] = useState<LiveStat[]>([
    {
      id: 'tvl',
      label: 'Total Value Locked',
      value: 2850000000,
      displayValue: '$2.85B',
      change: 128470000,
      changePercent: 4.7,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-400',
      gradient: 'from-green-400 to-emerald-500',
      prefix: '$',
      trend: 'up'
    },
    {
      id: 'users',
      label: 'Active Users',
      value: 1284700,
      displayValue: '1.28M',
      change: 24700,
      changePercent: 1.9,
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-500',
      trend: 'up'
    },
    {
      id: 'rewards',
      label: 'Rewards Claimed',
      value: 847392000,
      displayValue: '847M',
      change: 28470000,
      changePercent: 3.4,
      icon: <Award className="w-6 h-6" />,
      color: 'text-yellow-400',
      gradient: 'from-yellow-400 to-orange-500',
      suffix: ' GOLD',
      trend: 'up'
    },
    {
      id: 'apy',
      label: 'Average APY',
      value: 2847.5,
      displayValue: '2,847.5%',
      change: 23.7,
      changePercent: 1.6,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple-400',
      gradient: 'from-purple-400 to-pink-500',
      suffix: '%',
      trend: 'up'
    },
    {
      id: 'transactions',
      label: '24h Transactions',
      value: 4589200,
      displayValue: '4.59M',
      change: 124700,
      changePercent: 2.8,
      icon: <Activity className="w-6 h-6" />,
      color: 'text-cyan-400',
      gradient: 'from-cyan-400 to-blue-500',
      trend: 'up'
    },
    {
      id: 'staked',
      label: 'Total Staked',
      value: 950000,
      displayValue: '950K',
      change: 8472,
      changePercent: 6.8,
      icon: <Coins className="w-6 h-6" />,
      color: 'text-orange-400',
      gradient: 'from-orange-400 to-red-500',
      suffix: ' GOLD',
      trend: 'up'
    }
  ])

  const [recentActivities, setRecentActivities] = useState([
    { user: '0x7a2f...8b4c', action: 'Staked 1,500 GOLD', reward: '+75 GOLD', time: '2s ago' },
    { user: '0x9e1d...3f7a', action: 'Claimed rewards', reward: '+247 GOLD', time: '5s ago' },
    { user: '0x4c8b...9e2d', action: 'Joined platform', reward: '+100 GOLD', time: '8s ago' },
    { user: '0x1f5a...7c9e', action: 'Swapped 0.5 SOL', reward: '+12 GOLD', time: '12s ago' },
    { user: '0x8d3c...4a1f', action: 'Added liquidity', reward: '+89 GOLD', time: '15s ago' }
  ])

  // Update stats in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const randomChange = (Math.random() - 0.5) * 0.02 // ±1% change
          const newValue = Math.max(0, stat.value * (1 + randomChange))
          const change = newValue - stat.value
          const changePercent = stat.value !== 0 ? (change / stat.value) * 100 : 0
          
          let displayValue = ''
          if (stat.id === 'apy') {
            displayValue = `${newValue.toFixed(1)}%`
          } else if (newValue >= 1000000) {
            displayValue = `${(newValue / 1000000).toFixed(2)}M`
          } else if (newValue >= 1000) {
            displayValue = `${(newValue / 1000).toFixed(1)}K`
          } else {
            displayValue = newValue.toFixed(0)
          }
          
          return {
            ...stat,
            value: newValue,
            displayValue: stat.prefix ? `${stat.prefix}${displayValue}` : displayValue,
            change,
            changePercent,
            trend: Math.abs(changePercent) < 0.1 ? 'stable' : changePercent > 0 ? 'up' : 'down'
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update recent activities
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const newActivities = [
        { user: '0x7a2f...8b4c', action: 'Staked 1,500 GOLD', reward: '+75 GOLD', time: '2s ago' },
        { user: '0x9e1d...3f7a', action: 'Claimed rewards', reward: '+247 GOLD', time: '5s ago' },
        { user: '0x4c8b...9e2d', action: 'Joined platform', reward: '+100 GOLD', time: '8s ago' },
        { user: '0x1f5a...7c9e', action: 'Swapped 0.5 SOL', reward: '+12 GOLD', time: '12s ago' },
        { user: '0x8d3c...4a1f', action: 'Added liquidity', reward: '+89 GOLD', time: '15s ago' }
      ]
      
      // Randomly update one activity
      const randomIndex = Math.floor(Math.random() * newActivities.length)
      const actions = ['Staked', 'Claimed rewards', 'Swapped', 'Added liquidity', 'Joined platform']
      const rewards = ['+75 GOLD', '+247 GOLD', '+500 GOLD', '+12 GOLD', '+89 GOLD', '+156 GOLD', '+324 GOLD']
      
      newActivities[randomIndex] = {
        user: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        reward: rewards[Math.floor(Math.random() * rewards.length)],
        time: 'Just now'
      }
      
      setRecentActivities(newActivities)
    }, 5000)

    return () => clearInterval(activityInterval)
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black via-purple-900/10 to-black relative overflow-hidden">
      {/* Elegant Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-600/3 via-transparent to-violet-600/3 animate-holographic" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-slate-400/6 to-purple-400/6 rounded-full blur-3xl animate-floating" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/6 to-amber-500/6 rounded-full blur-3xl animate-floating" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            <Activity className="w-4 h-4 mr-2" />
            Live Data
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 relative">
            <span className="holographic-text animate-neon-glow">
              Real-Time Platform
            </span>
            <br />
            <span className="holographic-text animate-neon-glow">
              Statistics
            </span>
            <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-gold/20 to-transparent animate-shimmer" />
          </h2>
          <motion.p 
            className="text-xl premium-text max-w-2xl mx-auto animate-floating"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Watch our ecosystem grow in real-time. Join thousands of users earning rewards every second.
          </motion.p>
        </motion.div>

        {/* Super Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
              className="relative group perspective-1000"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/40 via-purple-400/40 to-slate-400/40 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
              
              {/* Card */}
              <Card className={`relative super-premium-card backdrop-blur-xl border cyber-border bg-gradient-to-br ${stat.gradient}/10 border-${stat.color.split('-')[1]}-500/30 overflow-hidden`}>
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-violet-900/15 to-slate-900/90 animate-holographic" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent animate-shimmer" />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div 
                      className={`p-3 bg-gradient-to-r ${stat.gradient}/30 rounded-lg backdrop-blur-sm animate-rotate-glow`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`${stat.color} animate-sparkle`}>
                        {stat.icon}
                      </div>
                    </motion.div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm premium-text font-medium animate-floating">{stat.label}</h3>
                    <motion.div 
                      className={`text-3xl font-bold holographic-text animate-neon-glow ${stat.color}`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    >
                      {stat.displayValue}
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-400' : 
                        stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : stat.trend === 'down' ? (
                          <TrendingUp className="w-4 h-4 rotate-180" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                        <span>+{Math.abs(stat.changePercent).toFixed(1)}%</span>
                      </div>
                      <span className="text-xs text-gray-500">24h</span>
                    </div>
                  </div>
                </CardContent>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-400">Live Activity Feed</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-2" />
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-300">{activity.user}</span>
                          <span className="text-gray-400">{activity.action}</span>
                        </div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                    <div className="text-green-400 font-semibold">
                      {activity.reward}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Zap className="w-4 h-4 mr-2" />
                  {formatNumber(stats[1].value)} users earning rewards right now
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}