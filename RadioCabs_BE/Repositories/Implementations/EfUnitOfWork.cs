using RadioCabs_BE.Data;

namespace RadioCabs_BE.Repositories.Implementations
{
    public class EfUnitOfWork : IUnitOfWork
    {
        private readonly RadiocabsDbContext _db;
        public EfUnitOfWork(RadiocabsDbContext db) => _db = db;

        public Task<int> SaveChangesAsync(CancellationToken ct = default)
            => _db.SaveChangesAsync(ct);
    }
}
