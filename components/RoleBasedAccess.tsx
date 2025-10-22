"use client"

import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Users, 
  Car, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  FileText,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Navigation,
  UserCheck,
  UserX,
  Shield,
  Lock
} from "lucide-react"

interface RoleBasedAccessProps {
  userRole: "ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER"
  currentCompany?: string
}

export default function RoleBasedAccess({ userRole, currentCompany }: RoleBasedAccessProps) {
  
  // Admin permissions: View all companies, employees, vehicles, services (READ-ONLY)
  const adminPermissions = [
    {
      title: "Hồ sơ công ty",
      description: "Xem thông tin tất cả các công ty (chỉ đọc)",
      icon: Building2,
      actions: [
        { label: "Xem tất cả", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Nhân viên",
      description: "Xem danh sách nhân viên tất cả công ty (chỉ đọc)",
      icon: Users,
      actions: [
        { label: "Xem danh sách", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Xe",
      description: "Xem thông tin xe tất cả công ty (chỉ đọc)",
      icon: Car,
      actions: [
        { label: "Xem danh sách", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Dịch vụ",
      description: "Xem dịch vụ tất cả công ty (chỉ đọc)",
      icon: Settings,
      actions: [
        { label: "Xem danh sách", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Báo cáo công ty",
      description: "Xem lịch sử thanh toán và doanh thu tất cả công ty",
      icon: BarChart3,
      actions: [
        { label: "Xem báo cáo", icon: Eye, variant: "outline" as const },
        { label: "Xuất PDF", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Phản hồi dịch vụ",
      description: "Xem phản hồi từ khách hàng (không được giải quyết)",
      icon: MessageSquare,
      actions: [
        { label: "Xem phản hồi", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    }
  ]

  // Manager permissions: Full CRUD for their company
  const managerPermissions = [
    {
      title: "Hồ sơ công ty",
      description: "Quản lý thông tin công ty của bạn",
      icon: Building2,
      actions: [
        { label: "Xem", icon: Eye, variant: "outline" as const },
        { label: "Chỉnh sửa", icon: Edit, variant: "default" as const }
      ],
      allowed: true
    },
    {
      title: "Nhân viên",
      description: "Quản lý nhân viên và tài xế",
      icon: Users,
      actions: [
        { label: "Thêm nhân viên", icon: Plus, variant: "default" as const },
        { label: "Danh sách", icon: Eye, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Xe",
      description: "Quản lý thông tin xe taxi",
      icon: Car,
      actions: [
        { label: "Thêm xe", icon: Plus, variant: "default" as const },
        { label: "Danh sách", icon: Eye, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Dịch vụ",
      description: "Cấu hình dịch vụ taxi",
      icon: Settings,
      actions: [
        { label: "Cấu hình", icon: Settings, variant: "default" as const },
        { label: "Xem", icon: Eye, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Quản lý đơn hàng",
      description: "Theo dõi và quản lý đơn đặt xe",
      icon: FileText,
      actions: [
        { label: "Xem đơn hàng", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Báo cáo công ty",
      description: "Xem báo cáo đầy đủ công ty",
      icon: BarChart3,
      actions: [
        { label: "Xem báo cáo", icon: Eye, variant: "outline" as const },
        { label: "Xuất PDF", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    },
    {
      title: "Phản hồi dịch vụ",
      description: "Giải quyết phản hồi từ khách hàng",
      icon: MessageSquare,
      actions: [
        { label: "Xem phản hồi", icon: Eye, variant: "outline" as const },
        { label: "Giải quyết", icon: CheckCircle, variant: "default" as const }
      ],
      allowed: true
    }
  ]

  // Driver permissions: Only view their own orders
  const driverPermissions = [
    {
      title: "Đơn đặt hàng của tôi",
      description: "Xem các đơn đặt xe được giao cho bạn",
      icon: FileText,
      actions: [
        { label: "Xem đơn hàng", icon: Eye, variant: "outline" as const },
        { label: "Cập nhật trạng thái", icon: Edit, variant: "default" as const }
      ],
      allowed: true
    }
  ]

  // Accountant permissions: Only revenue reports
  const accountantPermissions = [
    {
      title: "Báo cáo doanh thu",
      description: "Xem báo cáo doanh thu công ty (chỉ đọc)",
      icon: BarChart3,
      actions: [
        { label: "Xem báo cáo", icon: Eye, variant: "outline" as const },
        { label: "Xuất báo cáo", icon: Download, variant: "outline" as const }
      ],
      allowed: true
    }
  ]

  // Coordinator permissions: Order management and driver assignment
  const coordinatorPermissions = [
    {
      title: "Quản lý đơn hàng",
      description: "Xem và điều phối đơn đặt xe",
      icon: FileText,
      actions: [
        { label: "Xem đơn hàng", icon: Eye, variant: "outline" as const },
        { label: "Điều phối", icon: Navigation, variant: "default" as const }
      ],
      allowed: true
    },
    {
      title: "Điều phối tài xế",
      description: "Phân công tài xế cho các đơn hàng",
      icon: UserCheck,
      actions: [
        { label: "Danh sách tài xế", icon: Users, variant: "outline" as const },
        { label: "Phân công", icon: UserCheck, variant: "default" as const }
      ],
      allowed: true
    }
  ]

  const getPermissionsForRole = () => {
    switch (userRole) {
      case "ADMIN":
        return adminPermissions
      case "MANAGER":
        return managerPermissions
      case "DRIVER":
        return driverPermissions
      case "ACCOUNTANT":
        return accountantPermissions
      case "DISPATCHER":
        return coordinatorPermissions
      case "CUSTOMER":
        return []
      default:
        return []
    }
  }

  const getRoleTitle = () => {
    switch (userRole) {
      case "ADMIN":
        return "Quản trị viên hệ thống"
      case "MANAGER":
        return `Quản lý công ty ${currentCompany}`
      case "DRIVER":
        return "Tài xế"
      case "ACCOUNTANT":
        return "Kế toán"
      case "DISPATCHER":
        return "Người điều phối"
      case "CUSTOMER":
        return "Khách hàng"
      default:
        return "Người dùng"
    }
  }

  const getRoleDescription = () => {
    switch (userRole) {
      case "ADMIN":
        return "Xem toàn bộ hệ thống (chỉ đọc)"
      case "MANAGER":
        return "Quản lý đầy đủ công ty của bạn"
      case "DRIVER":
        return "Xem đơn hàng được giao"
      case "ACCOUNTANT":
        return "Xem báo cáo doanh thu"
      case "DISPATCHER":
        return "Điều phối đơn hàng và tài xế"
      case "CUSTOMER":
        return "Đặt xe và sử dụng dịch vụ"
      default:
        return ""
    }
  }

  const permissions = getPermissionsForRole()

  return (
    <div className="space-y-6">
      {/* Role Information */}
      <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            {getRoleTitle()}
          </CardTitle>
          <CardDescription className="text-yellow-200">
            {getRoleDescription()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Permissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions.map((permission, index) => (
          <Card 
            key={index}
            className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                <permission.icon className="w-6 h-6" />
                {permission.title}
              </CardTitle>
              <CardDescription className="text-yellow-200">
                {permission.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-yellow-200">
                  {permission.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {permission.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      size="sm"
                      variant={action.variant}
                      className={
                        action.variant === "default" 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border-yellow-500/50 text-primary hover:bg-yellow-500/10"
                      }
                    >
                      <action.icon className="w-4 h-4 mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Access Denied for other functions */}
      {userRole === "DRIVER" && (
        <Card className="bg-gradient-to-br from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-red-400 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Không có quyền truy cập
            </CardTitle>
            <CardDescription className="text-red-200">
              Tài xế chỉ có thể xem đơn hàng được giao cho mình
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-red-200">
                Các chức năng sau không khả dụng cho tài xế:
              </p>
              <ul className="text-sm text-gray-600 dark:text-red-200 list-disc list-inside space-y-1">
                <li>Hồ sơ công ty</li>
                <li>Quản lý nhân viên</li>
                <li>Quản lý xe</li>
                <li>Cấu hình dịch vụ</li>
                <li>Báo cáo công ty</li>
                <li>Phản hồi dịch vụ</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {userRole === "ACCOUNTANT" && (
        <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-blue-400 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Quyền hạn giới hạn
            </CardTitle>
            <CardDescription className="text-blue-200">
              Kế toán chỉ có thể xem báo cáo doanh thu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-blue-200">
                Các chức năng sau không khả dụng cho kế toán:
              </p>
              <ul className="text-sm text-gray-600 dark:text-blue-200 list-disc list-inside space-y-1">
                <li>Hồ sơ công ty</li>
                <li>Quản lý nhân viên</li>
                <li>Quản lý xe</li>
                <li>Cấu hình dịch vụ</li>
                <li>Quản lý đơn hàng</li>
                <li>Phản hồi dịch vụ</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
