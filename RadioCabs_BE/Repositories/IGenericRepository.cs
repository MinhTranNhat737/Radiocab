using System.Linq.Expressions;

namespace RadioCabs_BE.Repositories
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(object id, CancellationToken ct = default);
        Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken ct = default);
        Task<IReadOnlyList<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken ct = default);
        Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken ct = default);

        Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default);
        Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default);
        void Update(TEntity entity);
        void Remove(TEntity entity);

        Task<int> SaveChangesAsync(CancellationToken ct = default);
        IQueryable<TEntity> Query(); // để compose Include/Where ở tầng service
    }
}
