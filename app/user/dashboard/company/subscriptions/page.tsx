"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  CreditCard, 
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Plus,
  Settings,
  Receipt
} from "lucide-react"
// Local type definitions (replace the missing import)
type SubscriptionStatus = 1 | 2 | 3 | 4

type Plan = {
  plan_id: number
  name: string
  price: number
  description?: string
}

type Subscription = {
  subscription_id: number
  plan_id: number
  status_id: SubscriptionStatus
  start_date: Date
  end_date: Date
  created_at: Date
  updated_at: Date
}

export default function CompanySubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isNewSubscriptionOpen, setIsNewSubscriptionOpen] = useState(false)

  
  const mockSubscriptions: Subscription[] = [
    {
      subscription_id: 1,
      plan_id: 1,
      status_id: 2, 
      start_date: new Date("2024-12-01"),
      end_date: new Date("2025-01-01"),
      created_at: new Date("2024-12-01T10:00:00"),
      updated_at: new Date("2024-12-15T14:30:00")
    },
    {
      subscription_id: 2,
      plan_id: 2,
      status_id: 1, 
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-02-01"),
      created_at: new Date("2024-12-20T15:45:00"),
      updated_at: new Date("2024-12-20T15:45:00")
    },
    {
      subscription_id: 3,
      plan_id: 3,
      status_id: 4, 
      start_date: new Date("2024-11-01"),
      end_date: new Date("2024-12-01"),
      created_at: new Date("2024-11-01T08:00:00"),
      updated_at: new Date("2024-11-15T09:20:00")
    }
  ]

  
  const mockPlans = [
    { plan_id: 1, name: "Basic Monthly", price: 2500000, description: "Gói cơ bản hàng tháng" },
    { plan_id: 2, name: "Premium Monthly", price: 3500000, description: "Gói cao cấp hàng tháng" },
    { plan_id: 3, name: "Basic Quarterly", price: 1500000, description: "Gói cơ bản 3 tháng" },
    { plan_id: 4, name: "Premium Quarterly", price: 2500000, description: "Gói cao cấp 3 tháng" },
    { plan_id: 5, name: "Enterprise Yearly", price: 8000000, description: "Gói doanh nghiệp hàng năm" }
  ]

  useEffect(() => {
    
    const fetchSubscriptions = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubscriptions(mockSubscriptions)
      setLoading(false)
    }
    fetchSubscriptions()
  }, [])

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1: 
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 2: 
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case 3: 
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Expired</Badge>
      case 4: 
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" /> Canceled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPlanName = (planId: number) => {
    const plan = mockPlans.find(p => p.plan_id === planId)
    return plan ? plan.name : "Unknown Plan"
  }

  const getPlanPrice = (planId: number) => {
    const plan = mockPlans.find(p => p.plan_id === planId)
    return plan ? plan.price : 0
  }

  const calculateDaysRemaining = (endDate: Date) => {
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsDialogOpen(true)
  }

  const handleCancelSubscription = (subscriptionId: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy đăng ký này?")) {
      setSubscriptions(prev => prev.map(sub => 
        sub.subscription_id === subscriptionId 
          ? { 
              ...sub, 
              status_id: 4, 
              updated_at: new Date()
            }
          : sub
      ))
    }
  }

  const handleRenewSubscription = (subscriptionId: number) => {
    if (confirm("Bạn có chắc chắn muốn gia hạn đăng ký này?")) {
      setSubscriptions(prev => prev.map(sub => 
        sub.subscription_id === subscriptionId 
          ? { 
              ...sub, 
              status_id: 2, 
              end_date: new Date(sub.end_date.getTime() + 30 * 24 * 60 * 60 * 1000), 
              updated_at: new Date()
            }
          : sub
      ))
    }
  }

  const activeSubscriptions = subscriptions.filter(sub => sub.status_id === 2)
  const pendingSubscriptions = subscriptions.filter(sub => sub.status_id === 1)
  const cancelledSubscriptions = subscriptions.filter(sub => sub.status_id === 4)

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
          <h1 className="text-3xl font-bold text-foreground">Quản lý Đăng ký</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và quản lý các gói đăng ký dịch vụ
          </p>
        </div>
        <Button onClick={() => setIsNewSubscriptionOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Đăng ký gói mới
        </Button>
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Gói đang sử dụng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Tất cả gói đăng ký
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hủy</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledSubscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Gói đã hủy
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Đăng ký</CardTitle>
          <CardDescription>
            {subscriptions.length} gói đăng ký được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const daysRemaining = calculateDaysRemaining(subscription.end_date)
              const planName = getPlanName(subscription.plan_id)
              
              return (
                <div key={subscription.subscription_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{planName}</h3>
                        {getStatusBadge(subscription.status_id)}
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Thời hạn:</span>
                          </div>
                          <div className="text-muted-foreground">
                            {subscription.start_date.toLocaleDateString('vi-VN')} - {subscription.end_date.toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Còn lại:</span>
                          </div>
                          <div className="text-muted-foreground">
                            {daysRemaining > 0 ? `${daysRemaining} ngày` : 'Đã hết hạn'}
                          </div>
                        </div>
                      </div>
                      
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        Tạo lúc: {subscription.created_at.toLocaleString('vi-VN')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubscription(subscription)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      {subscription.status_id === 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(subscription.subscription_id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {subscription.status_id === 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRenewSubscription(subscription.subscription_id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Đăng ký</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về gói đăng ký
            </DialogDescription>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gói dịch vụ</Label>
                  <Input value={getPlanName(selectedSubscription.plan_id)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>ID Đăng ký</Label>
                  <Input value={selectedSubscription.subscription_id.toString()} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Ngày bắt đầu</Label>
                  <Input value={selectedSubscription.start_date.toLocaleDateString('vi-VN')} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Ngày kết thúc</Label>
                  <Input value={selectedSubscription.end_date.toLocaleDateString('vi-VN')} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedSubscription.status_id)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>ID Gói</Label>
                  <Input value={selectedSubscription.plan_id.toString()} disabled />
                </div>
              </div>
              

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Đóng
                </Button>
                {selectedSubscription.status_id === 2 && (
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelSubscription(selectedSubscription.subscription_id)}
                  >
                    Hủy đăng ký
                  </Button>
                )}
                {selectedSubscription.status_id === 1 && (
                  <Button onClick={() => handleRenewSubscription(selectedSubscription.subscription_id)}>
                    Gia hạn ngay
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={isNewSubscriptionOpen} onOpenChange={setIsNewSubscriptionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Đăng ký Gói mới</DialogTitle>
            <DialogDescription>
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4">
              {mockPlans.map((plan) => (
                <div key={plan.plan_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{plan.price.toLocaleString()} VND</div>
                      <Button size="sm">Chọn gói</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewSubscriptionOpen(false)}>
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

