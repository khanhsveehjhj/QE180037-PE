'use client';

import { useState, useRef, useEffect } from 'react';
import { movieService } from '@/services/movieService';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [useUrl, setUseUrl] = useState(!!(value && value.startsWith('http')));
  const [urlInput, setUrlInput] = useState(value || '');
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop
  useEffect(() => {
    const safeValue = value || '';
    setPreview(safeValue);
    setUrlInput(safeValue);
    setUseUrl(!!(value && value.startsWith('http')));
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const imageUrl = await movieService.uploadImage(file);
      setPreview(imageUrl); // Update preview to server URL
      onChange(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    setPreview(url);
    onChange(url);
  };

  const handleRemoveImage = () => {
    setPreview('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleInputMode = () => {
    setUseUrl(!useUrl);
    handleRemoveImage();
  };

  return (
    <div className="space-y-4">
      {/* Toggle between Upload and URL */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleInputMode}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {useUrl ? '📤 Upload from computer' : '🔗 Use image URL instead'}
        </button>
      </div>

      {/* URL Input */}
      {useUrl ? (
        <div>
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
          />
        </div>
      ) : (
        /* File Upload */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                <span className="text-gray-600">Uploading...</span>
              </>
            ) : (
              <>
                <FiUpload className="text-gray-400" size={20} />
                <span className="text-gray-600">Click to upload image (max 5MB)</span>
              </>
            )}
          </label>
          <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF, WebP</p>
        </div>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {preview.startsWith('data:') ? (
              // Base64 image from FileReader - eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              // Server URL
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  console.warn('Failed to load image from server, keeping local preview');
                  // Don't clear preview, just log the error
                }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove image"
          >
            <FiX size={20} />
          </button>
        </div>
      )}
    </div>
  );
}