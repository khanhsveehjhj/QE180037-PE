'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { movieService } from '@/services/movieService';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function EditMovie() {
  const router = useRouter();
  const params = useParams();
  const movieId = parseInt(params.id as string);

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: '',
    posterImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movie = await movieService.getMovieById(movieId);
        setFormData({
          title: movie.title,
          genre: movie.genre || '',
          rating: movie.rating?.toString() || '',
          posterImage: movie.posterImage || '',
        });
      } catch (error) {
        console.error('Error fetching movie:', error);
        alert('Failed to fetch movie');
        router.push('/');
      } finally {
        setFetching(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    try {
      setLoading(true);
      await movieService.updateMovie(movieId, {
        title: formData.title,
        genre: formData.genre || undefined,
        rating: formData.rating ? parseInt(formData.rating) : undefined,
        posterImage: formData.posterImage || undefined,
      });
      router.push('/');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert('Failed to update movie');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <FiArrowLeft size={20} />
              Back to Movies
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Movie</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Enter movie title"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                  placeholder="Enter movie genre"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-gray-500">(Optional)</span>
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 bg-white"
                >
                  <option value="">Select rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label htmlFor="posterImage" className="block text-sm font-medium text-gray-700 mb-2">
                  Poster Image <span className="text-gray-500">(Optional)</span>
                </label>
                <ImageUpload
                  value={formData.posterImage}
                  onChange={(url) => setFormData({ ...formData, posterImage: url })}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center font-semibold"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}