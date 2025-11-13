using Microsoft.AspNetCore.Mvc;
using MovieManagement.Service.DTOs;
using MovieManagement.Service.Interfaces;

namespace MovieManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieService _movieService;
    private readonly ILogger<MoviesController> _logger;

    public MoviesController(IMovieService movieService, ILogger<MoviesController> logger)
    {
        _movieService = movieService;
        _logger = logger;
    }

    /// <summary>
    /// Get all movies with optional search, filter and sort
    /// </summary>
    /// <param name="searchTerm">Search by movie title</param>
    /// <param name="genre">Filter by genre</param>
    /// <param name="sortOrder">Sort order: 'title', 'rating', 'title_desc', 'rating_desc' (default: 'title')</param>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MovieDto>>> GetAllMovies(
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? genre = null,
        [FromQuery] string? sortOrder = null)
    {
        try
        {
            var movies = await _movieService.GetAllMoviesAsync(searchTerm, genre, sortOrder);
            return Ok(movies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all movies");
            return StatusCode(500, "An error occurred while retrieving movies");
        }
    }

    /// <summary>
    /// Get a movie by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<MovieDto>> GetMovieById(int id)
    {
        try
        {
            var movie = await _movieService.GetMovieByIdAsync(id);
            if (movie == null)
            {
                return NotFound($"Movie with ID {id} not found");
            }
            return Ok(movie);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting movie by ID: {MovieId}", id);
            return StatusCode(500, "An error occurred while retrieving the movie");
        }
    }

    /// <summary>
    /// Create a new movie
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<MovieDto>> CreateMovie([FromBody] CreateMovieDto createMovieDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movie = await _movieService.CreateMovieAsync(createMovieDto);
            return CreatedAtAction(nameof(GetMovieById), new { id = movie.Id }, movie);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating movie");
            return StatusCode(500, "An error occurred while creating the movie");
        }
    }

    /// <summary>
    /// Update an existing movie
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<MovieDto>> UpdateMovie(int id, [FromBody] UpdateMovieDto updateMovieDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var movie = await _movieService.UpdateMovieAsync(id, updateMovieDto);
            if (movie == null)
            {
                return NotFound($"Movie with ID {id} not found");
            }

            return Ok(movie);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating movie with ID: {MovieId}", id);
            return StatusCode(500, "An error occurred while updating the movie");
        }
    }

    /// <summary>
    /// Delete a movie
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMovie(int id)
    {
        try
        {
            var result = await _movieService.DeleteMovieAsync(id);
            if (!result)
            {
                return NotFound($"Movie with ID {id} not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting movie with ID: {MovieId}", id);
            return StatusCode(500, "An error occurred while deleting the movie");
        }
    }
}