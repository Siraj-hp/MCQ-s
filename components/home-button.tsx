"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HomeButton() {
  return (
    <div className="absolute left-4 top-4 z-10">
      <Link href="/">
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Button>
      </Link>
    </div>
  )
}
