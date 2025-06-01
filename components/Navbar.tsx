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
      className={`navbar-optimized fixed top-0 left-0 right-0 z-50 transition-colors duration-200 will-change-auto transform-gpu ${
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-lg shadow-yellow-900/10" : "bg-transparent"
      }`}
      style={{ willChange: isScrolled ? 'background-color' : 'auto' }}
    >
      <div className="navbar-container container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="navbar-logo flex items-center gap-2 gpu-accelerated">
            <div className="relative h-10 w-10 md:h-12 md:w-12">
              <Image
                src="/goldium-logo.png"
                alt="Goldium.io"
                width={48}
                height={48}
                className="object-contain gpu-accelerated"
                priority
              />
            </div>
            <span className="optimized-text text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-300">
              Goldium.io
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className="navbar-link optimized-text text-white hover:text-yellow-300 transition-transform duration-100 px-3 py-2 rounded-md hover:bg-yellow-300/10 cursor-pointer select-none gpu-accelerated"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Wallet & Network */}
          <div className="hidden md:flex items-center gap-4">
            <NetworkBadge />
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="navbar-button md:hidden text-white p-2 rounded-md hover:bg-yellow-300/10 transition-transform duration-100 cursor-pointer select-none gpu-accelerated" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="mobile-menu md:hidden bg-black border-t border-yellow-900/30 origin-top gpu-accelerated"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="navbar-link optimized-text text-white hover:text-yellow-300 transition-transform duration-100 py-3 px-4 rounded-md hover:bg-yellow-300/10 cursor-pointer select-none block gpu-accelerated"
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-4">
              <NetworkBadge />
              <ConnectWalletButton />
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

// Memoize the entire component to prevent unnecessary re-renders
export default memo(Navbar)
