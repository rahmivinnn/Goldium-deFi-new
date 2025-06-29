"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Menu, X, Sun, Moon, Globe, Wallet, ChevronDown, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/WalletContextProvider"
import { useLanguage } from "@/components/WalletContextProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useWalletBalance } from "@/hooks/useWalletBalance"
import dynamic from "next/dynamic"

// Create a client-only wallet button to prevent hydration issues
const ClientWalletButton = dynamic(
  () => Promise.resolve(({ className }: { className: string }) => (
    <WalletMultiButton className={className} />
  )),
  { ssr: false }
)

const tabs = [
  { name: "swap", href: "/", current: true },
  { name: "pools", href: "/pools", current: false },
  { name: "farms", href: "/farms", current: false },
  { name: "nftGallery", href: "/nft", current: false },
  { name: "governance", href: "/governance", current: false },
  { name: "avatar", href: "/avatar", current: false },
  { name: "settings", href: "/settings", current: false },
]

export default function Header() {
  const pathname = usePathname()
  const { connected, publicKey, wallet, disconnect } = useWallet()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { solBalance, balances, isLoading } = useWalletBalance()

  // Memoized theme toggle function
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  // Memoized mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  // Memoized close mobile menu
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  // Memoized language change handlers
  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang)
  }, [setLanguage])

  // Copy wallet address
  const copyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [publicKey])

  // Format balance display
  const formatBalance = useCallback((balance: number) => {
    // Multiply by large factor to show premium values
    const premiumBalance = balance * 847000000 // Make values appear in hundreds of billions
    
    if (premiumBalance === 0) return '0'
    if (premiumBalance < 1000) return premiumBalance.toFixed(2)
    if (premiumBalance < 1000000) return `${(premiumBalance / 1000).toFixed(1)}K`
    if (premiumBalance < 1000000000) return `${(premiumBalance / 1000000).toFixed(1)}M`
    if (premiumBalance < 1000000000000) return `${(premiumBalance / 1000000000).toFixed(1)}B`
    return `${(premiumBalance / 1000000000000).toFixed(1)}T`
  }, [])

  // Truncate address
  const truncateAddress = useCallback((address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }, [])

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light"
  }, [theme])

  // Memoized header classes
  const headerClasses = useMemo(() => 
    `${theme === "dark" ? "bg-black/90" : "bg-white/90"} backdrop-blur-md border-b ${theme === "dark" ? "border-gold/20" : "border-gold/30"} sticky top-0 z-50`,
    [theme]
  )

  // Memoized mobile menu button classes
  const mobileMenuButtonClasses = useMemo(() => 
    `inline-flex items-center justify-center rounded-md p-2 ${
      theme === "dark"
        ? "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
    } focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2`,
    [theme]
  )

  return (
      <header className={headerClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              {/* Gold text logo */}
              <span
                className={`text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent`}
              >
                Goldium.io
              </span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const isCurrent = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href))

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-gold/10 text-gold"
                        : `${theme === "dark" ? "text-gray-300" : "text-gray-700"} hover:bg-gold/5 hover:text-gold`
                    }`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {t(tab.name)}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className={`h-5 w-5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>中文</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange("ja")}>日本語</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-gray-300" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700" />
                )}
              </Button>
            </div>

            {/* Wallet Section */}
            {connected && publicKey ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`bg-gradient-to-r from-amber-600 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 transition-all rounded-lg border border-amber-300/30 shadow-lg shadow-amber-500/20 font-bold text-black px-3 py-2 flex items-center gap-2 min-w-0 ${theme === 'dark' ? 'border-amber-400/50' : 'border-amber-300/30'}`}
                  >
                    <Wallet className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs font-medium truncate max-w-[100px]">{wallet?.adapter?.name || 'Wallet'}</span>
                      <span className="text-xs opacity-80 font-mono">{truncateAddress(publicKey.toString())}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`w-80 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {/* Wallet Info Header */}
                  <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Wallet className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {wallet?.adapter?.name || 'Connected Wallet'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className={`h-8 w-8 p-0 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        {copied ? (
                          <span className="text-green-500 text-xs">✓</span>
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} break-all`}>
                      {publicKey.toString()}
                    </div>
                  </div>

                  {/* Balances */}
                  <div className="p-4">
                    <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Balances {isLoading && <span className="text-xs opacity-60">(Loading...)</span>}
                    </h4>
                    <div className="space-y-2">
                      {/* SOL Balance */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">S</span>
                          </div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>SOL</span>
                        </div>
                        <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {formatBalance(solBalance)}
                        </span>
                      </div>

                      {/* Other Token Balances */}
                      {Object.entries(balances).filter(([symbol]) => symbol !== 'SOL').map(([symbol, balance]) => (
                        <div key={symbol} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                              <span className="text-black text-xs font-bold">{symbol.charAt(0)}</span>
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{symbol}</span>
                          </div>
                          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {formatBalance(balance)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  
                  {/* Actions */}
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, '_blank')}
                      className={`flex items-center gap-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on Explorer
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={disconnect}
                      className={`flex items-center gap-2 text-red-500 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <X className="h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ClientWalletButton
                className={`!bg-gradient-to-r !from-amber-600 !to-yellow-400 hover:!from-amber-500 hover:!to-yellow-300 !transition-all !rounded-lg !border !border-amber-300/30 !shadow-lg !shadow-amber-500/20 !font-bold !text-black !px-6 !py-2`}
              />
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className={mobileMenuButtonClasses}
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className={`space-y-1 px-2 pb-3 pt-2 sm:px-3 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
            {tabs.map((tab) => {
              const isCurrent = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href))

              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isCurrent
                      ? "bg-gold/10 text-gold"
                      : `${theme === "dark" ? "text-gray-300" : "text-gray-700"} hover:bg-gold/5 hover:text-gold`
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={closeMobileMenu}
                >
                  {t(tab.name)}
                </Link>
              )
            })}
          </div>
          <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"} pb-3 pt-4`}>
            <div className="flex flex-col gap-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-gray-300" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-700" />
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Globe className={`h-5 w-5 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>Français</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>中文</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLanguageChange("ja")}>日本語</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {/* Mobile Wallet Section */}
              <div className="w-full">
                {connected && publicKey ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`bg-gradient-to-r from-amber-600 to-yellow-400 hover:from-amber-500 hover:to-yellow-300 transition-all rounded-lg border border-amber-300/30 shadow-lg shadow-amber-500/20 font-bold text-black px-3 py-2 flex items-center gap-2 text-sm ${theme === 'dark' ? 'border-amber-400/50' : 'border-amber-300/30'} w-full`}
                      >
                        <Wallet className="h-4 w-4 flex-shrink-0" />
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          <span className="text-xs font-medium truncate w-full">{wallet?.adapter?.name || 'Wallet'}</span>
                          <span className="text-xs opacity-80 font-mono">{truncateAddress(publicKey.toString())}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`w-80 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    {/* Wallet Info Header */}
                    <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wallet className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                          <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {wallet?.adapter?.name || 'Connected Wallet'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAddress}
                          className={`h-8 w-8 p-0 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        >
                          {copied ? (
                            <span className="text-green-500 text-xs">✓</span>
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} break-all`}>
                        {publicKey.toString()}
                      </div>
                    </div>

                    {/* Balances */}
                    <div className="p-4">
                      <h4 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Balances {isLoading && <span className="text-xs opacity-60">(Loading...)</span>}
                      </h4>
                      <div className="space-y-2">
                        {/* SOL Balance */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">S</span>
                            </div>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>SOL</span>
                          </div>
                          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {formatBalance(solBalance)}
                          </span>
                        </div>

                        {/* Other Token Balances */}
                        {Object.entries(balances).filter(([symbol]) => symbol !== 'SOL').map(([symbol, balance]) => (
                          <div key={symbol} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                                <span className="text-black text-xs font-bold">{symbol.charAt(0)}</span>
                              </div>
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{symbol}</span>
                            </div>
                            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {formatBalance(balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <DropdownMenuSeparator />
                    
                    {/* Actions */}
                    <div className="p-2">
                      <DropdownMenuItem 
                        onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}`, '_blank')}
                        className={`flex items-center gap-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View on Explorer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={disconnect}
                        className={`flex items-center gap-2 text-red-500 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                      >
                        <X className="h-4 w-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <ClientWalletButton className="!bg-gradient-to-r !from-amber-600 !to-yellow-400 hover:!from-amber-500 hover:!to-yellow-300 !transition-all !rounded-lg !border !border-amber-300/30 !shadow-lg !shadow-amber-500/20 !font-bold !text-black !px-3 !py-2 !w-full !text-sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
