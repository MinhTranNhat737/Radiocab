"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  Building2, 
  Users, 
  Megaphone,
  CreditCard,
  Settings,
  BarChart3,
  FileText,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Search
} from "lucide-react"

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Companies", href: "/admin/dashboard/companies", icon: Building2 },
  { name: "Drivers", href: "/admin/dashboard/drivers", icon: Users },
  { name: "Subscriptions", href: "/admin/dashboard/subscriptions", icon: CreditCard },
  { name: "Payments", href: "/admin/dashboard/payments", icon: CreditCard },
  { name: "Leads", href: "/admin/dashboard/leads", icon: Users },
  { name: "Reviews", href: "/admin/dashboard/reviews", icon: FileText },
  { name: "Account Management", href: "/admin/dashboard/accounts", icon: Shield },
  { name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear any stored authentication data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('admin_token')
      sessionStorage.clear()
    }
    
    // Show confirmation message
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Redirect to login page
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              <h2 className="text-lg font-semibold text-primary">Admin Panel</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                            isActive
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-800">A</span>
                </div>
                <span className="text-sm font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
