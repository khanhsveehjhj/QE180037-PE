using MovieManagement.Service.DTOs;

namespace MovieManagement.Service.Interfaces;

public interface IMovieService
{
    Task<IEnumerable<MovieDto>> GetAllMoviesAsync(string? searchTerm = null, string? genre = null, string? sortOrder = null);
    Task<MovieDto?> GetMovieByIdAsync(int id);
    Task<MovieDto> CreateMovieAsync(CreateMovieDto createMovieDto);
    Task<MovieDto?> UpdateMovieAsync(int id, UpdateMovieDto updateMovieDto);
    Task<bool> DeleteMovieAsync(int id);
}