'use client';

import { useState } from 'react';
import { Movie } from '@/types/movie';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiAlertTriangle, FiStar } from 'react-icons/fi';

interface MovieCardProps {
  movie: Movie;
  onDelete: (id: number) => void;
}

export default function MovieCard({ movie, onDelete }: MovieCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(movie.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/movies/${movie.id}/edit`} className="block">
        <div className="relative h-48 w-full bg-gray-200 cursor-pointer">
          {movie.posterImage ? (
            <Image
              src={movie.posterImage}
              alt={movie.title}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-primary-600 text-lg font-semibold">No Poster</span>
            </div>
          )}
        </div>

        <div className="p-5 cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {movie.title}
          </h3>
          {movie.genre && (
            <p className="text-sm text-primary-600 font-medium mb-2">
              {movie.genre}
            </p>
          )}
          {renderStars(movie.rating)}
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="flex items-center justify-between mt-4">
          <Link
            href={`/movies/${movie.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <FiEdit2 size={18} />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <FiTrash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Movie
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">&ldquo;{movie.title}&rdquo;</span>?
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}