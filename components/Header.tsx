"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Menu, Download, User, UserPlus, Bell, Building2, Settings, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageToggle from "@/components/LanguageToggle"
import { useLanguage } from "@/contexts/LanguageContext"
import { getCurrentUser, isAuthenticated, isAdmin, isManager, isDriver, isAccountant, isDispatcher, isCustomer, logout } from "@/lib/auth"
import { useEffect, useState } from "react"

export default function Header() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoggedIn(isAuthenticated())
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    setIsLoggedIn(false)
    window.location.href = "/"
  }
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-lg border-b border-primary/20">
      <div className="w-full flex items-center h-24 px-4 md:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="Logo.png"
              alt="RadioCabs Logo"
              width={200}
              height={75}
              className="h-32 w-auto"
            />
          </Link>
        </div>

        <nav className="flex items-center justify-between flex-1 max-w-4xl mx-8 overflow-x-auto hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {/* PUBLIC Navigation - Khi chưa đăng nhập */}
          {!isLoggedIn && (
            <>
              <Link
                href="/"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/booking"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Đặt xe
              </Link>
              <Link
                href="/listing"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Công ty taxi
              </Link>
              <Link
                href="/services"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Dịch vụ
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Liên hệ
              </Link>
              <Link
                href="/feedback"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Góp ý
              </Link>
              <Link
                href="/demo-accounts"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Demo Accounts
              </Link>
            </>
          )}

          {/* CUSTOMER Navigation - Chưa có công ty */}
          {isLoggedIn && isCustomer() && (
            <>
              <Link
                href="/"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/booking"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Đặt xe
              </Link>
              <Link
                href="/listing"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Đăng ký công ty
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Liên hệ
              </Link>
              <Link
                href="/feedback"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Góp ý
              </Link>
              <Link
                href="/notifications"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Thông báo
              </Link>
              <Link
                href="/profile"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <User className="w-4 h-4 inline mr-1" />
                Tài khoản
              </Link>
            </>
          )}

          {/* MANAGER, DRIVER, DISPATCHER, ACCOUNTANT Navigation - Có công ty */}
          {isLoggedIn && (isManager() || isDriver() || isDispatcher() || isAccountant()) && (
            <>
              <Link
                href="/"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/booking"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Đặt xe
              </Link>
              <Link
                href="/company"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <Building2 className="w-4 h-4 inline mr-1" />
                Công ty taxi
              </Link>
              <Link
                href="/services"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Dịch vụ
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Liên hệ
              </Link>
              <Link
                href="/feedback"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Góp ý
              </Link>
              <Link
                href="/notifications"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Thông báo
              </Link>
              <Link
                href="/profile"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <User className="w-4 h-4 inline mr-1" />
                Tài khoản
              </Link>
            </>
          )}

          {/* ADMIN Navigation - Chỉ có Admin Dashboard */}
          {isLoggedIn && isAdmin() && (
            <>
              <Link
                href="/"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Trang chủ
              </Link>
              <Link
                href="/booking"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Đặt xe
              </Link>
              <Link
                href="/services"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Dịch vụ
              </Link>
              <Link
                href="/contact"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Liên hệ
              </Link>
              <Link
                href="/feedback"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                Góp ý
              </Link>
              <Link
                href="/notifications"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Thông báo
              </Link>
              <Link
                href="/profile"
                className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <User className="w-4 h-4 inline mr-1" />
                Tài khoản
              </Link>
            </>
          )}
          
          {/* ADMIN - Chỉ hiển thị cho ADMIN */}
          {isLoggedIn && isAdmin() && (
            <Link
              href="/admin/dashboard"
              className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Admin Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          
          {/* Hiển thị Login/Register khi chưa đăng nhập */}
          {!isLoggedIn && (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/20 hover:text-primary hover:shadow-lg hover:shadow-primary/50 hover:border-primary/80 font-medium px-4 py-2 transition-all duration-300 bg-transparent hover:scale-105"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t.login}
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t.register}
                </Button>
              </Link>
            </>
          )}

          {/* Hiển thị thông tin user khi đã đăng nhập */}
          {isLoggedIn && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary/80">
                  Xin chào, {user.fullName}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {user.role === 'ADMIN' && 'Admin'}
                  {user.role === 'MANAGER' && 'Manager'}
                  {user.role === 'DRIVER' && 'Driver'}
                  {user.role === 'ACCOUNTANT' && 'Accountant'}
                  {user.role === 'DISPATCHER' && 'Dispatcher'}
                  {user.role === 'CUSTOMER' && 'Customer'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500/50 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:hover:border-red-400/50 transition-all duration-300"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Đăng xuất
              </Button>
            </div>
          )}

          <LanguageToggle />

          <Button variant="ghost" size="sm" className="md:hidden text-yellow-400 hover:bg-yellow-400/10">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

