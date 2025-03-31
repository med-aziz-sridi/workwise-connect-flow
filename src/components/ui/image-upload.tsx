
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  // For now, we'll handle image uploads by just supporting URL input
  // This will be replaced with actual file upload once connected to Supabase
  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      onChange(url);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center border-2 border-dashed rounded-md p-4 transition-all",
        loading && "opacity-70",
        value ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
        className
      )}
    >
      {value ? (
        <div className="relative w-full h-full">
          <img 
            src={value} 
            alt="Uploaded" 
            className="w-full h-full object-cover rounded-md" 
          />
          <button 
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 text-white"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Image className="h-10 w-10 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button 
              type="button" 
              onClick={handleUrlInput}
              className="text-blue-600 hover:underline"
            >
              Add an image
            </button> to your job posting
          </div>
          <p className="text-xs text-gray-500">
            16:9 aspect ratio recommended
          </p>
        </div>
      )}
    </div>
  );
}
