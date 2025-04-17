
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRatings } from './rating/useRatings';
import RatingDisplay from './rating/RatingDisplay';
import RatingInput from './rating/RatingInput';
import RatingsList from './rating/RatingsList';

interface RatingSectionProps {
  user: User;
  onRatingSubmitted?: () => void;
}

const RatingSection: React.FC<RatingSectionProps> = ({ user, onRatingSubmitted }) => {
  const {
    selectedRating,
    setSelectedRating,
    hoveredRating,
    setHoveredRating,
    isSubmitting,
    recentRatings,
    canRate,
    handleRatingSubmit
  } = useRatings(user, onRatingSubmitted);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ratings & Reviews</CardTitle>
          <CardDescription>
            <RatingDisplay user={user} />
          </CardDescription>
        </CardHeader>
        {canRate && (
          <CardContent>
            <RatingInput
              userName={user.name}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              hoveredRating={hoveredRating}
              setHoveredRating={setHoveredRating}
              isSubmitting={isSubmitting}
              onSubmit={handleRatingSubmit}
            />
          </CardContent>
        )}
      </Card>
      
      {recentRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingsList ratings={recentRatings} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RatingSection;
