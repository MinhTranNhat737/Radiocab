using Microsoft.EntityFrameworkCore;
using RadioCabs_BE.Repositories;
using Radiocabs_BE.Data;
using System.Linq.Expressions;

namespace RadioCabs_BE.Repositories
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly RadiocabsDbContext _db;
        protected readonly DbSet<TEntity> _set;

        public GenericRepository(RadiocabsDbContext db)
        {
            _db = db;
            _set = db.Set<TEntity>();
        }

        public virtual async Task<TEntity?> GetByIdAsync(object id, CancellationToken ct = default)
            => await _set.FindAsync([id], ct);

        public virtual async Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken ct = default)
            => await _set.AsNoTracking().ToListAsync(ct);

        public virtual async Task<IReadOnlyList<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
            => await _set.AsNoTracking().Where(predicate).ToListAsync(ct);

        public virtual async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default)
            => await _set.AnyAsync(predicate, ct);

        public virtual async Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken ct = default)
            => predicate is null ? await _set.CountAsync(ct) : await _set.CountAsync(predicate, ct);

        public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default)
        {
            await _set.AddAsync(entity, ct);
            return entity;
        }

        public virtual async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default)
            => await _set.AddRangeAsync(entities, ct);

        public virtual void Update(TEntity entity) => _set.Update(entity);
        public virtual void Remove(TEntity entity) => _set.Remove(entity);

        public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);

        public IQueryable<TEntity> Query() => _set.AsQueryable();
    }
}
