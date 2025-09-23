"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Car,
  Menu,
  User,
} from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 animate-glow">
          <Car className="h-8 w-8 text-primary animate-pulse-yellow" />
          <span className="text-xl font-bold text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RadioCabs.in
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Trang Chủ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/listing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Công Ty Taxi
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/drivers"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Tài Xế
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/advertise"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Quảng Cáo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Dịch Vụ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/feedback"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
          >
            Góp Ý
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden md:flex hover-glow border border-primary/20">
              <User className="h-4 w-4 mr-2" />
              Đăng Nhập
            </Button>
          </Link>
          <Link href="/listing">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 animate-glow hover-lift"
            >
              Đăng Ký Ngay
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="md:hidden hover-glow">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
