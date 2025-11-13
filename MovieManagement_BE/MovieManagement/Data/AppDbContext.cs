using Microsoft.EntityFrameworkCore;
using MovieManagement.Data.Entities;

namespace MovieManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Movie> Movies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed some initial data
        var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        
        modelBuilder.Entity<Movie>().HasData(
            new Movie
            {
                Id = 1,
                Title = "The Shawshank Redemption",
                Genre = "Drama",
                Rating = 5,
                PosterImage = "https://images.unsplash.com/photo-1489599735734-79b4d4c4b5a?w=500",
                CreatedAt = seedDate
            },
            new Movie
            {
                Id = 2,
                Title = "Inception",
                Genre = "Sci-Fi",
                Rating = 4,
                PosterImage = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
                CreatedAt = seedDate
            },
            new Movie
            {
                Id = 3,
                Title = "The Dark Knight",
                Genre = "Action",
                Rating = 5,
                PosterImage = "https://images.unsplash.com/photo-1509347528160-d77d9f5f4e9e?w=500",
                CreatedAt = seedDate
            }
        );
    }
}