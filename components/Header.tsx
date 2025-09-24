"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Menu, Download, User, UserPlus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-lg border-b border-primary/20">
      <div className="w-full flex items-center h-24 px-4 md:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-black/30 via-primary/20 to-black/30 backdrop-blur-sm border-2 border-black/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ring-2 ring-white/50">
            <Image
              src="logo2.png"
              alt="RadioCabs Logo"
              width={200}
              height={75}
              className="h-32 w-auto drop-shadow-lg dark:drop-shadow-none"
            />
          </Link>
        </div>

        <nav className="flex items-center justify-between flex-1 max-w-4xl mx-8 overflow-x-auto hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <Link
            href="/"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Trang Chủ
          </Link>
          <Link
            href="/listing"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Công Ty Taxi
          </Link>
          <Link
            href="/drivers"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Tài Xế
          </Link>
          <Link
            href="/advertise"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Quảng Cáo
          </Link>
          <Link
            href="/services"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Dịch Vụ
          </Link>
          <Link
            href="/feedback"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Góp Ý
          </Link>
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/20 hover:text-primary hover:shadow-lg hover:shadow-primary/50 hover:border-primary/80 font-medium px-4 py-2 transition-all duration-300 bg-transparent hover:scale-105"
            >
              <User className="h-4 w-4 mr-2" />
              Đăng Nhập
            </Button>
          </Link>

          <Link href="/register">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Đăng Ký
            </Button>
          </Link>

          <Link href="/download">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              TẢI ỨNG DỤNG NGAY
            </Button>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-yellow-400 text-sm font-medium">
            <button className="hover:text-yellow-300 transition-colors">VN</button>
            <span className="text-yellow-400/50">|</span>
            <button className="hover:text-yellow-300 transition-colors">EN</button>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden text-yellow-400 hover:bg-yellow-400/10">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
