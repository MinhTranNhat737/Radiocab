"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Menu, Download, User, UserPlus } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageToggle from "@/components/LanguageToggle"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Header() {
  const { t } = useLanguage()
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-lg border-b border-primary/20">
      <div className="w-full flex items-center h-24 px-4 md:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="logo2.png"
              alt="RadioCabs Logo"
              width={200}
              height={75}
              className="h-32 w-auto"
            />
          </Link>
        </div>

        <nav className="flex items-center justify-between flex-1 max-w-4xl mx-8 overflow-x-auto hide-scrollbar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <Link
            href="/"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {t.home}
          </Link>
          <Link
            href="/listing"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {t.taxiCompanies}
          </Link>
          <Link
            href="/drivers"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {t.drivers}
          </Link>
          <Link
            href="/services"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {t.services}
          </Link>
          <Link
            href="/feedback"
            className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            {t.feedback}
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

          <Link href="/download">
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.downloadApp}
            </Button>
          </Link>

          <LanguageToggle />

          <Button variant="ghost" size="sm" className="md:hidden text-yellow-400 hover:bg-yellow-400/10">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
