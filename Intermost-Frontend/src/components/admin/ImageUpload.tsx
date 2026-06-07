'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadsApi, UploadedFile } from '@/lib/services';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  category: 'countries' | 'news' | 'team' | 'testimonials' | 'blogs' | 'colleges' | 'general' | 'videos';
  label?: string;
  accept?: string;
  className?: string;
  previewClassName?: string;
}

export default function ImageUpload({
  value,
  onChange,
  category,
  label = 'Image',
  accept = 'image/*',
  className = '',
  previewClassName = 'h-40',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = accept.includes('video')
      ? ['video/mp4', 'video/webm', 'video/mov']
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    
    if (!allowedTypes.some((type) => file.type.includes(type.split('/')[1]))) {
      toast.error(`Invalid file type. Allowed: ${accept}`);
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadsApi.uploadFile(file, category);
      if (result.files && result.files.length > 0) {
        onChange(result.files[0].url);
        toast.success('File uploaded successfully');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  }, [category, accept, onChange]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleClear = useCallback(() => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onChange]);

  const isVideo = accept.includes('video') || value?.includes('/video/');

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className={`relative ${previewClassName}`}>
            {isVideo ? (
              <video
                src={value}
                className="w-full h-full object-cover rounded-lg"
                controls={false}
                muted
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center p-6 ${previewClassName}`}>
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-2" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-medium text-primary-600">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {accept.includes('video') ? 'MP4, WebM, MOV' : 'PNG, JPG, GIF, WebP'} up to 50MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual URL input */}
      <div className="mt-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter URL directly"
          className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
