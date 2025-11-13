export interface Movie {
  id: number;
  title: string;
  genre?: string;
  rating?: number;
  posterImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMovieDto {
  title: string;
  genre?: string;
  rating?: number;
  posterImage?: string;
}

export interface UpdateMovieDto {
  title: string;
  genre?: string;
  rating?: number;
  posterImage?: string;
}