"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  FileText
} from "lucide-react"

interface JobApplication {
  application_id: number;
  driver_id: number;
  company_id: number;
  company_name: string;
  company_contact: string;
  company_phone: string;
  company_email: string;
  company_address: string;
  position: string;
  salary: number;
  commission_rate: number;
  requirements: string[];
  benefits: string[];
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  applied_date: Date;
  reviewed_date?: Date;
  interview_date?: Date;
  notes?: string;
  response_message?: string;
}

export default function DriverApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewApplicationOpen, setIsNewApplicationOpen] = useState(false)

  // Mock data - sẽ được thay thế bằng API calls
  const mockApplications: JobApplication[] = [
    {
      application_id: 1,
      driver_id: 1,
      company_id: 1,
      company_name: "ABC Taxi Company",
      company_contact: "Nguyễn Văn A",
      company_phone: "0123-456-789",
      company_email: "hr@abctaxi.com",
      company_address: "123 Đường ABC, Quận 1, TP.HCM",
      position: "Tài xế taxi",
      salary: 8000000,
      commission_rate: 15,
      requirements: ["Bằng lái B2", "Kinh nghiệm 2+ năm", "Tiếng Anh cơ bản"],
      benefits: ["Bảo hiểm y tế", "Phụ cấp xăng", "Thưởng doanh số"],
      status: "interviewed",
      applied_date: new Date("2024-12-15"),
      reviewed_date: new Date("2024-12-16"),
      interview_date: new Date("2024-12-20"),
      notes: "Phỏng vấn tốt, chờ kết quả cuối cùng",
      response_message: "Cảm ơn bạn đã tham gia phỏng vấn. Chúng tôi sẽ thông báo kết quả trong 3 ngày tới."
    },
    {
      application_id: 2,
      driver_id: 1,
      company_id: 2,
      company_name: "XYZ Transport",
      company_contact: "Trần Thị B",
      company_phone: "0987-654-321",
      company_email: "careers@xyztransport.com",
      company_address: "456 Đường XYZ, Quận 2, TP.HCM",
      position: "Tài xế xe 7 chỗ",
      salary: 9000000,
      commission_rate: 18,
      requirements: ["Bằng lái B2", "Kinh nghiệm 3+ năm", "Biết đường TP.HCM"],
      benefits: ["Bảo hiểm y tế", "Phụ cấp ăn trưa", "Thưởng tháng"],
      status: "accepted",
      applied_date: new Date("2024-12-10"),
      reviewed_date: new Date("2024-12-12"),
      interview_date: new Date("2024-12-18"),
      notes: "Đã được chấp nhận, bắt đầu làm việc từ 01/01/2025",
      response_message: "Chúc mừng! Bạn đã được chấp nhận vào vị trí tài xế xe 7 chỗ. Vui lòng liên hệ để làm thủ tục nhận việc."
    },
    {
      application_id: 3,
      driver_id: 1,
      company_id: 3,
      company_name: "Green Taxi",
      company_contact: "Lê Văn C",
      company_phone: "0369-258-147",
      company_email: "jobs@greentaxi.com",
      company_address: "789 Đường Green, Quận 3, TP.HCM",
      position: "Tài xế taxi điện",
      salary: 7500000,
      commission_rate: 12,
      requirements: ["Bằng lái B2", "Kinh nghiệm 1+ năm", "Quan tâm môi trường"],
      benefits: ["Bảo hiểm y tế", "Đào tạo lái xe điện", "Thưởng xanh"],
      status: "rejected",
      applied_date: new Date("2024-12-05"),
      reviewed_date: new Date("2024-12-08"),
      notes: "Không đủ kinh nghiệm với xe điện",
      response_message: "Cảm ơn bạn đã quan tâm đến vị trí. Tuy nhiên, chúng tôi đã chọn ứng viên khác phù hợp hơn. Chúc bạn may mắn!"
    },
    {
      application_id: 4,
      driver_id: 1,
      company_id: 4,
      company_name: "Fast Taxi",
      company_contact: "Phạm Thị D",
      company_phone: "0247-135-246",
      company_email: "recruitment@fasttaxi.com",
      company_address: "321 Đường Fast, Quận 7, TP.HCM",
      position: "Tài xế taxi cao cấp",
      salary: 12000000,
      commission_rate: 20,
      requirements: ["Bằng lái B2", "Kinh nghiệm 5+ năm", "Tiếng Anh tốt", "Xe riêng"],
      benefits: ["Bảo hiểm y tế", "Phụ cấp cao", "Thưởng hậu hĩnh", "Nghỉ phép có lương"],
      status: "pending",
      applied_date: new Date("2024-12-22"),
      notes: "Vị trí cao cấp, yêu cầu khắt khe"
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchApplications = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setApplications(mockApplications)
      setLoading(false)
    }
    fetchApplications()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Chờ xem xét</Badge>
      case "reviewed":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Eye className="h-3 w-3 mr-1" /> Đã xem xét</Badge>
      case "interviewed":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><Users className="h-3 w-3 mr-1" /> Đã phỏng vấn</Badge>
      case "accepted":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Được chấp nhận</Badge>
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Bị từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.company_address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || application.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewApplication = (application: JobApplication) => {
    setSelectedApplication(application)
    setIsDialogOpen(true)
  }

  const handleWithdrawApplication = (applicationId: number) => {
    if (confirm("Bạn có chắc chắn muốn rút đơn ứng tuyển này?")) {
      setApplications(prev => prev.filter(app => app.application_id !== applicationId))
    }
  }

  const pendingApplications = applications.filter(app => app.status === "pending")
  const reviewedApplications = applications.filter(app => app.status === "reviewed")
  const acceptedApplications = applications.filter(app => app.status === "accepted")
  const rejectedApplications = applications.filter(app => app.status === "rejected")

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
          <h1 className="text-3xl font-bold text-foreground">Quản lý Ứng tuyển</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và quản lý các đơn ứng tuyển của bạn
          </p>
        </div>
        <Button onClick={() => setIsNewApplicationOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ứng tuyển mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xem xét</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Đơn đang chờ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã xem xét</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Đã được xem xét
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Được chấp nhận</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bị từ chối</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Không thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo công ty, vị trí..."
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
                  <SelectItem value="pending">Chờ xem xét</SelectItem>
                  <SelectItem value="reviewed">Đã xem xét</SelectItem>
                  <SelectItem value="interviewed">Đã phỏng vấn</SelectItem>
                  <SelectItem value="accepted">Được chấp nhận</SelectItem>
                  <SelectItem value="rejected">Bị từ chối</SelectItem>
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

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Ứng tuyển</CardTitle>
          <CardDescription>
            {filteredApplications.length} đơn ứng tuyển được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.application_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{application.company_name}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Vị trí:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.position}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Địa chỉ:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.company_address}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Lương:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.salary.toLocaleString()} VND/tháng
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Ứng tuyển:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {application.applied_date.toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                    
                    {application.notes && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium">Ghi chú:</span> {application.notes}
                      </div>
                    )}
                    
                    {application.response_message && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="text-sm text-blue-800">
                          <span className="font-medium">Phản hồi từ công ty:</span> {application.response_message}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplication(application)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {(application.status === "pending" || application.status === "reviewed") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.application_id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Ứng tuyển</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn ứng tuyển
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Công ty</Label>
                  <Input value={selectedApplication.company_name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Vị trí</Label>
                  <Input value={selectedApplication.position} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Lương</Label>
                  <Input value={`${selectedApplication.salary.toLocaleString()} VND/tháng`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Hoa hồng</Label>
                  <Input value={`${selectedApplication.commission_rate}%`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Người liên hệ</Label>
                  <Input value={selectedApplication.company_contact} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input value={selectedApplication.company_phone} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={selectedApplication.company_email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Địa chỉ công ty</Label>
                <Textarea value={selectedApplication.company_address} disabled rows={2} />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Yêu cầu</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <ul className="space-y-1">
                      {selectedApplication.requirements.map((req, index) => (
                        <li key={index} className="text-sm">• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Phúc lợi</Label>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <ul className="space-y-1">
                      {selectedApplication.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm">• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Ngày ứng tuyển</Label>
                  <Input value={selectedApplication.applied_date.toLocaleDateString('vi-VN')} disabled />
                </div>
                {selectedApplication.reviewed_date && (
                  <div className="space-y-2">
                    <Label>Ngày xem xét</Label>
                    <Input value={selectedApplication.reviewed_date.toLocaleDateString('vi-VN')} disabled />
                  </div>
                )}
                {selectedApplication.interview_date && (
                  <div className="space-y-2">
                    <Label>Ngày phỏng vấn</Label>
                    <Input value={selectedApplication.interview_date.toLocaleDateString('vi-VN')} disabled />
                  </div>
                )}
              </div>
              
              {selectedApplication.notes && (
                <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea value={selectedApplication.notes} disabled rows={3} />
                </div>
              )}
              
              {selectedApplication.response_message && (
                <div className="space-y-2">
                  <Label>Phản hồi từ công ty</Label>
                  <Textarea value={selectedApplication.response_message} disabled rows={3} />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Đóng
                </Button>
                {(selectedApplication.status === "pending" || selectedApplication.status === "reviewed") && (
                  <Button
                    variant="destructive"
                    onClick={() => handleWithdrawApplication(selectedApplication.application_id)}
                  >
                    Rút đơn ứng tuyển
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Application Dialog */}
      <Dialog open={isNewApplicationOpen} onOpenChange={setIsNewApplicationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ứng tuyển mới</DialogTitle>
            <DialogDescription>
              Tìm kiếm và ứng tuyển vào các vị trí phù hợp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tìm kiếm công ty</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên công ty hoặc vị trí..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Khu vực</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q1">Quận 1</SelectItem>
                  <SelectItem value="q2">Quận 2</SelectItem>
                  <SelectItem value="q3">Quận 3</SelectItem>
                  <SelectItem value="q7">Quận 7</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Loại xe</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại xe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="mpv">MPV</SelectItem>
                  <SelectItem value="all">Tất cả</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewApplicationOpen(false)}>
                Hủy
              </Button>
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
