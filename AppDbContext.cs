using Microsoft.EntityFrameworkCore;
using BibliotekaApi.Models;

namespace BibliotekaApi
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Author> Authors { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Copy> Copies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>()
                .HasOne(b => b.Author)
                .WithMany(a => a.Books)
                .HasForeignKey(b => b.AuthorId);

            modelBuilder.Entity<Copy>()
                .HasOne(c => c.Book)
                .WithMany(b => b.Copies)
                .HasForeignKey(c => c.BookId);

            modelBuilder.Entity<Author>()
                .Property(a => a.FirstName)
                .IsRequired();

            modelBuilder.Entity<Author>()
                .Property(a => a.LastName)
                .IsRequired();

            modelBuilder.Entity<Book>()
                .Property(k => k.Title)
                .IsRequired();
        }
    }
}
