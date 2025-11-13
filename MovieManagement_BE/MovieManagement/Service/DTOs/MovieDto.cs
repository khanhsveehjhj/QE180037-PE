using System.ComponentModel.DataAnnotations;

namespace MovieManagement.Service.DTOs;

public class MovieDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Genre { get; set; }
    public int? Rating { get; set; }
    public string? PosterImage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateMovieDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Genre cannot exceed 100 characters")]
    public string? Genre { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int? Rating { get; set; }

    [MaxLength(500, ErrorMessage = "Poster image URL cannot exceed 500 characters")]
    public string? PosterImage { get; set; }
}

public class UpdateMovieDto
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(100, ErrorMessage = "Genre cannot exceed 100 characters")]
    public string? Genre { get; set; }

    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int? Rating { get; set; }

    [MaxLength(500, ErrorMessage = "Poster image URL cannot exceed 500 characters")]
    public string? PosterImage { get; set; }
}