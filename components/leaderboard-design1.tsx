"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateTradePercentages } from "@/lib/utils"
import { getLeaderboardData } from "@/data/leaderboard-data"
import { addUserToDatabase, updateUserSocials, getUserData } from "@/app/actions"
import { MessageCircle, Wallet, ChevronDown } from "lucide-react"
import { Badge } from "@/components/badge"
import { Button } from "@/components/ui/button"
import { SocialMediaModal } from "@/components/social-media-modal"

export default function LeaderboardDesign1() {
  const { topTraders, rankedTraders } = getLeaderboardData()
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showSocialMediaModal, setShowSocialMediaModal] = useState(false)
  const [phantomWalletInstalled, setPhantomWalletInstalled] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const checkPhantomWallet = async () => {
      if (typeof window !== "undefined" && (window as any).solana && (window as any).solana.isPhantom) {
        setPhantomWalletInstalled(true)
        try {
          const provider = (window as any).solana
          const response = await provider.connect({ onlyIfTrusted: true })
          const publicKey = response.publicKey.toString()
          setWalletAddress(publicKey)
          setIsWalletConnected(true)
          await fetchUserData(publicKey)
        } catch (error) {
          console.log("User has not previously connected Phantom wallet")
        }
      }
    }

    checkPhantomWallet()
  }, [])

  const fetchUserData = useCallback(async (address: string) => {
    const result = await getUserData(address)
    if (result.success) {
      setUserData(result.user)
    } else {
      console.error("Failed to fetch user data:", result.error)
    }
  }, [])

  const handleConnectWallet = useCallback(async () => {
    if (typeof window === "undefined") {
      console.error("Window object is not available")
      return
    }

    if (!(window as any).solana || !(window as any).solana.isPhantom) {
      window.open("https://phantom.app/", "_blank")
      return
    }

    try {
      const provider = (window as any).solana
      const response = await provider.connect()
      const publicKey = response.publicKey.toString()
      setWalletAddress(publicKey)
      setIsWalletConnected(true)

      await addUserToDatabase(publicKey)
      await fetchUserData(publicKey)
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error)
    }
  }, [fetchUserData])

  const handleOpenSocialMediaModal = useCallback(() => {
    if (walletAddress) {
      fetchUserData(walletAddress)
    }
    setShowSocialMediaModal(true)
  }, [walletAddress, fetchUserData])

  const handleSocialSubmit = async (nickname: string, walletAddress: string, socials: Record<string, string>) => {
    try {
      const result = await updateUserSocials(nickname, walletAddress, {
        telegram: socials.telegram || "",
        discord: socials.discord || "",
        twitter: socials.twitter || "",
        twitch: socials.twitch || "",
        kick: socials.kick || "",
      })

      if (result.success) {
        setShowSocialMediaModal(false)
        setUserData(result.user)
        console.log("Successfully updated social information")
      } else {
        console.error("Failed to update social information:", result.error)
      }
    } catch (error) {
      console.error("Error updating social information:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white font-sans">
      <header className="bg-[#111217] border-b border-[#2A2D3A] py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            CryptoLeaderboard
          </h1>
          <div className="flex space-x-4">
            <Button
              onClick={handleOpenSocialMediaModal}
              variant="outline"
              className="bg-transparent border-[#2A2D3A] text-white hover:bg-[#2A2D3A] transition-colors duration-300"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Add Social
            </Button>
            <Button
              onClick={handleConnectWallet}
              variant="outline"
              className="bg-transparent border-[#2A2D3A] text-white hover:bg-[#2A2D3A] transition-colors duration-300"
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isWalletConnected
                ? `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}`
                : phantomWalletInstalled
                  ? "Connect Wallet"
                  : "Install Phantom"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="daily" className="mb-8">
          <TabsList className="bg-[#111217] p-1 rounded-lg inline-flex">
            {["Daily", "Weekly", "Monthly"].map((period) => (
              <TabsTrigger
                key={period}
                value={period.toLowerCase()}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 data-[state=active]:bg-[#2A2D3A] data-[state=active]:text-white"
              >
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topTraders.map((trader, i) => (
            <Card key={i} className="bg-[#111217] border-[#2A2D3A] overflow-hidden relative">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    {trader.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{trader.name}</h3>
                    <p className="text-sm text-gray-400">{trader.walletAddress}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-green-400">{trader.pnl} ≋</div>
                  <div className="text-sm text-gray-400">{trader.value}</div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{trader.greenTrades} Wins</span>
                  <span>{trader.redTrades} Losses</span>
                </div>
                <div className="w-full h-2 bg-[#2A2D3A] rounded-full overflow-hidden">
                  {(() => {
                    const { greenPercentage, redPercentage } = calculateTradePercentages(
                      trader.greenTrades,
                      trader.redTrades,
                    )
                    return (
                      <>
                        <div className="h-full bg-green-400" style={{ width: `${greenPercentage}%` }} />
                      </>
                    )
                  })()}
                </div>
              </div>
              {i === 0 && <Badge type="gold" />}
              {i === 1 && <Badge type="silver" />}
              {i === 2 && <Badge type="bronze" />}
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          {rankedTraders.map((trader, i) => (
            <div
              key={i}
              className="bg-[#111217] border border-[#2A2D3A] rounded-lg p-4 flex items-center transition-all duration-300 hover:bg-[#1A1B20]"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-lg font-bold">
                    {trader.name[0]}
                  </div>
                  <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#2A2D3A] rounded-full flex items-center justify-center text-xs font-bold">
                    {trader.rank}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{trader.name}</h3>
                  <p className="text-sm text-gray-400">{trader.walletAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{trader.pnl} ≋</div>
                  <div className="text-sm text-gray-400">{trader.value}</div>
                </div>
                <div className="w-24">
                  <div className="w-full h-2 bg-[#2A2D3A] rounded-full overflow-hidden">
                    {(() => {
                      const { greenPercentage, redPercentage } = calculateTradePercentages(
                        trader.greenTrades,
                        trader.redTrades,
                      )
                      return <div className="h-full bg-green-400" style={{ width: `${greenPercentage}%` }} />
                    })()}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{trader.greenTrades}W</span>
                    <span>{trader.redTrades}L</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="bg-transparent border-[#2A2D3A] text-white hover:bg-[#2A2D3A] transition-colors duration-300"
          >
            Load More <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <SocialMediaModal
          isOpen={showSocialMediaModal}
          onClose={() => setShowSocialMediaModal(false)}
          onSubmit={handleSocialSubmit}
          initialSocials={userData?.socials || {}}
          walletAddress={walletAddress}
          initialNickname={userData?.nickname || ""}
        />
      </main>
    </div>
  )
}

