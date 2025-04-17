
import React from 'react';
import { Star } from 'lucide-react';
import { User } from '@/types';

interface RatingDisplayProps {
  user: User;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ user }) => {
  return (
    <>
      {user.rating !== undefined && user.totalRatings !== undefined ? (
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-5 w-5 ${
                  star <= (user.rating || 0) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-medium">
            {user.rating?.toFixed(1) || "0.0"} 
            <span className="ml-1 text-gray-500 font-normal">
              ({user.totalRatings || 0} {user.totalRatings === 1 ? 'rating' : 'ratings'})
            </span>
          </span>
        </div>
      ) : (
        <span>No ratings yet</span>
      )}
    </>
  );
};

export default RatingDisplay;
