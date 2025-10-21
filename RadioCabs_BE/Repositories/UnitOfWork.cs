using Radiocabs_BE.Data;

namespace RadioCabs_BE.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly RadiocabsDbContext _db;
        public UnitOfWork(RadiocabsDbContext db) => _db = db;
        public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
    }
}
