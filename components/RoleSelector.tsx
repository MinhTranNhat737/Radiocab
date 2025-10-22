"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  User, 
  Building2, 
  Car, 
  Calculator,
  Navigation,
  CheckCircle,
  Lock
} from "lucide-react"

interface RoleSelectorProps {
  currentRole: "ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER"
  onRoleChange: (role: "ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER") => void
}

export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole)

  const roles = [
    {
      id: "ADMIN",
      name: "Quản trị viên",
      description: "Xem toàn bộ hệ thống (chỉ đọc)",
      icon: Shield,
      color: "from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30",
      permissions: [
        "Xem tất cả công ty",
        "Xem tất cả nhân viên",
        "Xem tất cả xe",
        "Xem tất cả dịch vụ",
        "Xem báo cáo toàn hệ thống",
        "Xem phản hồi (không giải quyết)"
      ]
    },
    {
      id: "MANAGER",
      name: "Quản lý",
      description: "Quản lý đầy đủ công ty của bạn",
      icon: Building2,
      color: "from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30",
      permissions: [
        "Quản lý hồ sơ công ty",
        "Quản lý nhân viên",
        "Quản lý xe",
        "Cấu hình dịch vụ",
        "Quản lý đơn hàng",
        "Xem báo cáo đầy đủ",
        "Giải quyết phản hồi"
      ]
    },
    {
      id: "DRIVER",
      name: "Tài xế",
      description: "Xem đơn hàng được giao",
      icon: Car,
      color: "from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30",
      permissions: [
        "Xem đơn hàng của mình",
        "Cập nhật trạng thái đơn hàng"
      ]
    },
    {
      id: "ACCOUNTANT",
      name: "Kế toán",
      description: "Xem báo cáo doanh thu",
      icon: Calculator,
      color: "from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30",
      permissions: [
        "Xem báo cáo doanh thu",
        "Xuất báo cáo tài chính"
      ]
    },
    {
      id: "DISPATCHER",
      name: "Người điều phối",
      description: "Điều phối đơn hàng và tài xế",
      icon: Navigation,
      color: "from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30",
      permissions: [
        "Xem đơn hàng",
        "Điều phối tài xế",
        "Phân công đơn hàng"
      ]
    },
    {
      id: "CUSTOMER",
      name: "Khách hàng",
      description: "Đặt xe và sử dụng dịch vụ",
      icon: User,
      color: "from-cyan-200/80 to-cyan-300/80 dark:from-cyan-900/20 dark:to-black border-cyan-500/30",
      permissions: [
        "Đặt xe taxi",
        "Xem lịch sử đặt xe",
        "Đánh giá dịch vụ"
      ]
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId as typeof currentRole)
  }

  const handleConfirm = () => {
    onRoleChange(selectedRole)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Chọn vai trò
          </CardTitle>
          <CardDescription className="text-yellow-200">
            Chọn vai trò để xem các chức năng tương ứng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card 
                key={role.id}
                className={`bg-gradient-to-br ${role.color} shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedRole === role.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <role.icon className="w-5 h-5" />
                    {role.name}
                  </CardTitle>
                  <CardDescription className="text-yellow-200">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-yellow-400">Quyền hạn:</p>
                    <ul className="text-xs text-gray-600 dark:text-yellow-200 space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Xác nhận vai trò
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
