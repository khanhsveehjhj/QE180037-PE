using MovieManagement.Data.Entities;
using MovieManagement.Repository.Interfaces;
using MovieManagement.Service.DTOs;
using MovieManagement.Service.Interfaces;

namespace MovieManagement.Service;

public class MovieService : IMovieService
{
    private readonly IMovieRepository _movieRepository;

    public MovieService(IMovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
    }

    public async Task<IEnumerable<MovieDto>> GetAllMoviesAsync(string? searchTerm = null, string? genre = null, string? sortOrder = null)
    {
        var movies = await _movieRepository.GetAllAsync(searchTerm, genre, sortOrder);
        return movies.Select(MapToDto);
    }

    public async Task<MovieDto?> GetMovieByIdAsync(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);
        return movie != null ? MapToDto(movie) : null;
    }

    public async Task<MovieDto> CreateMovieAsync(CreateMovieDto createMovieDto)
    {
        var movie = new Movie
        {
            Title = createMovieDto.Title,
            Genre = createMovieDto.Genre,
            Rating = createMovieDto.Rating,
            PosterImage = createMovieDto.PosterImage
        };

        var createdMovie = await _movieRepository.CreateAsync(movie);
        return MapToDto(createdMovie);
    }

    public async Task<MovieDto?> UpdateMovieAsync(int id, UpdateMovieDto updateMovieDto)
    {
        var movie = new Movie
        {
            Title = updateMovieDto.Title,
            Genre = updateMovieDto.Genre,
            Rating = updateMovieDto.Rating,
            PosterImage = updateMovieDto.PosterImage
        };

        var updatedMovie = await _movieRepository.UpdateAsync(id, movie);
        return updatedMovie != null ? MapToDto(updatedMovie) : null;
    }

    public async Task<bool> DeleteMovieAsync(int id)
    {
        return await _movieRepository.DeleteAsync(id);
    }

    private static MovieDto MapToDto(Movie movie)
    {
        return new MovieDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Genre = movie.Genre,
            Rating = movie.Rating,
            PosterImage = movie.PosterImage,
            CreatedAt = movie.CreatedAt,
            UpdatedAt = movie.UpdatedAt
        };
    }
}