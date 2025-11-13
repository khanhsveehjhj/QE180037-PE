import axios from 'axios';
import { Movie, CreateMovieDto, UpdateMovieDto } from '@/types/movie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieService = {
  getAllMovies: async (searchTerm?: string, genre?: string, sortOrder?: string): Promise<Movie[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (genre) params.append('genre', genre);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const response = await apiClient.get<Movie[]>(`/movies?${params.toString()}`);
    return response.data;
  },

  getMovieById: async (id: number): Promise<Movie> => {
    const response = await apiClient.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  createMovie: async (movie: CreateMovieDto): Promise<Movie> => {
    const response = await apiClient.post<Movie>('/movies', movie);
    return response.data;
  },

  updateMovie: async (id: number, movie: UpdateMovieDto): Promise<Movie> => {
    const response = await apiClient.put<Movie>(`/movies/${id}`, movie);
    return response.data;
  },

  deleteMovie: async (id: number): Promise<void> => {
    await apiClient.delete(`/movies/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },
};