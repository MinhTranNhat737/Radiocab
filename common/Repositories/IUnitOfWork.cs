namespace common.Repositories
{
    public interface IUnitOfWork<TContext> : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : class;
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
