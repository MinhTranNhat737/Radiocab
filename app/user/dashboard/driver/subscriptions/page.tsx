"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Star,
  DollarSign,
  Shield
} from "lucide-react"

interface Subscription {
  subscription_id: number;
  plan_name: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  price: number;
  duration: number; // months
  features: string[];
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  start_date: Date;
  end_date: Date;
  auto_renew: boolean;
}

export default function DriverSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockSubscriptions: Subscription[] = [
    {
      subscription_id: 1,
      plan_name: "Basic Monthly",
      plan_type: "basic",
      price: 500000,
      duration: 1,
      features: [
        "Hiển thị hồ sơ cơ bản",
        "Ứng tuyển tối đa 5 công ty/tháng",
        "Hỗ trợ email",
        "Báo cáo cơ bản"
      ],
      status: "active",
      start_date: new Date("2024-11-20"),
      end_date: new Date("2024-12-20"),
      auto_renew: true
    },
    {
      subscription_id: 2,
      plan_name: "Premium Monthly",
      plan_type: "premium",
      price: 1500000,
      duration: 1,
      features: [
        "Hiển thị hồ sơ nổi bật",
        "Ứng tuyển không giới hạn",
        "Ưu tiên hiển thị",
        "Hỗ trợ 24/7",
        "Báo cáo chi tiết",
        "Tư vấn nghề nghiệp"
      ],
      status: "pending",
      start_date: new Date("2024-12-21"),
      end_date: new Date("2025-01-21"),
      auto_renew: false
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Đang hoạt động</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Chờ thanh toán</Badge>
      case "expired":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" /> Hết hạn</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "enterprise":
        return "bg-gold-100 text-gold-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gói đăng ký</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các gói đăng ký và thanh toán của bạn
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Gói hiện tại
          </CardTitle>
          <CardDescription>
            Thông tin gói đăng ký đang sử dụng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.filter(sub => sub.status === "active").map((subscription) => (
            <div key={subscription.subscription_id} className="p-6 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{subscription.plan_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {subscription.duration} tháng • Tự động gia hạn: {subscription.auto_renew ? "Có" : "Không"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {subscription.price.toLocaleString()} VND
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Tính năng bao gồm:</h4>
                  <ul className="space-y-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Thông tin thời gian:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bắt đầu:</span>
                      <span>{subscription.start_date.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hết hạn:</span>
                      <span>{subscription.end_date.toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Còn lại:</span>
                      <span className="text-primary font-medium">
                        {Math.ceil((subscription.end_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Gói đăng ký có sẵn</CardTitle>
          <CardDescription>
            Nâng cấp gói để có thêm tính năng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="p-6 border rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Basic</h3>
                <div className="text-3xl font-bold text-primary mt-2">500,000 VND</div>
                <p className="text-sm text-muted-foreground">/tháng</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hiển thị hồ sơ cơ bản
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ứng tuyển tối đa 5 công ty/tháng
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hỗ trợ email
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Báo cáo cơ bản
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Chọn gói này
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="p-6 border rounded-lg border-primary bg-primary/5">
              <div className="text-center mb-4">
                <Badge className="mb-2">Phổ biến</Badge>
                <h3 className="text-xl font-semibold">Premium</h3>
                <div className="text-3xl font-bold text-primary mt-2">1,500,000 VND</div>
                <p className="text-sm text-muted-foreground">/tháng</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hiển thị hồ sơ nổi bật
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ứng tuyển không giới hạn
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Ưu tiên hiển thị
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hỗ trợ 24/7
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Báo cáo chi tiết
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Tư vấn nghề nghiệp
                </li>
              </ul>
              <Button className="w-full">
                Nâng cấp lên Premium
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-6 border rounded-lg">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <div className="text-3xl font-bold text-primary mt-2">3,000,000 VND</div>
                <p className="text-sm text-muted-foreground">/tháng</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Tất cả tính năng Premium
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  API tích hợp
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Hỗ trợ chuyên biệt
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Tùy chỉnh giao diện
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Báo cáo nâng cao
                </li>
                <li className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Đào tạo chuyên sâu
                </li>
              </ul>
              <Button variant="outline" className="w-full">
                Liên hệ để biết thêm
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đăng ký</CardTitle>
          <CardDescription>
            Tất cả các gói đăng ký của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.subscription_id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{subscription.plan_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subscription.start_date.toLocaleDateString('vi-VN')} - {subscription.end_date.toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{subscription.price.toLocaleString()} VND</div>
                    {getStatusBadge(subscription.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


