"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    
    router.replace("/admin/dashboard")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center page-enter">
      <div className="text-center fade-in-scale">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Đang chuyển hướng đến Admin Dashboard...</p>
      </div>
    </div>
  )
}

