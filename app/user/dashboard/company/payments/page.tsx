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
  CreditCard, 
  Search, 
  Filter, 
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Receipt,
  Banknote,
  Smartphone
} from "lucide-react"
import type { Payment, PaymentStatus, PaymentMethod } from "@/lib/types/database"

export default function CompanyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data - sẽ được thay thế bằng API calls
  const mockPayments: Payment[] = [
    {
      payment_id: 1,
      subscription_id: 1,
      status_id: 2, // paid
      amount: 2500000,
      currency: "USD",
      method_id: 1, // card
      txn_ref: "TXN123456789",
      paid_at: new Date("2024-12-15T10:30:00"),
      created_at: new Date("2024-12-15T10:30:00")
    },
    {
      payment_id: 2,
      subscription_id: 1,
      status_id: 1, // pending
      amount: 1500000,
      currency: "USD",
      method_id: 2, // bank_transfer
      txn_ref: "TXN123456790",
      paid_at: undefined,
      created_at: new Date("2024-12-20T14:15:00")
    },
    {
      payment_id: 3,
      subscription_id: 2,
      status_id: 3, // failed
      amount: 800000,
      currency: "USD",
      method_id: 3, // wallet
      txn_ref: "TXN123456791",
      paid_at: undefined,
      created_at: new Date("2024-12-18T09:45:00")
    },
    {
      payment_id: 4,
      subscription_id: 1,
      status_id: 4, // refunded
      amount: 500000,
      currency: "USD",
      method_id: 1, // card
      txn_ref: "TXN987654321",
      paid_at: new Date("2024-12-10T16:20:00"),
      created_at: new Date("2024-12-10T16:20:00")
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchPayments = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPayments(mockPayments)
      setLoading(false)
    }
    fetchPayments()
  }, [])

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1: // pending
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 2: // paid
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>
      case 3: // failed
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
      case 4: // refunded
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800"><Receipt className="h-3 w-3 mr-1" /> Refunded</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getMethodIcon = (methodId: number) => {
    switch (methodId) {
      case 1: // card
        return <CreditCard className="h-4 w-4" />
      case 2: // bank_transfer
        return <Banknote className="h-4 w-4" />
      case 3: // wallet
        return <Smartphone className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getMethodName = (methodId: number) => {
    switch (methodId) {
      case 1:
        return "Credit/Debit Card"
      case 2:
        return "Bank Transfer"
      case 3:
        return "Wallet"
      default:
        return "Unknown"
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.txn_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.amount.toString().includes(searchTerm)
    const matchesStatus = statusFilter === "all" || payment.status_id.toString() === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method_id.toString() === methodFilter
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "today" && payment.paid_at && payment.paid_at.toDateString() === new Date().toDateString()) ||
      (dateFilter === "week" && payment.paid_at && payment.paid_at >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && payment.paid_at && payment.paid_at >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    return matchesSearch && matchesStatus && matchesMethod && matchesDate
  })

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsDialogOpen(true)
  }

  const handleRefundPayment = (paymentId: number) => {
    if (confirm("Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?")) {
      // Simulate refund
      setPayments(prev => prev.map(payment => 
        payment.payment_id === paymentId 
          ? { 
              ...payment, 
              status_id: 4 // refunded
            }
          : payment
      ))
    }
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const successfulPayments = payments.filter(payment => payment.status_id === 2).length
  const failedPayments = payments.filter(payment => payment.status_id === 3).length
  const refundedPayments = payments.filter(payment => payment.status_id === 4).length

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
          <h1 className="text-3xl font-bold text-foreground">Lịch sử Thanh toán</h1>
          <p className="text-muted-foreground mt-2">
            Theo dõi và quản lý các giao dịch thanh toán
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Thanh toán mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              Tháng này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số tiền</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()} VND</div>
            <p className="text-xs text-muted-foreground">
              Tổng thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành công</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulPayments}</div>
            <p className="text-xs text-muted-foreground">
              Giao dịch thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn tiền</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{refundedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Giao dịch hoàn tiền
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
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Mã giao dịch, số tiền..."
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
                  <SelectItem value="1">Pending</SelectItem>
                  <SelectItem value="2">Paid</SelectItem>
                  <SelectItem value="3">Failed</SelectItem>
                  <SelectItem value="4">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Phương thức</Label>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="1">Credit/Debit Card</SelectItem>
                  <SelectItem value="2">Bank Transfer</SelectItem>
                  <SelectItem value="3">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Thời gian</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày qua</SelectItem>
                  <SelectItem value="month">30 ngày qua</SelectItem>
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

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Giao dịch</CardTitle>
          <CardDescription>
            {filteredPayments.length} giao dịch được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.payment_id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.method_id)}
                        <span className="font-medium">{payment.txn_ref || `PAY-${payment.payment_id}`}</span>
                      </div>
                      {getStatusBadge(payment.status_id)}
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Số tiền:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Phương thức:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {getMethodName(payment.method_id)}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Ngày giao dịch:</span>
                        </div>
                        <div className="text-muted-foreground">
                          {payment.paid_at ? payment.paid_at.toLocaleString('vi-VN') : 'Chưa thanh toán'}
                        </div>
                      </div>
                      
                      {payment.txn_ref && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Mã giao dịch:</span>
                          </div>
                          <div className="text-muted-foreground font-mono text-xs">
                            {payment.txn_ref}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {payment.status_id === 4 && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <div className="text-sm text-red-800">
                          <span className="font-medium">Đã hoàn tiền:</span> {payment.amount.toLocaleString()} {payment.currency}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Tạo lúc: {payment.created_at.toLocaleString('vi-VN')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPayment(payment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payment.status_id === 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefundPayment(payment.payment_id)}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Giao dịch</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về giao dịch thanh toán
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Mã giao dịch</Label>
                  <Input value={selectedPayment.txn_ref || `PAY-${selectedPayment.payment_id}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>ID Thanh toán</Label>
                  <Input value={selectedPayment.payment_id.toString()} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Số tiền</Label>
                  <Input value={`${selectedPayment.amount.toLocaleString()} ${selectedPayment.currency}`} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phương thức</Label>
                  <Input value={getMethodName(selectedPayment.method_id)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedPayment.status_id)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ngày giao dịch</Label>
                  <Input value={selectedPayment.paid_at ? selectedPayment.paid_at.toLocaleString('vi-VN') : 'Chưa thanh toán'} disabled />
                </div>
              </div>
              
              {selectedPayment.status_id === 4 && (
                <div className="space-y-2">
                  <Label>Thông tin hoàn tiền</Label>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <span className="font-medium">Số tiền hoàn:</span> {selectedPayment.amount.toLocaleString()} {selectedPayment.currency}
                      </div>
                      <div>
                        <span className="font-medium">Trạng thái:</span> Refunded
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Đóng
                </Button>
                {selectedPayment.status_id === 2 && (
                  <Button variant="destructive" onClick={() => handleRefundPayment(selectedPayment.payment_id)}>
                    <Receipt className="h-4 w-4 mr-2" />
                    Hoàn tiền
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
