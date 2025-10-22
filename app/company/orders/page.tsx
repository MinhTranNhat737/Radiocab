"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Clock,
  DollarSign,
  User
} from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useEffect, useState } from "react"

// Mock orders data
const mockOrders = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    pickupAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    dropoffAddress: "456 Lê Lợi, Quận 3, TP.HCM",
    status: "DONE",
    totalAmount: 120000,
    distance: 5.2,
    createdAt: "2024-10-13T08:00:00Z",
    driverName: "Trần Văn B"
  },
  {
    id: 2,
    customerName: "Lê Thị C",
    pickupAddress: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    dropoffAddress: "321 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    status: "ONGOING",
    totalAmount: 140000,
    distance: 8.5,
    createdAt: "2024-10-13T14:00:00Z",
    driverName: "Phạm Văn D"
  },
  {
    id: 3,
    customerName: "Hoàng Văn E",
    pickupAddress: "555 Võ Văn Tần, Quận 3, TP.HCM",
    dropoffAddress: "777 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    status: "NEW",
    totalAmount: 0,
    distance: 0,
    createdAt: "2024-10-13T16:00:00Z",
    driverName: null
  }
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState(mockOrders)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.dropoffAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NEW: { label: "Mới", color: "bg-blue-100 text-blue-800" },
      ASSIGNED: { label: "Đã phân công", color: "bg-yellow-100 text-yellow-800" },
      ONGOING: { label: "Đang thực hiện", color: "bg-orange-100 text-orange-800" },
      DONE: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
      FAILED: { label: "Thất bại", color: "bg-gray-100 text-gray-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: "bg-gray-100 text-gray-800" }
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600 dark:text-yellow-200 mt-2">
            Quản lý và theo dõi đơn hàng taxi
          </p>
        </div>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn hàng
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-r from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-yellow-300">
              {filteredOrders.length} đơn hàng
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-yellow-400">
                      Đơn hàng #{order.id}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-yellow-300">
                      Khách hàng: {order.customerName}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start text-sm text-gray-600 dark:text-yellow-300">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Điểm đón:</p>
                      <p className="text-gray-900 dark:text-yellow-400">{order.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-sm text-gray-600 dark:text-yellow-300">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Điểm đến:</p>
                      <p className="text-gray-900 dark:text-yellow-400">{order.dropoffAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Tạo lúc: {formatDate(order.createdAt)}</span>
                  </div>
                  {order.driverName && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <User className="w-4 h-4 mr-2" />
                      <span>Tài xế: {order.driverName}</span>
                    </div>
                  )}
                  {order.distance > 0 && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Khoảng cách: {order.distance} km</span>
                    </div>
                  )}
                </div>
              </div>
              
              {order.totalAmount > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600 dark:text-yellow-300">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Tổng tiền:</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-yellow-400">
                    {order.totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Xem chi tiết
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Cập nhật
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hủy đơn
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
