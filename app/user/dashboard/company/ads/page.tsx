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
  Megaphone, 
  Search, 
  Filter, 
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Target,
  MousePointer,
  Users
} from "lucide-react"
import type { Advertisement, AdStatus } from "@/lib/types/database"

export default function CompanyAdsPage() {
  const [ads, setAds] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [placementFilter, setPlacementFilter] = useState("all")
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // Mock data - sẽ được thay thế bằng API calls
  const mockAds: Advertisement[] = [
    {
      ad_id: 1,
      company_id: 1,
      title: "Airport Flat Fare",
      description: "Special airport fares all week",
      status_id: 2, // active
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-12-31"),
      created_at: new Date("2024-11-25"),
      updated_at: new Date("2024-12-20")
    },
    {
      ad_id: 2,
      company_id: 1,
      title: "Delhi Monsoon Offer",
      description: "20% off for online booking",
      status_id: 2, // active
      start_date: new Date("2025-07-01"),
      end_date: new Date("2025-09-30"),
      created_at: new Date("2024-12-20"),
      updated_at: new Date("2024-12-20")
    },
    {
      ad_id: 3,
      company_id: 1,
      title: "Hyderabad Night Saver",
      description: "Night rides discount",
      status_id: 1, // draft
      start_date: undefined,
      end_date: undefined,
      created_at: new Date("2024-12-10"),
      updated_at: new Date("2024-12-22")
    },
    {
      ad_id: 4,
      company_id: 1,
      title: "Pink City Fest",
      description: "Festival season promo",
      status_id: 2, // active
      start_date: new Date("2025-08-15"),
      end_date: new Date("2025-10-31"),
      created_at: new Date("2024-12-15"),
      updated_at: new Date("2024-12-22")
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchAds = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAds(mockAds)
      setLoading(false)
    }
    fetchAds()
  }, [])

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1: // draft
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>
      case 2: // active
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 3: // paused
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Paused</Badge>
      case 4: // expired
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Remove placement and ROI functions as they're not in the database schema

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || ad.status_id.toString() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (adId: number, newStatusId: number) => {
    setAds(prev => prev.map(ad => 
      ad.ad_id === adId 
        ? { ...ad, status_id: newStatusId, updated_at: new Date() }
        : ad
    ))
  }

  const handleEditAd = (ad: Advertisement) => {
    setSelectedAd(ad)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleViewAd = (ad: Advertisement) => {
    setSelectedAd(ad)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleDeleteAd = (adId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa quảng cáo này?")) {
      setAds(prev => prev.filter(ad => ad.ad_id !== adId))
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
          <h1 className="text-3xl font-bold text-foreground">Quản lý Quảng cáo</h1>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý các chiến dịch quảng cáo
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo quảng cáo mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng quảng cáo</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 quảng cáo mới
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter(ad => ad.status_id === 2).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Quảng cáo hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nháp</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter(ad => ad.status_id === 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Chưa xuất bản
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ads.filter(ad => ad.status_id === 4).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Quảng cáo hết hạn
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
                  placeholder="Tìm theo tiêu đề, mô tả..."
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
                  <SelectItem value="1">Draft</SelectItem>
                  <SelectItem value="2">Active</SelectItem>
                  <SelectItem value="3">Paused</SelectItem>
                  <SelectItem value="4">Expired</SelectItem>
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

      {/* Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Quảng cáo</CardTitle>
          <CardDescription>
            {filteredAds.length} quảng cáo được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAds.map((ad) => (
              <div key={ad.ad_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{ad.title}</h3>
                      {getStatusBadge(ad.status_id)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{ad.description}</p>
                    
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Thời gian:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {ad.start_date ? ad.start_date.toLocaleDateString('vi-VN') : 'Chưa xác định'} - {ad.end_date ? ad.end_date.toLocaleDateString('vi-VN') : 'Không giới hạn'}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Trạng thái:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {getStatusBadge(ad.status_id)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      Tạo lúc: {ad.created_at.toLocaleString('vi-VN')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAd(ad)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAd(ad)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAd(ad.ad_id)}
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

      {/* Ad Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Chỉnh sửa Quảng cáo" : "Chi tiết Quảng cáo"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? "Cập nhật thông tin quảng cáo" : "Xem thông tin chi tiết quảng cáo"}
            </DialogDescription>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    value={selectedAd.title}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={selectedAd.start_date ? selectedAd.start_date.toISOString().split('T')[0] : ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={selectedAd.end_date ? selectedAd.end_date.toISOString().split('T')[0] : ""}
                    disabled={!isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select
                    value={selectedAd.status_id.toString()}
                    disabled={!isEditMode}
                    onValueChange={(value) => handleStatusUpdate(selectedAd.ad_id, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Draft</SelectItem>
                      <SelectItem value="2">Active</SelectItem>
                      <SelectItem value="3">Paused</SelectItem>
                      <SelectItem value="4">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={selectedAd.description}
                  disabled={!isEditMode}
                  rows={3}
                />
              </div>

              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{selectedAd.ad_id}</div>
                  <div className="text-sm text-muted-foreground">ID Quảng cáo</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{selectedAd.company_id}</div>
                  <div className="text-sm text-muted-foreground">ID Công ty</div>
                </div>
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
