
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Image, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  // For now, we'll handle image uploads by just supporting URL input
  // This will be replaced with actual file upload once connected to Supabase
  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      if (Array.isArray(value)) {
        onChange([...value, url]);
      } else {
        onChange(url);
      }
    }
  };

  const handleClear = () => {
    if (Array.isArray(value)) {
      onChange([]);
    } else {
      onChange('');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (Array.isArray(value)) {
      onChange(value.filter((_, index) => index !== indexToRemove));
    }
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 transition-all",
        loading && "opacity-70",
        value && (Array.isArray(value) ? value.length > 0 : value) ? "border-gray-200 bg-gray-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
        className
      )}
    >
      {Array.isArray(value) && value.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 w-full">
          {value.map((img, index) => (
            <div key={index} className="relative">
              <img 
                src={img} 
                alt={`Project image ${index + 1}`} 
                className="w-full h-40 object-cover rounded-md" 
              />
              <button 
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-800 text-white"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={handleUrlInput}
            className="flex flex-col items-center justify-center h-40 w-full border border-dashed border-gray-300 rounded-md text-gray-500"
            type="button"
          >
            <Image className="h-6 w-6 mb-2" />
            <span>Add more</span>
          </button>
        </div>
      ) : typeof value === 'string' && value ? (
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
            </button> to your project
          </div>
          <p className="text-xs text-gray-500">
            16:9 aspect ratio recommended
          </p>
        </div>
      )}
    </div>
  );
}
