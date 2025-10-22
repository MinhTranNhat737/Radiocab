"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Building2, 
  Users, 
  Car, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import { useEffect } from "react"

const sidebarItems = [
  {
    title: "Hồ sơ công ty",
    href: "/company",
    icon: Building2,
    roles: ["MANAGER", "ACCOUNTANT", "DISPATCHER", "DRIVER"]
  },
  {
    title: "Nhân viên",
    href: "/company/employees",
    icon: Users,
    roles: ["MANAGER"]
  },
  {
    title: "Xe",
    href: "/company/vehicles",
    icon: Car,
    roles: ["MANAGER"]
  },
  {
    title: "Đơn hàng",
    href: "/company/orders",
    icon: FileText,
    roles: ["MANAGER", "DISPATCHER", "DRIVER"]
  },
  {
    title: "Báo cáo",
    href: "/company/reports",
    icon: BarChart3,
    roles: ["MANAGER", "ACCOUNTANT"]
  },
  {
    title: "Cài đặt",
    href: "/company/settings",
    icon: Settings,
    roles: ["MANAGER"]
  }
]

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>("")
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      setUserRole(user.role)
    }
  }, [])

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(userRole)
  )

  // Auto-redirect to first item if on base /company route
  useEffect(() => {
    if (pathname === "/company" && filteredSidebarItems.length > 0 && !hasRedirected) {
      setHasRedirected(true)
      router.push(filteredSidebarItems[0].href)
    }
  }, [pathname, filteredSidebarItems, hasRedirected, router])

  // Hide sidebar for roles with only one item
  const shouldShowSidebar = filteredSidebarItems.length > 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && shouldShowSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout container */}
      <div className="flex" style={{minHeight: 'calc(100vh - 6rem)'}}>
        {/* Sidebar - Only show if more than 1 item */}
        {shouldShowSidebar && (
          <>
            {/* Desktop Sidebar - Static */}
            <div className="hidden lg:block w-64 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto flex-shrink-0" style={{height: 'calc(100vh - 6rem)'}}>
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                  Quản lý công ty
                </h2>
              </div>

              <nav className="mt-6 px-3">
                <div className="space-y-1">
                  {filteredSidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                          isActive
                            ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>

            {/* Mobile Sidebar - Fixed Overlay */}
            <div className={cn(
              "lg:hidden fixed top-24 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out overflow-y-auto z-50",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )} style={{height: 'calc(100vh - 6rem)'}}>
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                  Quản lý công ty
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="mt-6 px-3">
                <div className="space-y-1">
                  {filteredSidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                          isActive
                            ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.title}
                      </Link>
                    )
                  })}
                </div>
              </nav>
            </div>
          </>
        )}

        {/* Sub Main Content */}
        <div className="flex-1">
          {/* Mobile header - Only show if sidebar exists */}
          {shouldShowSidebar && (
            <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-yellow-400">
                Quản lý công ty
              </h1>
              <div className="w-8" /> {/* Spacer */}
            </div>
          )}

          {/* Sub Page content */}
          <div className="p-6 min-h-screen">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
