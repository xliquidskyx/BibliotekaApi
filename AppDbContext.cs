using BibliotekaApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BibliotekaApi
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Ksiazka> Ksiazki { get; set; }
        public DbSet<Autor> Autorzy { get; set; }
        public DbSet<Kopia> Kopie { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ksiazka>()
                .HasOne(b => b.Autor)
                .WithMany(a => a.Ksiazki)
                .HasForeignKey(b => b.AutorId);

            modelBuilder.Entity<Kopia>()
                .HasOne(c => c.Ksiazka)
                .WithMany(b => b.Kopie)
                .HasForeignKey(c => c.KsiazkaId);
        }
    }
}
