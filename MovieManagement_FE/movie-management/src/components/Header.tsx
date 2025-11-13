'use client';

import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Movie Management
            </h1>
          </Link>

          <Link
            href="/movies/create"
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          >
            <FiPlus size={20} />
            Add Movie
          </Link>
        </div>
      </div>
    </header>
  );
}