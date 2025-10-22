"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Edit,
  Shield,
  Bell
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [companySettings, setCompanySettings] = useState({
    name: "Vinasun Taxi",
    email: "info@vinasun.com.vn",
    phone: "028.38.27.27.27",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    taxCode: "0123456789",
    description: "Dịch vụ taxi uy tín hàng đầu Việt Nam",
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      publicProfile: true,
      showRevenue: false,
      showEmployees: true
    }
  })

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const handleSave = () => {
    // Save settings logic here
    setIsEditing(false)
    // Show success message
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Cài đặt công ty
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Quản lý thông tin và cài đặt công ty
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Company Information */}
      <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Thông tin công ty
          </CardTitle>
          <CardDescription className="text-yellow-200">
            Cập nhật thông tin cơ bản của công ty
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
                Tên công ty
              </Label>
              <Input
                id="companyName"
                value={companySettings.name}
                onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                disabled={!isEditing}
                className="bg-white/80 dark:bg-gray-800/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
                Mã số thuế
              </Label>
              <Input
                id="taxCode"
                value={companySettings.taxCode}
                onChange={(e) => setCompanySettings({...companySettings, taxCode: e.target.value})}
                disabled={!isEditing}
                className="bg-white/80 dark:bg-gray-800/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={companySettings.email}
                onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                disabled={!isEditing}
                className="bg-white/80 dark:bg-gray-800/80"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                value={companySettings.phone}
                onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                disabled={!isEditing}
                className="bg-white/80 dark:bg-gray-800/80"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
              Địa chỉ
            </Label>
            <Textarea
              id="address"
              value={companySettings.address}
              onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
              disabled={!isEditing}
              className="bg-white/80 dark:bg-gray-800/80"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-yellow-300">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={companySettings.description}
              onChange={(e) => setCompanySettings({...companySettings, description: e.target.value})}
              disabled={!isEditing}
              className="bg-white/80 dark:bg-gray-800/80"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-blue-400 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Cài đặt thông báo
          </CardTitle>
          <CardDescription className="text-blue-200">
            Quản lý cách nhận thông báo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-blue-300">
                Thông báo qua email
              </Label>
              <p className="text-xs text-gray-600 dark:text-blue-300">
                Nhận thông báo về đơn hàng và báo cáo qua email
              </p>
            </div>
            <Switch
              checked={companySettings.notifications.email}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                notifications: {...companySettings.notifications, email: checked}
              })}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-blue-300">
                Thông báo qua SMS
              </Label>
              <p className="text-xs text-gray-600 dark:text-blue-300">
                Nhận thông báo khẩn cấp qua tin nhắn SMS
              </p>
            </div>
            <Switch
              checked={companySettings.notifications.sms}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                notifications: {...companySettings.notifications, sms: checked}
              })}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-blue-300">
                Thông báo push
              </Label>
              <p className="text-xs text-gray-600 dark:text-blue-300">
                Nhận thông báo trực tiếp trên trình duyệt
              </p>
            </div>
            <Switch
              checked={companySettings.notifications.push}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                notifications: {...companySettings.notifications, push: checked}
              })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900 dark:text-green-400 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Cài đặt bảo mật
          </CardTitle>
          <CardDescription className="text-green-200">
            Quản lý quyền riêng tư và bảo mật
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-green-300">
                Hiển thị hồ sơ công khai
              </Label>
              <p className="text-xs text-gray-600 dark:text-green-300">
                Cho phép khách hàng xem thông tin cơ bản của công ty
              </p>
            </div>
            <Switch
              checked={companySettings.privacy.publicProfile}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                privacy: {...companySettings.privacy, publicProfile: checked}
              })}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-green-300">
                Hiển thị doanh thu
              </Label>
              <p className="text-xs text-gray-600 dark:text-green-300">
                Hiển thị thông tin doanh thu trong báo cáo công khai
              </p>
            </div>
            <Switch
              checked={companySettings.privacy.showRevenue}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                privacy: {...companySettings.privacy, showRevenue: checked}
              })}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700 dark:text-green-300">
                Hiển thị danh sách nhân viên
              </Label>
              <p className="text-xs text-gray-600 dark:text-green-300">
                Cho phép xem danh sách nhân viên công ty
              </p>
            </div>
            <Switch
              checked={companySettings.privacy.showEmployees}
              onCheckedChange={(checked) => setCompanySettings({
                ...companySettings,
                privacy: {...companySettings.privacy, showEmployees: checked}
              })}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
