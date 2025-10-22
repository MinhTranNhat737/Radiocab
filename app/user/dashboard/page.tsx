import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  User, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Calendar,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import type { CompanyDashboardData, DriverDashboardData, Company, Driver, Subscription, Payment } from "@/lib/types/database"

export default function UserDashboardPage() {
  
  const userRole: 'company' | 'driver' = 'company' // This should be dynamic based on user context
  
  
  const companyData: CompanyDashboardData = {
    company: {
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
    },
    stats: {
      profileViews: 1247,
      totalLeads: 23,
      totalReviews: 15,
      averageRating: 4.8
    },
    subscription: {
      plan: "Premium Monthly",
      nextPayment: "15/01/2025",
      amount: "2,500,000 VND",
      status: "active"
    },
    recentActivity: [
      {
        id: 1,
        type: "lead",
        title: "Lead mới",
        description: "Khách hàng yêu cầu taxi sân bay",
        time: "2 giờ trước",
        status: "new"
      },
      {
        id: 2,
        type: "payment",
        title: "Thanh toán thành công",
        description: "Gói Premium Monthly - Tháng 12/2024",
        time: "1 ngày trước",
        status: "success"
      },
      {
        id: 3,
        type: "review",
        title: "Đánh giá mới",
        description: "Khách hàng đánh giá 5 sao",
        time: "2 ngày trước",
        status: "success"
      }
    ]
  }

  const driverData: DriverDashboardData = {
    driver: {
      driver_id: 1,
      driver_code: "DRV001",
      name: "Nguyễn Văn A",
      contact_person: "Self",
      address_line: "123 Đường XYZ, Quận 1, TP.HCM",
      city_id: 1,
      mobile: "0987-654-321",
      telephone: null,
      email: "nguyenvana@email.com",
      experience_years: 5,
      description: "Tài xế có kinh nghiệm, lái xe an toàn",
      owner_user_id: 3,
      status: "active",
      created_at: new Date("2024-11-20"),
      updated_at: new Date("2024-12-20")
    },
    stats: {
      profileViews: 0,
      totalApplications: 0,
      totalReviews: 0,
      averageRating: 0,
      totalRides: 0
    },
    subscription: {
      plan: "Basic Monthly",
      nextPayment: "20/01/2025",
      amount: "500,000 VND",
      status: "pending"
    },
    recentActivity: [
      {
        id: 1,
        type: "application",
        title: "Ứng tuyển mới",
        description: "Công ty ABC Taxi liên hệ",
        time: "3 giờ trước",
        status: "new"
      },
      {
        id: 2,
        type: "payment",
        title: "Thanh toán thành công",
        description: "Gói Basic Monthly - Tháng 11/2024",
        time: "1 ngày trước",
        status: "success"
      }
    ]
  }

  const currentData: CompanyDashboardData = companyData

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "suspended":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" /> Suspended</Badge>
      case "draft":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>
      case "deleted":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const recentActivity = currentData.recentActivity

  return (
    <div className="space-y-8 page-enter">
      <div className="fade-in-scale">
        <h1 className="text-3xl font-bold text-foreground">
          {userRole === 'company' ? 'Company' : 'Driver'} Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý {userRole === 'company' ? 'công ty' : 'hồ sơ tài xế'} của bạn
        </p>
      </div>

      {}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {userRole === 'company' ? (
                  <Building2 className="h-6 w-6 text-primary" />
                ) : (
                  <User className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">                  {currentData.company.name}
                </CardTitle>
                <CardDescription>
                  Mã công ty: {currentData.company.company_code} • Thành viên từ {currentData.company.created_at.toLocaleDateString('vi-VN')}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(currentData.company.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <span>{currentData.company.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Liên hệ:</span>
                <span>{currentData.company.contact_person}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">Địa chỉ:</span>
                <span>{currentData.company.address_line}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Đánh giá:</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{currentData.stats.averageRating}/5.0</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem hồ sơ</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.profileViews}</div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'company' ? 'Lượt xem hồ sơ công ty' : 'Lượt xem hồ sơ tài xế'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === 'company' ? 'Leads mới' : 'Ứng tuyển'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentData.stats.totalLeads}
            </div>
            <p className="text-xs text-muted-foreground">
              {userRole === 'company' ? 'Khách hàng tiềm năng' : 'Đơn ứng tuyển'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số đánh giá nhận được
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thanh toán tiếp theo</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData.subscription.amount}</div>
            <p className="text-xs text-muted-foreground">
              Hạn thanh toán: {currentData.subscription.nextPayment}
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trạng thái đăng ký</CardTitle>
            <Link href={`/user/dashboard/${userRole}/subscriptions`}>
              <Button variant="outline" size="sm">
                Xem chi tiết
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <h4 className="font-medium">{currentData.subscription.plan}</h4>
              <p className="text-sm text-muted-foreground">
                Thanh toán tiếp theo: {currentData.subscription.nextPayment}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{currentData.subscription.amount}</div>
              {getStatusBadge(currentData.subscription.status)}
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>
            Lịch sử các thao tác của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border">
                <div className={`p-2 rounded-full ${
                  activity.status === "success" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {activity.type === "payment" ? (
                    <CreditCard className="h-4 w-4" />
                  ) : activity.type === "lead" ? (
                    <Users className="h-4 w-4" />
                  ) : activity.type === "review" ? (
                    <Star className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Truy cập nhanh các chức năng chính
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Link href={`/user/dashboard/${userRole}/profile`}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                {userRole === 'company' ? (
                  <>
                    <Building2 className="h-6 w-6" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </>
                ) : (
                  <>
                    <User className="h-6 w-6" />
                    <span>Chỉnh sửa hồ sơ</span>
                  </>
                )}
              </Button>
            </Link>
            
            {userRole === 'company' ? (
              <Link href="/user/dashboard/company/leads">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Quản lý Leads</span>
                </Button>
              </Link>
            ) : (
              <Link href="/user/dashboard/driver/applications">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Ứng tuyển</span>
                </Button>
              </Link>
            )}

            <Link href={`/user/dashboard/${userRole}/payments`}>
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <CreditCard className="h-6 w-6" />
                <span>Thanh toán</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

