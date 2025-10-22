"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  Upload,
  Car,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Star
} from "lucide-react"
import type { Driver, City } from "@/lib/types/database"

export default function DriverProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  
  const [formData, setFormData] = useState<Partial<Driver>>({
    driver_id: 1,
    driver_code: "DRV001",
    user_id: 1,
    name: "Nguyễn Văn A",
    address_line: "123 Đường ABC, Quận 1, TP.HCM",
    city_id: 1, 
    phone: "0123-456-789",
    telephone: "028-1234-5678",
    email: "nguyenvana@email.com",
    experience_years: 5,
    avatar_url: "",
    license_number: "123456789",
    license_type: "B2",
    license_expiry: new Date("2029-12-31"),
    vehicle_type: "Sedan",
    vehicle_model: "Toyota Camry 2020",
    vehicle_plate: "51A-12345",
    rating: 4.8,
    total_rides: 1247,
    total_distance: 12500.5,
    is_available: true,
    languages: ["Tiếng Việt", "Tiếng Anh cơ bản"],
    specialties: ["Taxi sân bay", "Taxi nội thành", "Taxi tour"]
  })

  
  const cities: City[] = [
    {
      city_id: 1, state_id: 1, code: "Q1", name: "Quận 1",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 2, state_id: 1, code: "Q2", name: "Quận 2",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 3, state_id: 1, code: "Q3", name: "Quận 3",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 4, state_id: 2, code: "BD", name: "Ba Đình",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 5, state_id: 2, code: "HK", name: "Hoàn Kiếm",
      country_id: 0,
      status: "active"
    }
  ]

  const licenseTypes = [
    { value: "B1", label: "B1" },
    { value: "B2", label: "B2" },
    { value: "C", label: "C" },
    { value: "D", label: "D" }
  ]

  const vehicleTypes = [
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "MPV", label: "MPV" },
    { value: "Hatchback", label: "Hatchback" }
  ]

  const availableLanguages = [
    "Tiếng Việt",
    "Tiếng Anh cơ bản",
    "Tiếng Anh thành thạo",
    "Tiếng Trung cơ bản",
    "Tiếng Nhật cơ bản",
    "Tiếng Hàn cơ bản"
  ]

  const availableSpecialties = [
    "Taxi sân bay",
    "Taxi nội thành",
    "Taxi tour",
    "Taxi theo giờ",
    "Taxi đường dài",
    "Taxi chuyến"
  ]

  const handleInputChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: 'languages' | 'specialties', value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] || []
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        }
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        }
      }
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa hồ sơ tài xế</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin cá nhân theo chuẩn database
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>Đang lưu...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <User className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh đại diện</CardTitle>
          <CardDescription>
            Upload ảnh chân dung để hiển thị trên hồ sơ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={!isEditing}>
                <Upload className="h-4 w-4 mr-2" />
                Upload ảnh mới
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG hoặc GIF. Tối đa 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Thông tin cơ bản về bản thân
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="driver_code">Mã tài xế</Label>
              <Input
                id="driver_code"
                value={formData.driver_code || ""}
                onChange={(e) => handleInputChange("driver_code", e.target.value)}
                disabled={!isEditing}
                placeholder="DRV001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                placeholder="0123-456-789"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Điện thoại bàn</Label>
              <Input
                id="telephone"
                value={formData.telephone || ""}
                onChange={(e) => handleInputChange("telephone", e.target.value)}
                disabled={!isEditing}
                placeholder="028-1234-5678"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city_id">Thành phố *</Label>
              <Select 
                value={formData.city_id?.toString()} 
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("city_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.city_id} value={city.city_id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line">Địa chỉ chi tiết *</Label>
            <Textarea
              id="address_line"
              value={formData.address_line || ""}
              onChange={(e) => handleInputChange("address_line", e.target.value)}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ chi tiết"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chuyên môn</CardTitle>
          <CardDescription>
            Thông tin về kinh nghiệm và kỹ năng lái xe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience_years">Kinh nghiệm lái xe (năm) *</Label>
              <Input
                id="experience_years"
                type="number"
                value={formData.experience_years || ""}
                onChange={(e) => handleInputChange("experience_years", parseInt(e.target.value))}
                disabled={!isEditing}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_number">Số bằng lái *</Label>
              <Input
                id="license_number"
                value={formData.license_number || ""}
                onChange={(e) => handleInputChange("license_number", e.target.value)}
                disabled={!isEditing}
                placeholder="123456789"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="license_type">Loại bằng lái *</Label>
              <Select 
                value={formData.license_type || ""} 
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("license_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại bằng lái" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_expiry">Ngày hết hạn bằng lái *</Label>
              <Input
                id="license_expiry"
                type="date"
                value={formData.license_expiry ? formData.license_expiry.toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("license_expiry", new Date(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin phương tiện</CardTitle>
          <CardDescription>
            Thông tin về xe sử dụng cho dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle_type">Loại xe *</Label>
              <Select 
                value={formData.vehicle_type || ""} 
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("vehicle_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại xe" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle_model">Mẫu xe *</Label>
              <Input
                id="vehicle_model"
                value={formData.vehicle_model || ""}
                onChange={(e) => handleInputChange("vehicle_model", e.target.value)}
                disabled={!isEditing}
                placeholder="Toyota Camry 2020"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle_plate">Biển số xe *</Label>
            <Input
              id="vehicle_plate"
              value={formData.vehicle_plate || ""}
              onChange={(e) => handleInputChange("vehicle_plate", e.target.value)}
              disabled={!isEditing}
              placeholder="51A-12345"
            />
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Kỹ năng và chuyên môn</CardTitle>
          <CardDescription>
            Các kỹ năng và dịch vụ bạn có thể cung cấp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Ngôn ngữ</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {availableLanguages.map((lang) => (
                <div key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`lang-${lang}`}
                    checked={formData.languages?.includes(lang) || false}
                    onChange={(e) => handleArrayChange("languages", lang, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`lang-${lang}`} className="text-sm">{lang}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Chuyên môn</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {availableSpecialties.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`spec-${specialty}`}
                    checked={formData.specialties?.includes(specialty) || false}
                    onChange={(e) => handleArrayChange("specialties", specialty, e.target.checked)}
                    disabled={!isEditing}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`spec-${specialty}`} className="text-sm">{specialty}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê hiệu suất</CardTitle>
          <CardDescription>
            Thông tin về hiệu suất làm việc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.rating}/5.0</div>
              <div className="text-sm text-muted-foreground">Đánh giá trung bình</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Car className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.total_rides}</div>
              <div className="text-sm text-muted-foreground">Tổng chuyến đi</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{formData.total_distance}km</div>
              <div className="text-sm text-muted-foreground">Tổng quãng đường</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái hồ sơ</CardTitle>
          <CardDescription>
            Thông tin về trạng thái hiển thị hồ sơ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {formData.is_available ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h4 className="font-medium">
                  {formData.is_available ? 'Đang sẵn sàng nhận chuyến' : 'Tạm dừng hoạt động'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.is_available 
                    ? 'Hồ sơ của bạn đang được hiển thị và có thể nhận chuyến'
                    : 'Hồ sơ của bạn tạm thời không nhận chuyến mới'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={formData.is_available ? "default" : "secondary"}
              className={formData.is_available ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {formData.is_available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

