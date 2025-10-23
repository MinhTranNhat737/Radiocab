# Hướng dẫn Authentication và Authorization

## Tổng quan

Hệ thống RadioCabs đã được tích hợp authentication và authorization hoàn chỉnh giữa client2 (Next.js) và server (ASP.NET Core).

## Cấu trúc Authentication

### 1. Database Schema
- **account**: Bảng chính chứa thông tin người dùng
- **auth_refresh_session**: Quản lý refresh tokens
- **auth_email_code**: Mã xác thực email
- **company**: Thông tin công ty taxi

### 2. Roles và Permissions

| Role | Mô tả | Quyền truy cập |
|------|-------|---------------|
| **ADMIN** | Quản trị viên hệ thống | Xem toàn bộ hệ thống (chỉ đọc) |
| **MANAGER** | Quản lý công ty | Quản lý đầy đủ công ty |
| **ACCOUNTANT** | Kế toán | Xem báo cáo doanh thu |
| **DISPATCHER** | Điều phối viên | Điều phối đơn hàng |
| **DRIVER** | Tài xế | Xem đơn hàng của mình |
| **CUSTOMER** | Khách hàng | Đặt xe và sử dụng dịch vụ |

## Cách sử dụng

### 1. Đăng nhập

```typescript
import { login } from '@/lib/auth'

// Đăng nhập với API
const user = await login('username', 'password')
```

Hệ thống sẽ:
1. Thử kết nối với API server trước
2. Nếu API không khả dụng, fallback về demo accounts
3. Lưu session vào localStorage
4. Redirect theo role

### 2. Kiểm tra Authentication

```typescript
import { isAuthenticated, getCurrentUser } from '@/lib/auth'

// Kiểm tra đã đăng nhập
if (isAuthenticated()) {
  const user = getCurrentUser()
  console.log(user.role)
}
```

### 3. Role-based Access Control

#### Sử dụng Component Wrapper

```tsx
import { AdminOnly, CompanyStaffOnly, DriverOnly } from '@/components/RoleBasedAccess'

// Chỉ Admin mới truy cập được
<AdminOnly>
  <AdminDashboard />
</AdminOnly>

// Chỉ nhân viên công ty
<CompanyStaffOnly>
  <CompanyPage />
</CompanyStaffOnly>

// Chỉ tài xế
<DriverOnly>
  <DriverDashboard />
</DriverOnly>
```

#### Sử dụng Custom Wrapper

```tsx
import RoleBasedAccess from '@/components/RoleBasedAccess'

<RoleBasedAccess 
  allowedRoles={['ADMIN', 'MANAGER']}
  fallbackPath="/login"
>
  <ProtectedContent />
</RoleBasedAccess>
```

### 4. API Integration

```typescript
import apiService from '@/lib/api'

// Đăng nhập qua API
const response = await apiService.login({
  username: 'admin',
  password: 'password'
})

// Gọi API có authentication
const data = await apiService.get('/accounts')
```

## Cấu hình

### 1. Environment Variables

Tạo file `.env.local` trong client2:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 2. Server Configuration

File `appsettings.json` trong server:

```json
{
  "Jwt": {
    "SecretKey": "RadioCabs_SecretKey_2024_MustBeAtLeast32CharactersLong",
    "Issuer": "RadioCabs",
    "Audience": "RadioCabs",
    "ExpiryHours": 1
  }
}
```

## Flow Authentication

### 1. Login Flow
```
User Input → Client2 → API Service → Server → Database
                ↓
         JWT Token ← Server ← Database Validation
                ↓
         Store in localStorage → Redirect based on role
```

### 2. Protected Route Flow
```
Page Load → RoleBasedAccess Component → Check localStorage
                ↓
         Validate JWT → Check Role → Allow/Redirect
```

### 3. API Call Flow
```
Component → API Service → Add JWT to Header → Server
                ↓
         Validate JWT → Check Permissions → Return Data
```

## Demo Accounts

Hệ thống có sẵn các tài khoản demo:

| Username | Password | Role | Company |
|----------|----------|------|---------|
| admin | Admin@123 | ADMIN | - |
| vinasun | Vinasun@123 | MANAGER | Vinasun Taxi |
| driver001 | Driver001@123 | DRIVER | Vinasun Taxi |
| customer001 | Customer001@123 | CUSTOMER | - |

## Troubleshooting

### 1. API Connection Issues
- Kiểm tra server có chạy không: `http://localhost:5000`
- Kiểm tra CORS configuration
- Kiểm tra environment variables

### 2. Authentication Issues
- Kiểm tra JWT secret key
- Kiểm tra token expiration
- Clear localStorage và thử lại

### 3. Role Access Issues
- Kiểm tra role trong database
- Kiểm tra RoleBasedAccess component
- Kiểm tra redirect logic

## Security Notes

1. **JWT Secret**: Phải đủ mạnh và bảo mật
2. **Token Expiry**: Đặt thời gian hết hạn hợp lý
3. **HTTPS**: Sử dụng HTTPS trong production
4. **Password Hashing**: Sử dụng bcrypt hoặc tương tự
5. **CORS**: Cấu hình CORS chặt chẽ

## Development

### Chạy Server
```bash
cd server/RadioCabs_BE
dotnet run
```

### Chạy Client
```bash
cd client2
npm run dev
```

### Test API
```bash
# Test login
curl -X POST http://localhost:5000/api/v1/accounts/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```
