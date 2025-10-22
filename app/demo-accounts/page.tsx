"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Building2, 
  Car, 
  Calculator,
  Navigation,
  Copy,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react"
import Header from "@/components/Header"
import { useState } from "react"

export default function DemoAccountsPage() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  const demoAccounts = [
    // Admin accounts
    {
      role: "admin",
      title: "Quản trị viên",
      color: "from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30",
      icon: Shield,
      accounts: [
        {
          username: "admin",
          email: "admin@radiocabs.in",
          password: "Admin@123",
          name: "Quản Trị Viên",
          description: "Quản trị toàn hệ thống"
        },
        {
          username: "superadmin",
          email: "superadmin@radiocabs.in",
          password: "SuperAdmin@2024",
          name: "Super Admin",
          description: "Quản trị cấp cao nhất"
        }
      ]
    },
    // Manager accounts
    {
      role: "manager",
      title: "Quản lý công ty",
      color: "from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30",
      icon: Building2,
      accounts: [
        {
          username: "vinasun",
          email: "info@vinasun.vn",
          password: "Vinasun@123",
          name: "Nguyễn Văn A",
          company: "Vinasun Taxi",
          description: "Quản lý Vinasun Taxi"
        },
        {
          username: "mailinh",
          email: "contact@mailinh.vn",
          password: "MaiLinh@123",
          name: "Trần Thị B",
          company: "Mai Linh Taxi",
          description: "Quản lý Mai Linh Taxi"
        }
      ]
    },
    // Driver accounts
    {
      role: "driver",
      title: "Tài xế",
      color: "from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30",
      icon: Car,
      accounts: [
        {
          username: "driver001",
          email: "driver001@radiocabs.in",
          password: "Driver001@123",
          name: "Nguyễn Minh F",
          description: "Tài xế Vinasun Taxi"
        },
        {
          username: "driver002",
          email: "driver002@radiocabs.in",
          password: "Driver002@123",
          name: "Trần Văn G",
          description: "Tài xế Mai Linh Taxi"
        }
      ]
    },
    // Accountant accounts
    {
      role: "accountant",
      title: "Kế toán",
      color: "from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30",
      icon: Calculator,
      accounts: [
        {
          username: "accountant001",
          email: "accountant001@radiocabs.in",
          password: "Accountant001@123",
          name: "Nguyễn Thị N",
          company: "Vinasun Taxi",
          description: "Kế toán Vinasun Taxi"
        }
      ]
    },
    // Coordinator accounts
    {
      role: "coordinator",
      title: "Người điều phối",
      color: "from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30",
      icon: Navigation,
      accounts: [
        {
          username: "coordinator001",
          email: "coordinator001@radiocabs.in",
          password: "Coordinator001@123",
          name: "Lê Thị P",
          company: "Vinasun Taxi",
          description: "Điều phối Vinasun Taxi"
        }
      ]
    }
  ]

  const copyToClipboard = (text: string, accountId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAccount(accountId)
    setTimeout(() => setCopiedAccount(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 mb-2">
              Tài khoản Demo
            </h1>
            <p className="text-gray-600 dark:text-yellow-200">
              Sử dụng các tài khoản demo để test hệ thống với các vai trò khác nhau
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-8">
            {demoAccounts.map((roleGroup, roleIndex) => (
              <Card key={roleIndex} className={`bg-gradient-to-br ${roleGroup.color} shadow-2xl`}>
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <roleGroup.icon className="w-6 h-6" />
                    {roleGroup.title}
                  </CardTitle>
                  <CardDescription className="text-yellow-200">
                    {roleGroup.accounts.length} tài khoản demo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleGroup.accounts.map((account, accountIndex) => {
                      const accountId = `${roleGroup.role}-${accountIndex}`
                      return (
                        <Card key={accountIndex} className="bg-white/80 dark:bg-black/50 border-yellow-500/30 shadow-lg">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-yellow-400">
                                  {account.name}
                                </h3>
                                {account.company && (
                                  <p className="text-sm text-gray-600 dark:text-yellow-300">
                                    {account.company}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-yellow-400">
                                  {account.description}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-yellow-300">Username:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {account.username}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(account.username, `${accountId}-username`)}
                                      className="h-6 w-6 p-0"
                                    >
                                      {copiedAccount === `${accountId}-username` ? (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-yellow-300">Email:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {account.email}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(account.email, `${accountId}-email`)}
                                      className="h-6 w-6 p-0"
                                    >
                                      {copiedAccount === `${accountId}-email` ? (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600 dark:text-yellow-300">Password:</span>
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {account.password}
                                    </code>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => copyToClipboard(account.password, `${accountId}-password`)}
                                      className="h-6 w-6 p-0"
                                    >
                                      {copiedAccount === `${accountId}-password` ? (
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                      ) : (
                                        <Copy className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-2">
                                <Button
                                  size="sm"
                                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                  onClick={() => {
                                    // Auto-fill login form
                                    const loginUrl = "/login"
                                    window.location.href = loginUrl
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Đăng nhập ngay
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-yellow-400">
                Hướng dẫn sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                    Cách đăng nhập:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-yellow-200">
                    <li>Nhấn "Đăng nhập ngay" hoặc truy cập <code>/login</code></li>
                    <li>Chọn tab "Người dùng" (trừ admin)</li>
                    <li>Nhập username hoặc email</li>
                    <li>Nhập password</li>
                    <li>Hệ thống sẽ tự động chuyển hướng theo role</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-yellow-400 mb-2">
                    Phân quyền theo role:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-yellow-200">
                    <li><strong>Admin:</strong> Xem toàn hệ thống (chỉ đọc)</li>
                    <li><strong>Manager:</strong> Quản lý đầy đủ công ty</li>
                    <li><strong>Driver:</strong> Chỉ xem đơn hàng của mình</li>
                    <li><strong>Accountant:</strong> Chỉ xem báo cáo doanh thu</li>
                    <li><strong>Coordinator:</strong> Điều phối đơn hàng và tài xế</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
