
import React from 'react';
import { User as UserIcon, Star } from 'lucide-react';
import { Rating } from './useRatings';

interface RatingsListProps {
  ratings: Rating[];
}

const RatingsList: React.FC<RatingsListProps> = ({ ratings }) => {
  if (ratings.length === 0) return null;
  
  return (
    <ul className="space-y-4">
      {ratings.map((review) => (
        <li key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 rounded-full p-2">
                <UserIcon className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium">{review.rater}</span>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString()}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RatingsList;
