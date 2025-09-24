import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Users, 
  Megaphone, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Activity
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  // Mock data - sẽ được thay thế bằng API calls
  const stats = {
    totalCompanies: 156,
    totalDrivers: 1247,
    totalAds: 89,
    totalRevenue: 24500000,
    activeSubscriptions: 234,
    pendingApprovals: 12
  }

  const recentCompanies = [
    {
      id: 1,
      name: "ABC Taxi Company",
      contact: "Nguyễn Văn A",
      email: "contact@abctaxi.com",
      status: "active",
      joinDate: "15/03/2024",
      membershipType: "Premium"
    },
    {
      id: 2,
      name: "XYZ Transport",
      contact: "Trần Thị B",
      email: "info@xyztransport.com",
      status: "pending",
      joinDate: "20/11/2024",
      membershipType: "Basic"
    },
    {
      id: 3,
      name: "Green Taxi",
      contact: "Lê Văn C",
      email: "hello@greentaxi.com",
      status: "active",
      joinDate: "10/10/2024",
      membershipType: "Enterprise"
    }
  ]

  const recentDrivers = [
    {
      id: 1,
      name: "Nguyễn Văn D",
      email: "nguyenvand@email.com",
      phone: "0123-456-789",
      city: "TP. Hồ Chí Minh",
      status: "pending",
      rating: 4.8,
      totalRides: 1247
    },
    {
      id: 2,
      name: "Trần Thị E",
      email: "tranthie@email.com",
      phone: "0987-654-321",
      city: "Hà Nội",
      status: "active",
      rating: 4.9,
      totalRides: 892
    }
  ]

  const recentAds = [
    {
      id: 1,
      title: "Banner trang chủ",
      company: "ABC Taxi Company",
      type: "Banner",
      status: "active",
      budget: 5000000,
      spent: 3200000,
      startDate: "01/12/2024",
      endDate: "31/12/2024"
    },
    {
      id: 2,
      title: "Quảng cáo sidebar",
      company: "XYZ Transport",
      type: "Sidebar",
      status: "pending",
      budget: 3000000,
      spent: 0,
      startDate: "01/01/2025",
      endDate: "31/01/2025"
    }
  ]

  const systemHealth = {
    databaseStatus: "healthy" as const,
    apiResponseTime: 120,
    activeUsers: 89,
    serverLoad: 45
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case "suspended":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" /> Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getHealthStatus = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Healthy</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" /> Warning</Badge>
      case "error":
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" /> Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan hệ thống và quản lý
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công ty</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tài xế</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quảng cáo</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAds}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} VND</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +22% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Pending Approvals */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              System Health
            </CardTitle>
            <CardDescription>
              Trạng thái hệ thống hiện tại
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              {getHealthStatus(systemHealth.databaseStatus)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Response Time</span>
              <span className="text-sm">{systemHealth.apiResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Users</span>
              <span className="text-sm">{systemHealth.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Server Load</span>
              <span className="text-sm">{systemHealth.serverLoad}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              Các yêu cầu chờ duyệt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Companies</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {stats.pendingApprovals}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Drivers</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                8
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Advertisements</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                3
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reviews</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                5
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Công ty gần đây</CardTitle>
              <Link href="/admin/dashboard/companies">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{company.name}</h4>
                    <p className="text-xs text-muted-foreground">{company.contact}</p>
                    <p className="text-xs text-muted-foreground">{company.email}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(company.status)}
                    <p className="text-xs text-muted-foreground mt-1">{company.joinDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Drivers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tài xế gần đây</CardTitle>
              <Link href="/admin/dashboard/drivers">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{driver.name}</h4>
                    <p className="text-xs text-muted-foreground">{driver.city}</p>
                    <p className="text-xs text-muted-foreground">⭐ {driver.rating} • {driver.totalRides} rides</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(driver.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Ads */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Quảng cáo gần đây</CardTitle>
              <Link href="/admin/dashboard/ads">
                <Button variant="outline" size="sm">Xem tất cả</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAds.map((ad) => (
                <div key={ad.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{ad.title}</h4>
                    <p className="text-xs text-muted-foreground">{ad.company}</p>
                    <p className="text-xs text-muted-foreground">{ad.spent.toLocaleString()} / {ad.budget.toLocaleString()} VND</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(ad.status)}
                    <p className="text-xs text-muted-foreground mt-1">{ad.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>
            Các chức năng quản lý chính
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/admin/dashboard/companies">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Building2 className="h-6 w-6" />
                <span>Quản lý công ty</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/drivers">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Quản lý tài xế</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/ads">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Megaphone className="h-6 w-6" />
                <span>Quản lý quảng cáo</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>Báo cáo & Thống kê</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
