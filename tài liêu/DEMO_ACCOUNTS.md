# 🔐 DANH SÁCH TÀI KHOẢN DEMO - RADIOCABS.IN

## 📋 Tổng Quan

Hệ thống đã tạo sẵn **14 tài khoản demo** với 3 vai trò khác nhau:
- **2 tài khoản Admin** (Quản trị viên)
- **5 tài khoản Company** (Công ty taxi)
- **7 tài khoản Driver** (Tài xế)

---

## 👨‍💼 TÀI KHOẢN ADMIN (Quản trị viên)

### Admin 1 - Quản Trị Viên Chính
- **Username:** `admin`
- **Email:** `admin@radiocabs.in`
- **Mật khẩu:** `Admin@123`
- **Họ tên:** Quản Trị Viên
- **Số điện thoại:** 0901234567
- **Quyền:** Quản trị toàn hệ thống

### Admin 2 - Super Admin
- **Username:** `superadmin`
- **Email:** `superadmin@radiocabs.in`
- **Mật khẩu:** `SuperAdmin@2024`
- **Họ tên:** Super Admin
- **Số điện thoại:** 0901234568
- **Quyền:** Quản trị cấp cao nhất

---

## 🏢 TÀI KHOẢN CÔNG TY TAXI

### Công ty 1 - Vinasun Taxi
- **Username:** `vinasun`
- **Email:** `info@vinasun.vn`
- **Mật khẩu:** `Vinasun@123`
- **Người đại diện:** Nguyễn Văn A
- **Số điện thoại:** 0902345678
- **Tên công ty:** Vinasun Taxi

### Công ty 2 - Mai Linh Taxi
- **Username:** `mailinh`
- **Email:** `contact@mailinh.vn`
- **Mật khẩu:** `MaiLinh@123`
- **Người đại diện:** Trần Thị B
- **Số điện thoại:** 0903456789
- **Tên công ty:** Mai Linh Taxi

### Công ty 3 - Saigon Taxi
- **Username:** `saigontaxi`
- **Email:** `info@saigontaxi.vn`
- **Mật khẩu:** `SaigonTaxi@123`
- **Người đại diện:** Lê Văn C
- **Số điện thoại:** 0904567890
- **Tên công ty:** Saigon Taxi

### Công ty 4 - Vina Taxi Group
- **Username:** `vinataxigroup`
- **Email:** `contact@vinataxigroup.vn`
- **Mật khẩu:** `VinaTaxi@123`
- **Người đại diện:** Phạm Thị D
- **Số điện thoại:** 0905678901
- **Tên công ty:** Vina Taxi Group

### Công ty 5 - Green Taxi
- **Username:** `greentaxi`
- **Email:** `hello@greentaxi.vn`
- **Mật khẩu:** `GreenTaxi@123`
- **Người đại diện:** Hoàng Văn E
- **Số điện thoại:** 0906789012
- **Tên công ty:** Green Taxi

---

## 🚗 TÀI KHOẢN TÀI XẾ

### Tài xế 1
- **Username:** `driver001`
- **Email:** `driver001@radiocabs.in`
- **Mật khẩu:** `Driver001@123`
- **Họ tên:** Nguyễn Minh F
- **Số điện thoại:** 0907890123
- **Bằng lái:** B2-123456789

### Tài xế 2
- **Username:** `driver002`
- **Email:** `driver002@radiocabs.in`
- **Mật khẩu:** `Driver002@123`
- **Họ tên:** Trần Văn G
- **Số điện thoại:** 0908901234
- **Bằng lái:** B2-987654321

### Tài xế 3
- **Username:** `driver003`
- **Email:** `driver003@radiocabs.in`
- **Mật khẩu:** `Driver003@123`
- **Họ tên:** Lê Thị H
- **Số điện thoại:** 0909012345
- **Bằng lái:** B2-555666777

### Tài xế 4
- **Username:** `driver004`
- **Email:** `driver004@radiocabs.in`
- **Mật khẩu:** `Driver004@123`
- **Họ tên:** Phạm Văn I
- **Số điện thoại:** 0910123456
- **Bằng lái:** B2-111222333

### Tài xế 5
- **Username:** `driver005`
- **Email:** `driver005@radiocabs.in`
- **Mật khẩu:** `Driver005@123`
- **Họ tên:** Võ Thị K
- **Số điện thoại:** 0911234567
- **Bằng lái:** B2-444555666

### Tài xế 6
- **Username:** `driver006`
- **Email:** `driver006@radiocabs.in`
- **Mật khẩu:** `Driver006@123`
- **Họ tên:** Đặng Văn L
- **Số điện thoại:** 0912345678
- **Bằng lái:** B2-777888999

### Tài xế 7
- **Username:** `driver007`
- **Email:** `driver007@radiocabs.in`
- **Mật khẩu:** `Driver007@123`
- **Họ tên:** Bùi Thị M
- **Số điện thoại:** 0913456789
- **Bằng lái:** B2-123789456

---

## 🔑 HƯỚNG DẪN SỬ DỤNG

### Cách đăng nhập:

1. **Đăng nhập Admin:**
   - Truy cập: http://localhost:3000/login
   - Chọn tab "Quản trị viên"
   - Nhập username hoặc email
   - Nhập mật khẩu
   - Sẽ được chuyển đến: `/admin/dashboard`

2. **Đăng nhập Công ty:**
   - Truy cập: http://localhost:3000/login
   - Chọn tab "Người dùng"
   - Nhập username hoặc email của công ty
   - Nhập mật khẩu
   - Sẽ được chuyển đến: `/user/dashboard/company/profile`

3. **Đăng nhập Tài xế:**
   - Truy cập: http://localhost:3000/login
   - Chọn tab "Người dùng"
   - Nhập username hoặc email của tài xế
   - Nhập mật khẩu
   - Sẽ được chuyển đến: `/user/dashboard/driver/profile`

### Phân quyền:

- **Admin:** Có quyền quản trị toàn bộ hệ thống, duyệt tài khoản, quản lý nội dung
- **Company:** Quản lý thông tin công ty, xem leads, quảng cáo, thanh toán
- **Driver:** Quản lý hồ sơ tài xế, xem đơn ứng tuyển, thanh toán

---

## 📝 LƯU Ý

- Tất cả mật khẩu đều có format: `[Role][ID/Name]@123` hoặc `[Role][ID/Name]@2024`
- Có thể đăng nhập bằng **username** hoặc **email**
- Mật khẩu **phân biệt chữ hoa/thường**
- Dữ liệu được lưu trong **localStorage**
- Đây là **demo accounts**, không kết nối database thật

---

## 🔧 File Source Code

Hệ thống authentication được lưu tại:
- **Auth System:** `lib/auth.ts`
- **Login Page:** `app/login/page.tsx`

---

**Ngày tạo:** 13/10/2025
**Phiên bản:** 1.0
**Tổng số tài khoản:** 14

