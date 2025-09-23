"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Menu, Download, User, UserPlus } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black shadow-lg border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-24 px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="logo1.png"
              alt="RadioCabs Logo"
              width={200}
              height={75}
              className="h-32 w-auto"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 flex-1 mx-8">
          <Link
            href="/"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Trang Chủ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/listing"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Công Ty Taxi
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/drivers"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Tài Xế
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/advertise"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Quảng Cáo
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Dịch Vụ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/feedback"
            className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-all duration-300 hover:scale-105 relative group"
          >
            Góp Ý
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black font-medium px-4 py-2 transition-all duration-300 bg-transparent"
            >
              <User className="h-4 w-4 mr-2" />
              Đăng Nhập
            </Button>
          </Link>

          <Link href="/register">
            <Button
              size="sm"
              className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Đăng Ký
            </Button>
          </Link>

          <Link href="/download">
            <Button
              size="sm"
              className="bg-yellow-500 text-black hover:bg-yellow-400 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
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
