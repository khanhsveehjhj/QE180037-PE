'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { movieService } from '@/services/movieService';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [sortOrder, setSortOrder] = useState<'title' | 'rating' | 'title_desc' | 'rating_desc'>('title');

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await movieService.getAllMovies(searchTerm, genre, sortOrder);
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      alert('Failed to fetch movies. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, genre, sortOrder]);

  useEffect(() => {
    fetchMovies();
  }, [sortOrder, genre]);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== undefined) { // Only search if searchTerm is defined
        fetchMovies();
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchMovies]);


  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
      await movieService.deleteMovie(id);
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Search, Filter and Sort Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Genre Filter */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium whitespace-nowrap">
                  Genre:
                </label>
                <input
                  type="text"
                  placeholder="Filter by genre..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                />
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'title' | 'rating' | 'title_desc' | 'rating_desc')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900"
                >
                  <option value="title">Title A-Z</option>
                  <option value="title_desc">Title Z-A</option>
                  <option value="rating">Rating Low-High</option>
                  <option value="rating_desc">Rating High-Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500 mb-4">No movies found</p>
              <p className="text-gray-400">
                {searchTerm || genre ? 'Try different search or filter criteria' : 'Create your first movie to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
