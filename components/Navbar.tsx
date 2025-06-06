"use client"

import React, { useState, useEffect, useRef, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
// import DeFiMenu from "@/components/DeFiMenu" // Removed dropdown, using direct link
import ConnectWalletButton from "@/components/ConnectWalletButton"
import NetworkBadge from "@/components/NetworkBadge"
import { safeAddScrollListener, isBrowser } from "@/utils/browser"
import "@/styles/navbar-performance.css"

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    // Set mounted ref
    isMounted.current = true

    // Only run on client side
    if (!isBrowser) return

    // Add scroll listener safely
    const cleanup = safeAddScrollListener((newScrollY) => {
      if (isMounted.current) {
        setIsScrolled(newScrollY > 10)
      }
    })

    // Clean up
    return () => {
      isMounted.current = false
      cleanup()
    }
  }, [])

  // Memoize navItems to prevent unnecessary re-renders
  const navItems = React.useMemo(() => [
    { name: "Home", href: "/" },
  
    { name: "Trading", href: "/trading" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "DeFi", href: "/defi" },
    { name: "Governance", href: "/governance" },
    { name: "Transactions", href: "/transactions" },
    { name: "Avatar", href: "/avatar" },
    { name: "Contracts", href: "/contracts" },
  ], [])

  // Memoize mobile menu toggle to prevent unnecessary re-renders
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  // Memoize mobile menu close to prevent unnecessary re-renders
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <header
      className={`navbar-optimized fixed top-0 left-0 right-0 z-50 transition-all duration-700 will-change-auto transform-gpu ${
        isScrolled 
          ? "glass-morphism gold-glow border-b border-gradient-to-r from-yellow-500/30 via-purple-500/30 to-blue-500/30 shadow-2xl shadow-purple-500/20 animate-cyber-pulse" 
          : "bg-gradient-to-b from-black/30 via-purple-900/10 to-transparent backdrop-blur-md premium-gradient"
      }`}
      style={{ willChange: isScrolled ? 'background-color, box-shadow' : 'auto' }}
    >
      <div className="navbar-container container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Ultra Premium Logo */}
          <Link href="/" className="navbar-logo flex items-center gap-3 gpu-accelerated group">
            <motion.div 
              className="relative h-10 w-10 md:h-12 md:w-12"
              whileHover={{ scale: 1.2, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse-gold" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-all duration-300 animate-floating-3d" />
              <Image
                src="/goldium-logo.png"
                alt="Goldium.io"
                width={48}
                height={48}
                className="relative object-contain gpu-accelerated drop-shadow-2xl animate-hologram"
                priority
              />
            </motion.div>
            <motion.span 
              className="optimized-text text-xl md:text-2xl font-black text-gold-gradient drop-shadow-2xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Goldium.io
            </motion.span>
          </Link>

          {/* Ultra Premium Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="group relative optimized-text px-3 lg:px-4 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-all duration-500 overflow-hidden"
                >
                  {/* Premium Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-yellow-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500 rounded-xl" />
                  <div className="absolute inset-0 glass-morphism opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-white/30 rounded-xl transition-all duration-300" />
                  
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Text with Glow */}
                  <span className="relative z-10 group-hover:text-cyber-glow transition-all duration-300">
                    {item.name}
                  </span>
                  
                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-500 group-hover:w-full group-hover:left-0 transition-all duration-500 rounded-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Ultra Premium Right Section */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-md animate-pulse" />
              <NetworkBadge />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-purple-500/20 rounded-xl blur-lg animate-gold-shimmer" />
              <ConnectWalletButton />
            </motion.div>
          </div>

          {/* Ultra Premium Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm animate-pulse" />
              <NetworkBadge />
            </motion.div>
            
            <motion.button
              onClick={toggleMobileMenu}
              className="relative navbar-mobile-toggle p-3 rounded-xl text-white transition-all duration-300 gpu-accelerated overflow-hidden group"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              aria-label="Toggle mobile menu"
            >
              {/* Premium Background */}
              <div className="absolute inset-0 glass-morphism group-hover:bg-white/10 transition-all duration-300" />
              <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 rounded-xl transition-all duration-300" />
              
              {/* Icon with Animation */}
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {isMobileMenuOpen ? 
                  <X size={24} className="text-red-400 drop-shadow-lg" /> : 
                  <Menu size={24} className="text-cyan-400 drop-shadow-lg" />
                }
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Ultra Premium Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
          className="md:hidden glass-morphism border-t border-gradient-to-r from-yellow-500/30 via-purple-500/30 to-blue-500/30 premium-gradient"
        >
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-purple-900/30 to-black/60" />
          <div className="absolute inset-0 animate-matrix-rain opacity-10" />
          
          <div className="relative container mx-auto px-4 py-8 space-y-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  type: "spring", 
                  stiffness: 300,
                  damping: 20 
                }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="group relative block py-4 px-6 text-white/70 hover:text-white rounded-2xl transition-all duration-500 font-semibold overflow-hidden mobile-optimized"
                >
                  {/* Premium Mobile Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-yellow-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-500 rounded-2xl" />
                  <div className="absolute inset-0 glass-morphism opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300" />
                  
                  {/* Mobile Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Mobile Text with Glow */}
                  <span className="relative z-10 group-hover:text-cyber-glow transition-all duration-300 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    {item.name}
                  </span>
                  
                  {/* Mobile Bottom Glow Line */}
                  <div className="absolute bottom-0 left-6 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-purple-500 group-hover:w-3/4 transition-all duration-500 rounded-full" />
                </Link>
              </motion.div>
            ))}
            
            {/* Ultra Premium Mobile Wallet Section */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: navItems.length * 0.1 + 0.2, 
                type: "spring", 
                stiffness: 300 
              }}
              className="pt-6 border-t border-gradient-to-r from-yellow-500/30 via-purple-500/30 to-blue-500/30 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl" />
              <div className="relative flex flex-col gap-3">
                <div className="flex justify-center">
                  <NetworkBadge />
                </div>
                <div className="flex justify-center">
                  <ConnectWalletButton />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

// Memoize the entire component to prevent unnecessary re-renders
export default memo(Navbar)
