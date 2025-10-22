# RadioCabs Backend API

## Tổng quan
Dự án RadioCabs Backend API được xây dựng bằng .NET 9 và PostgreSQL, cung cấp các API endpoints cho hệ thống quản lý taxi.

## Kiến trúc
- **Framework**: .NET 9
- **Database**: PostgreSQL
- **ORM**: Entity Framework Core
- **Pattern**: Repository Pattern + Unit of Work
- **API**: RESTful API với Swagger documentation

## Cấu trúc dự án

```
RadioCabs_BE/
├── Controllers/          # API Controllers
│   ├── Api/v1/          # Version 1 API endpoints
│   └── HealthController.cs
├── Data/                # Database context và configuration
├── DTOs/                # Data Transfer Objects
├── Models/              # Entity models
├── Repositories/        # Repository pattern implementation
├── Services/            # Business logic services
└── Program.cs           # Application startup configuration
```

## Models chính

### Core Entities
- **Account**: Quản lý tài khoản người dùng (admin, driver, customer)
- **Company**: Thông tin công ty taxi
- **Vehicle**: Thông tin xe
- **VehicleModel**: Model xe
- **VehicleSegment**: Phân khúc xe

### Business Entities
- **DrivingOrder**: Đơn hàng đi xe
- **DriverSchedule**: Lịch trình tài xế
- **MembershipOrder**: Đơn hàng thành viên
- **ModelPriceProvince**: Giá cước theo tỉnh

### Location Entities
- **Province**: Tỉnh/thành phố
- **Ward**: Phường/xã
- **Zone**: Khu vực hoạt động

## API Endpoints

### Accounts
- `GET /api/v1/accounts` - Lấy danh sách tài khoản
- `GET /api/v1/accounts/{id}` - Lấy thông tin tài khoản
- `POST /api/v1/accounts` - Tạo tài khoản mới
- `PUT /api/v1/accounts/{id}` - Cập nhật tài khoản
- `POST /api/v1/accounts/login` - Đăng nhập

### Companies
- `GET /api/v1/companies` - Lấy danh sách công ty
- `GET /api/v1/companies/{id}` - Lấy thông tin công ty
- `POST /api/v1/companies` - Tạo công ty mới
- `PUT /api/v1/companies/{id}` - Cập nhật công ty

### Vehicles
- `GET /api/v1/vehicles` - Lấy danh sách xe
- `GET /api/v1/vehicles/{id}` - Lấy thông tin xe
- `POST /api/v1/vehicles` - Tạo xe mới
- `PUT /api/v1/vehicles/{id}` - Cập nhật xe
- `GET /api/v1/vehicles/models` - Lấy danh sách model xe
- `GET /api/v1/vehicles/segments` - Lấy danh sách phân khúc xe

### Driving Orders
- `GET /api/v1/drivingorders` - Lấy danh sách đơn hàng
- `GET /api/v1/drivingorders/{id}` - Lấy thông tin đơn hàng
- `POST /api/v1/drivingorders` - Tạo đơn hàng mới
- `PUT /api/v1/drivingorders/{id}` - Cập nhật đơn hàng
- `POST /api/v1/drivingorders/{id}/assign-driver` - Phân công tài xế
- `POST /api/v1/drivingorders/{id}/complete` - Hoàn thành đơn hàng

## Cài đặt và chạy

### Yêu cầu
- .NET 9 SDK
- PostgreSQL 12+
- Visual Studio 2022 hoặc VS Code

### Cài đặt
1. Clone repository
2. Cập nhật connection string trong `appsettings.json`
3. Chạy migrations để tạo database schema
4. Chạy script `Data/SampleData.sql` để thêm dữ liệu mẫu

### Chạy ứng dụng
```bash
dotnet run
```

Ứng dụng sẽ chạy tại: `https://localhost:7000` hoặc `http://localhost:5000`

Swagger UI: `https://localhost:7000/swagger`

## Database Schema

Database sử dụng PostgreSQL với các enum types:
- `role_type`: ADMIN, MANAGER, ACCOUNTANT, DISPATCHER, DRIVER, CUSTOMER
- `active_flag`: ACTIVE, INACTIVE
- `order_status`: NEW, ASSIGNED, ONGOING, DONE, CANCELLED, FAILED
- `payment_method`: CASH, CARD, WALLET, BANK
- `fuel_type_enum`: GASOLINE, DIESEL, EV, HYBRID
- `vehicle_category_enum`: HATCHBACK_5, SEDAN_5, SUV_5, SUV_7, MPV_7
- `shift_status`: PLANNED, ON, OFF, CANCELLED, COMPLETED

## Tính năng chính

### Quản lý tài khoản
- Đăng ký, đăng nhập
- Phân quyền theo role
- Xác thực email
- Quản lý session

### Quản lý xe và tài xế
- Quản lý thông tin xe
- Phân công tài xế cho xe
- Lịch trình làm việc
- Theo dõi vị trí và trạng thái

### Quản lý đơn hàng
- Tạo đơn hàng mới
- Tính toán giá cước tự động
- Phân công tài xế
- Theo dõi trạng thái đơn hàng
- Thanh toán

### Quản lý giá cước
- Cấu hình giá theo tỉnh
- Giá theo thời gian
- Phụ thu theo điều kiện (mưa, kẹt xe)

## Dữ liệu mẫu

Script `Data/SampleData.sql` cung cấp:
- 3 công ty taxi mẫu
- 5 tỉnh/thành phố
- Tài khoản admin và driver
- Xe và model xe mẫu
- Đơn hàng mẫu

## API Documentation

Swagger UI cung cấp documentation đầy đủ cho tất cả API endpoints tại `/swagger` khi chạy ứng dụng trong môi trường Development.

## Health Check

Endpoint `/health` cung cấp thông tin trạng thái ứng dụng và kết nối database.

## Cấu hình

Các cấu hình chính trong `appsettings.json`:
- Connection string cho PostgreSQL
- CORS settings
- Logging configuration
- Health check settings





