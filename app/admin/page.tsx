"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/Header"
import {
  Shield,
  Building2,
  Car,
  Megaphone,
  MessageSquare,
  DollarSign,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  LogOut,
} from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const stats = {
    companies: 156,
    drivers: 423,
    advertisements: 89,
    feedback: 234,
    revenue: 45600000,
  }

  const companies = [
    {
      id: "CP001",
      name: "Taxi Mai Linh",
      contact: "Nguyễn Văn A",
      status: "active",
      membership: "Premium",
      payment: "paid",
    },
    {
      id: "CP002",
      name: "Vinasun Taxi",
      contact: "Trần Thị B",
      status: "active",
      membership: "Basic",
      payment: "pending",
    },
    {
      id: "CP003",
      name: "Grab Vietnam",
      contact: "Lê Văn C",
      status: "inactive",
      membership: "Premium",
      payment: "overdue",
    },
  ]

  const drivers = [
    { id: "DR001", name: "Phạm Văn D", city: "TP.HCM", experience: 5, status: "active", payment: "paid" },
    { id: "DR002", name: "Hoàng Thị E", city: "Hà Nội", experience: 3, status: "active", payment: "paid" },
    { id: "DR003", name: "Ngô Văn F", city: "Đà Nẵng", experience: 8, status: "pending", payment: "pending" },
  ]

  const advertisements = [
    {
      id: "AD001",
      company: "Taxi Mai Linh",
      type: "Premium",
      status: "active",
      payment: "paid",
      startDate: "2025-01-01",
    },
    {
      id: "AD002",
      company: "Vinasun Taxi",
      type: "Basic",
      status: "pending",
      payment: "pending",
      startDate: "2025-01-15",
    },
  ]

  const feedback = [
    { id: "FB001", name: "Nguyễn Văn G", type: "complaint", status: "resolved", date: "2025-01-10" },
    { id: "FB002", name: "Trần Thị H", type: "suggestion", status: "pending", date: "2025-01-12" },
    { id: "FB003", name: "Lê Văn I", type: "compliment", status: "resolved", date: "2025-01-14" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
      case "resolved":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Hoạt động</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Chờ duyệt</Badge>
      case "inactive":
      case "overdue":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Không hoạt động</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-black text-yellow-400">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-red-900/20 border border-red-500/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Building2 className="w-4 h-4 mr-2" />
              Công ty
            </TabsTrigger>
            <TabsTrigger value="drivers" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Car className="w-4 h-4 mr-2" />
              Tài xế
            </TabsTrigger>
            <TabsTrigger value="ads" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Megaphone className="w-4 h-4 mr-2" />
              Quảng cáo
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Góp ý
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-red-400">Tổng quan hệ thống</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <Building2 className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{stats.companies}</p>
                    <p className="text-red-300 text-sm">Công ty</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <Car className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{stats.drivers}</p>
                    <p className="text-red-300 text-sm">Tài xế</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <Megaphone className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{stats.advertisements}</p>
                    <p className="text-red-300 text-sm">Quảng cáo</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{stats.feedback}</p>
                    <p className="text-red-300 text-sm">Góp ý</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-400">{(stats.revenue / 1000000).toFixed(1)}M</p>
                    <p className="text-red-300 text-sm">Doanh thu (VNĐ)</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-red-900/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-red-300">Công ty Taxi Mai Linh đã thanh toán phí tháng 1</p>
                        <p className="text-red-400 text-sm">2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-900/10 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-red-300">Tài xế Ngô Văn F đang chờ duyệt</p>
                        <p className="text-red-400 text-sm">5 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-900/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-red-300">Nhận được góp ý mới từ Trần Thị H</p>
                        <p className="text-red-400 text-sm">1 ngày trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-400">Quản lý Công ty</h1>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-4 h-4" />
                    <Input
                      placeholder="Tìm kiếm công ty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/50 border-red-500/50 text-red-100 focus:border-red-400"
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-red-500/30">
                        <TableHead className="text-red-300">Mã công ty</TableHead>
                        <TableHead className="text-red-300">Tên công ty</TableHead>
                        <TableHead className="text-red-300">Người liên hệ</TableHead>
                        <TableHead className="text-red-300">Loại thành viên</TableHead>
                        <TableHead className="text-red-300">Trạng thái</TableHead>
                        <TableHead className="text-red-300">Thanh toán</TableHead>
                        <TableHead className="text-red-300">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id} className="border-red-500/30">
                          <TableCell className="text-red-200">{company.id}</TableCell>
                          <TableCell className="text-red-200">{company.name}</TableCell>
                          <TableCell className="text-red-200">{company.contact}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                company.membership === "Premium"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }
                            >
                              {company.membership}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(company.status)}</TableCell>
                          <TableCell>{getStatusBadge(company.payment)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-400">Quản lý Tài xế</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm tài xế..."
                    className="pl-10 bg-black/50 border-red-500/50 text-red-100 focus:border-red-400"
                  />
                </div>
              </div>

              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-red-500/30">
                        <TableHead className="text-red-300">Mã tài xế</TableHead>
                        <TableHead className="text-red-300">Họ tên</TableHead>
                        <TableHead className="text-red-300">Thành phố</TableHead>
                        <TableHead className="text-red-300">Kinh nghiệm</TableHead>
                        <TableHead className="text-red-300">Trạng thái</TableHead>
                        <TableHead className="text-red-300">Thanh toán</TableHead>
                        <TableHead className="text-red-300">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
                        <TableRow key={driver.id} className="border-red-500/30">
                          <TableCell className="text-red-200">{driver.id}</TableCell>
                          <TableCell className="text-red-200">{driver.name}</TableCell>
                          <TableCell className="text-red-200">{driver.city}</TableCell>
                          <TableCell className="text-red-200">{driver.experience} năm</TableCell>
                          <TableCell>{getStatusBadge(driver.status)}</TableCell>
                          <TableCell>{getStatusBadge(driver.payment)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advertisements Tab */}
          <TabsContent value="ads">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-400">Quản lý Quảng cáo</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm quảng cáo..."
                    className="pl-10 bg-black/50 border-red-500/50 text-red-100 focus:border-red-400"
                  />
                </div>
              </div>

              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-red-500/30">
                        <TableHead className="text-red-300">Mã QC</TableHead>
                        <TableHead className="text-red-300">Công ty</TableHead>
                        <TableHead className="text-red-300">Loại</TableHead>
                        <TableHead className="text-red-300">Ngày bắt đầu</TableHead>
                        <TableHead className="text-red-300">Trạng thái</TableHead>
                        <TableHead className="text-red-300">Thanh toán</TableHead>
                        <TableHead className="text-red-300">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {advertisements.map((ad) => (
                        <TableRow key={ad.id} className="border-red-500/30">
                          <TableCell className="text-red-200">{ad.id}</TableCell>
                          <TableCell className="text-red-200">{ad.company}</TableCell>
                          <TableCell className="text-red-200">{ad.type}</TableCell>
                          <TableCell className="text-red-200">{ad.startDate}</TableCell>
                          <TableCell>{getStatusBadge(ad.status)}</TableCell>
                          <TableCell>{getStatusBadge(ad.payment)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-red-400">Quản lý Góp ý</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-4 h-4" />
                  <Input
                    placeholder="Tìm kiếm góp ý..."
                    className="pl-10 bg-black/50 border-red-500/50 text-red-100 focus:border-red-400"
                  />
                </div>
              </div>

              <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-500/30">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-red-500/30">
                        <TableHead className="text-red-300">Mã góp ý</TableHead>
                        <TableHead className="text-red-300">Người gửi</TableHead>
                        <TableHead className="text-red-300">Loại</TableHead>
                        <TableHead className="text-red-300">Ngày gửi</TableHead>
                        <TableHead className="text-red-300">Trạng thái</TableHead>
                        <TableHead className="text-red-300">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((fb) => (
                        <TableRow key={fb.id} className="border-red-500/30">
                          <TableCell className="text-red-200">{fb.id}</TableCell>
                          <TableCell className="text-red-200">{fb.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                fb.type === "complaint"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : fb.type === "suggestion"
                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                    : "bg-green-500/20 text-green-400 border-green-500/30"
                              }
                            >
                              {fb.type === "complaint"
                                ? "Khiếu nại"
                                : fb.type === "suggestion"
                                  ? "Đề xuất"
                                  : "Khen ngợi"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-red-200">{fb.date}</TableCell>
                          <TableCell>{getStatusBadge(fb.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
