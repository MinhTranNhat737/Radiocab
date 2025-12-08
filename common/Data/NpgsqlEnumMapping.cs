using common.Models;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace common.Data
{
    public static class NpgsqlEnumMapping
    {
        public static NpgsqlDbContextOptionsBuilder MapAllEnums(this NpgsqlDbContextOptionsBuilder npgsqlOpt)
        {
            npgsqlOpt.MapEnum<RoleType>("role_type");
            npgsqlOpt.MapEnum<ActiveFlag>("active_flag");
            npgsqlOpt.MapEnum<PaymentMethod>("payment_method");
            npgsqlOpt.MapEnum<OrderStatus>("order_status");
            npgsqlOpt.MapEnum<FuelType>("fuel_type_enum");
            npgsqlOpt.MapEnum<VehicleCategory>("vehicle_category_enum");
            npgsqlOpt.MapEnum<ShiftStatus>("shift_status");
            return npgsqlOpt;
        }
    }

}
