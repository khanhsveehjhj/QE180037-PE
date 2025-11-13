using Microsoft.EntityFrameworkCore;
using MovieManagement.Data;
using MovieManagement.Data.Entities;
using MovieManagement.Repository.Interfaces;

namespace MovieManagement.Repository;

public class MovieRepository : IMovieRepository
{
    private readonly AppDbContext _context;

    public MovieRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Movie>> GetAllAsync(string? searchTerm = null, string? genre = null, string? sortOrder = null)
    {
        var query = _context.Movies.AsQueryable();

        // Search by title
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(m => m.Title.ToLower().Contains(searchTerm.ToLower()));
        }

        // Filter by genre
        if (!string.IsNullOrWhiteSpace(genre))
        {
            query = query.Where(m => m.Genre != null && m.Genre.ToLower() == genre.ToLower());
        }

        // Sort
        query = sortOrder?.ToLower() switch
        {
            "rating" => query.OrderBy(m => m.Rating ?? 0),
            "rating_desc" => query.OrderByDescending(m => m.Rating ?? 0),
            "title_desc" => query.OrderByDescending(m => m.Title),
            _ => query.OrderBy(m => m.Title)
        };

        return await query.ToListAsync();
    }

    public async Task<Movie?> GetByIdAsync(int id)
    {
        return await _context.Movies.FindAsync(id);
    }

    public async Task<Movie> CreateAsync(Movie movie)
    {
        movie.CreatedAt = DateTime.UtcNow;
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();
        return movie;
    }

    public async Task<Movie?> UpdateAsync(int id, Movie movie)
    {
        var existingMovie = await _context.Movies.FindAsync(id);
        if (existingMovie == null)
            return null;

        existingMovie.Title = movie.Title;
        existingMovie.Genre = movie.Genre;
        existingMovie.Rating = movie.Rating;
        existingMovie.PosterImage = movie.PosterImage;
        existingMovie.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existingMovie;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
            return false;

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Movies.AnyAsync(m => m.Id == id);
    }
}