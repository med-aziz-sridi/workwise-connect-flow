
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RatingInputProps {
  userName: string;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const RatingInput: React.FC<RatingInputProps> = ({
  userName,
  selectedRating,
  setSelectedRating,
  hoveredRating,
  setHoveredRating,
  isSubmitting,
  onSubmit
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Rate {userName}</h3>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Star 
            key={rating}
            className={`h-8 w-8 cursor-pointer ${
              (hoveredRating >= rating || selectedRating >= rating) 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            }`}
            onClick={() => setSelectedRating(rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(0)}
          />
        ))}
      </div>
      
      <Button 
        onClick={onSubmit} 
        disabled={selectedRating === 0 || isSubmitting}
        className="mt-4"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
      </Button>
    </div>
  );
};

export default RatingInput;
