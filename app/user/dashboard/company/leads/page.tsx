"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

interface Lead {
  lead_id: number
  company_id: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  service_type: string
  pickup_location?: string
  destination?: string
  pickup_time?: Date
  estimated_fare?: number
  status: 'new' | 'contacted' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  source: string
  priority: 'low' | 'medium' | 'high'
  created_at: Date
  updated_at: Date
}

export default function CompanyLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  
  const mockLeads: Lead[] = [
    {
      lead_id: 1,
      company_id: 1,
      customer_name: "Nguyễn Văn A",
      customer_phone: "0123-456-789",
      customer_email: "nguyenvana@email.com",
      service_type: "Taxi sân bay",
      pickup_location: "Sân bay Tân Sơn Nhất",
      destination: "Quận 1, TP.HCM",
      pickup_time: new Date("2024-12-25T08:00:00"),
      estimated_fare: 150000,
      status: "new",
      notes: "Khách hàng yêu cầu xe 4 chỗ",
      source: "Website",
      priority: "high",
      created_at: new Date("2024-12-20T10:30:00"),
      updated_at: new Date("2024-12-20T10:30:00")
    },
    {
      lead_id: 2,
      company_id: 1,
      customer_name: "Trần Thị B",
      customer_phone: "0987-654-321",
      customer_email: "tranthib@email.com",
      service_type: "Taxi nội thành",
      pickup_location: "Quận 2, TP.HCM",
      destination: "Quận 7, TP.HCM",
      pickup_time: new Date("2024-12-26T14:00:00"),
      estimated_fare: 80000,
      status: "contacted",
      notes: "Khách hàng đã liên hệ, chờ xác nhận",
      source: "Hotline",
      priority: "medium",
      created_at: new Date("2024-12-19T15:45:00"),
      updated_at: new Date("2024-12-20T09:15:00")
    },
    {
      lead_id: 3,
      company_id: 1,
      customer_name: "Lê Văn C",
      customer_phone: "0369-258-147",
      customer_email: "levanc@email.com",
      service_type: "Taxi theo giờ",
      pickup_location: "Quận 3, TP.HCM",
      destination: "Quận 10, TP.HCM",
      pickup_time: new Date("2024-12-27T09:00:00"),
      estimated_fare: 200000,
      status: "confirmed",
      notes: "Khách hàng đã xác nhận, cần chuẩn bị xe",
      source: "App",
      priority: "high",
      created_at: new Date("2024-12-18T11:20:00"),
      updated_at: new Date("2024-12-21T16:30:00")
    }
  ]

  useEffect(() => {
    
    const fetchLeads = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLeads(mockLeads)
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" /> Mới</Badge>
      case "contacted":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Đã liên hệ</Badge>
      case "quoted":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><DollarSign className="h-3 w-3 mr-1" /> Đã báo giá</Badge>
      case "confirmed":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Đã xác nhận</Badge>
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Hoàn thành</Badge>
      case "cancelled":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Cao</Badge>
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Thấp</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.customer_phone.includes(searchTerm) ||
                         lead.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusUpdate = (leadId: number, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.lead_id === leadId 
        ? { ...lead, status: newStatus as any, updated_at: new Date() }
        : lead
    ))
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleDeleteLead = (leadId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa lead này?")) {
      setLeads(prev => prev.filter(lead => lead.lead_id !== leadId))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Leads</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và quản lý các khách hàng tiềm năng
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo Lead mới
        </Button>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads mới</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "new").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý ngay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Đang thực hiện
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.filter(lead => lead.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, SĐT, dịch vụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="contacted">Đã liên hệ</SelectItem>
                  <SelectItem value="quoted">Đã báo giá</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mức độ ưu tiên</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Leads</CardTitle>
          <CardDescription>
            {filteredLeads.length} lead(s) được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.lead_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{lead.customer_name}</h3>
                      {getStatusBadge(lead.status)}
                      {getPriorityBadge(lead.priority)}
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {lead.customer_phone}
                      </div>
                      {lead.customer_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {lead.customer_email}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {lead.service_type}
                      </div>
                      {lead.estimated_fare && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {lead.estimated_fare.toLocaleString()} VND
                        </div>
                      )}
                    </div>
                    {lead.pickup_location && lead.destination && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Tuyến đường:</span> {lead.pickup_location} → {lead.destination}
                      </div>
                    )}
                    {lead.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Ghi chú:</span> {lead.notes}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Tạo lúc: {lead.created_at.toLocaleString('vi-VN')} • Nguồn: {lead.source}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLead(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLead(lead)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLead(lead.lead_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Chỉnh sửa Lead" : "Chi tiết Lead"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Cập nhật thông tin lead" : "Xem thông tin chi tiết lead"}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên khách hàng</Label>
                  <Input
                    value={selectedLead.customer_name}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input
                    value={selectedLead.customer_phone}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={selectedLead.customer_email || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại dịch vụ</Label>
                  <Input
                    value={selectedLead.service_type}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa điểm đón</Label>
                  <Input
                    value={selectedLead.pickup_location || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Địa điểm đến</Label>
                  <Input
                    value={selectedLead.destination || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thời gian đón</Label>
                  <Input
                    type="datetime-local"
                    value={selectedLead.pickup_time ? selectedLead.pickup_time.toISOString().slice(0, 16) : ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giá ước tính</Label>
                  <Input
                    type="number"
                    value={selectedLead.estimated_fare || ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={selectedLead.status}
                    disabled={!isEditMode}
                    onValueChange={(value) => handleStatusUpdate(selectedLead.lead_id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Mới</SelectItem>
                      <SelectItem value="contacted">Đã liên hệ</SelectItem>
                      <SelectItem value="quoted">Đã báo giá</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mức độ ưu tiên</Label>
                  <Select
                    value={selectedLead.priority}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  value={selectedLead.notes || ""}
                  disabled={!isEditMode}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Đóng
                </Button>
                {isEditMode && (
                  <Button>
                    Lưu thay đổi
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

