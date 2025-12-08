using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace common.Repositories
{
    // CHANGED: thêm generic TContext ?? m?i service dùng riêng DbContext c?a nó
    public class UnitOfWork<TContext> : IUnitOfWork<TContext>
        where TContext : DbContext   // CHANGED: gi?i h?n ki?u DbContext
    {
        private readonly TContext _context; // CHANGED: dùng TContext thay vì DbContext
        private IDbContextTransaction? _transaction;

        // danh sách repository ???c cache theo type
        private readonly Dictionary<Type, object> _repositories = new();

        // CHANGED: constructor nh?n TContext thay vì DbContext
        public UnitOfWork(TContext context)
        {
            _context = context;
        }

        // CHANGED: Repository<T> dùng GenericRepository<T, TContext>
        public IGenericRepository<T> Repository<T>() where T : class
        {
            var type = typeof(T);

            if (!_repositories.ContainsKey(type))
            {
                // CHANGED: dùng GenericRepository<T, TContext>
                _repositories[type] = new GenericRepository<T, TContext>(_context);
            }

            return (IGenericRepository<T>)_repositories[type];
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
