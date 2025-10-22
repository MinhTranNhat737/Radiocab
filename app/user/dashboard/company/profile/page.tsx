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
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  Upload,
  Globe,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import type { Company, City, MembershipType, State, Country } from "@/lib/types/database"

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  
  const [formData, setFormData] = useState<Partial<Company>>({
    company_id: 1,
    company_code: "CAB001",
    name: "ABC Taxi Company",
    contact_person: "Nguyễn Văn A",
    designation: "Giám đốc",
    address_line: "123 Đường ABC, Quận 1, TP.HCM",
    city_id: 1,
    mobile: "0123-456-789",
    telephone: "028-1234-5678",
    fax_number: "028-1234-5679",
    email: "contact@abctaxi.com",
    membership_type_id: 1, 
    owner_user_id: 2,
    status: "active",
    created_at: new Date("2024-03-15"),
    updated_at: new Date("2024-12-20")
  })

  
  const cities: City[] = [
    {
      city_id: 1, state_id: 1, name: "Mumbai",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 2, state_id: 2, name: "New Delhi",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 3, state_id: 3, name: "Bengaluru",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 4, state_id: 4, name: "Chennai",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 5, state_id: 5, name: "Kolkata",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 6, state_id: 6, name: "Hyderabad",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 7, state_id: 1, name: "Pune",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 8, state_id: 8, name: "Jaipur",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 9, state_id: 7, name: "Ahmedabad",
      country_id: 0,
      status: "active"
    },
    {
      city_id: 10, state_id: 1, name: "Nagpur",
      country_id: 0,
      status: "active"
    }
  ]

  
  const membershipTypes: MembershipType[] = [
    {
      membership_type_id: 1, code: "premium", name: "Premium",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    },
    {
      membership_type_id: 2, code: "basic", name: "Basic",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    },
    {
      membership_type_id: 3, code: "free", name: "Free",
      description: "",
      price: 0,
      currency: "",
      features: [],
      status: "active"
    }
  ]

  const handleInputChange = (field: keyof Company, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa hồ sơ công ty</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin công ty theo chuẩn database
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
              <Building2 className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {}
      {formData.status === 'pending' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Hồ sơ đang chờ duyệt</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              Hồ sơ của bạn đang chờ xác minh từ đội ngũ admin. Vui lòng đảm bảo thông tin chính xác và đầy đủ.
            </p>
          </CardContent>
        </Card>
      )}

      {}
      <Card>
        <CardHeader>
          <CardTitle>Logo công ty</CardTitle>
          <CardDescription>
            Upload logo của công ty để hiển thị trên hồ sơ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" disabled={!isEditing}>
                <Upload className="h-4 w-4 mr-2" />
                Upload logo mới
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG hoặc SVG. Tối đa 2MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>
            Thông tin chính về công ty của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_code">Mã công ty</Label>
              <Input
                id="company_code"
                value={formData.company_code || ""}
                onChange={(e) => handleInputChange("company_code", e.target.value)}
                disabled={!isEditing}
                placeholder="ABC001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Tên công ty *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                placeholder="Nhập tên công ty"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Người liên hệ *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person || ""}
                onChange={(e) => handleInputChange("contact_person", e.target.value)}
                disabled={!isEditing}
                placeholder="Nhập tên người liên hệ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Chức vụ</Label>
              <Input
                id="designation"
                value={formData.designation || ""}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                disabled={!isEditing}
                placeholder="Giám đốc, Trưởng phòng..."
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mobile">Số điện thoại di động *</Label>
              <Input
                id="mobile"
                value={formData.mobile || ""}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
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
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax_number">Số fax</Label>
              <Input
                id="fax_number"
                value={formData.fax_number || ""}
                onChange={(e) => handleInputChange("fax_number", e.target.value)}
                disabled={!isEditing}
                placeholder="028-1234-5679"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
            <div className="space-y-2">
              <Label htmlFor="membership_type_id">Loại thành viên</Label>
              <Select 
                value={formData.membership_type_id?.toString()} 
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("membership_type_id", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại thành viên" />
                </SelectTrigger>
                <SelectContent>
                  {membershipTypes.map((type) => (
                    <SelectItem key={type.membership_type_id} value={type.membership_type_id.toString()}>
                      {type.name}
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

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select 
              value={formData.status || ""} 
              disabled={!isEditing}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
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
              {formData.status === 'active' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <div>
                <h4 className="font-medium">
                  {formData.status === 'active' ? 'Hồ sơ đang hoạt động' : 'Hồ sơ chờ xác minh'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {formData.status === 'active' 
                    ? 'Hồ sơ của bạn đang được hiển thị trên website'
                    : 'Hồ sơ của bạn đang được xem xét bởi đội ngũ admin'
                  }
                </p>
              </div>
            </div>
            <Badge 
              variant={formData.status === 'active' ? "default" : "secondary"}
              className={formData.status === 'active' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {formData.status === 'active' ? 'Active' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

