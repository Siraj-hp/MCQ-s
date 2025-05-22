"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import html2canvas from "html2canvas"

export default function CompletedPage() {
  const router = useRouter()
  const [participantName, setParticipantName] = useState<string>("")
  const [score, setScore] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false)
  const resultCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const name = localStorage.getItem("participantName")
    if (!name) {
      router.push("/login")
      return
    }
    setParticipantName(name)

    // Get completed challenges from localStorage
    const completed = JSON.parse(localStorage.getItem("completedChallenges") || "[]")

    // Calculate total score from completed challenges
    const totalScore = completed.reduce((sum, challenge) => sum + challenge.score, 0)
    setScore(totalScore)

    // Get total time spent
    const totalTime = Number.parseInt(localStorage.getItem("totalTimeSpent") || "0")
    setTotalTimeSpent(totalTime)

    // Prevent going back to challenges
    window.history.pushState(null, "", window.location.href)
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href)
    }
  }, [router])

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // Function to capture and download screenshot
  const captureScreenshot = async () => {
    if (!resultCardRef.current) return

    setIsCapturing(true)

    try {
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2, // Higher quality
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${participantName.replace(/\s+/g, "_")}_results.png`
      link.click()
    } catch (error) {
      console.error("Error capturing screenshot:", error)
      alert("Failed to capture screenshot. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md" ref={resultCardRef}>
        <CardHeader className="text-center" style={{ fontFamily: "Times New Roman, serif", color: "black" }}>
          <CardTitle className="text-2xl font-bold" style={{ color: "black" }}>
            THANK YOU...!
          </CardTitle>
          <CardDescription style={{ color: "black", fontWeight: "bold" }}>
            Great job, {participantName}!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6" style={{ fontFamily: "Times New Roman, serif", color: "black" }}>
            <div className="rounded-md bg-white p-6 text-center border border-gray-300">
              <p className="mb-2 text-3xl font-bold" style={{ color: "black" }}>
                {score} points
              </p>
              <p className="text-sm" style={{ color: "black" }}>
                You scored {score} out of 20 possible points
              </p>
              <div className="mt-3 rounded-md bg-white p-2 text-center border border-gray-300">
                <p className="text-lg font-semibold" style={{ color: "black" }}>
                  Total Time: {formatTime(totalTimeSpent)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 w-full max-w-md">
        <Button onClick={captureScreenshot} className="w-full" disabled={isCapturing}>
          <Camera className="mr-2 h-4 w-4" />
          {isCapturing ? "Capturing..." : "Take Screenshot"}
        </Button>
      </div>
    </div>
  )
}
