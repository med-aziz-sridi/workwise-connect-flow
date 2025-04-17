
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface RatingSectionProps {
  user: User;
  onRatingSubmitted?: () => void;
}

interface Rating {
  id: string;
  rater: string;
  rating: number;
  date: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({ user, onRatingSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentRatings, setRecentRatings] = useState<Rating[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  // Fetch real ratings instead of using fake ones
  useEffect(() => {
    const fetchRecentRatings = async () => {
      try {
        // Here you would typically fetch from a ratings table
        // This is a placeholder for future implementation
        setRecentRatings([]);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    
    fetchRecentRatings();
  }, [user.id]);

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Fetch the current profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('rating, total_ratings')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Calculate new rating - if no existing rating, use the selected rating
      const currentRating = profileData.rating || 0;
      const currentTotalRatings = profileData.total_ratings || 0;
      
      // Calculate new average rating
      const newTotalRatings = currentTotalRatings + 1;
      const newRating = ((currentRating * currentTotalRatings) + selectedRating) / newTotalRatings;
      
      // Update profile with new rating data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          rating: newRating,
          total_ratings: newTotalRatings,
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Add this rating to our recent ratings list
      const newRatingEntry: Rating = {
        id: Date.now().toString(),
        rater: currentUser?.name || "Anonymous",
        rating: selectedRating,
        date: new Date().toISOString()
      };
      
      setRecentRatings(prev => [newRatingEntry, ...prev]);
      
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this user",
        className: "bg-green-100 border-green-500",
      });
      
      // Reset the form
      setSelectedRating(0);
      
      // Callback for parent component
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Failed to submit rating",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Don't show rating option if user is rating themselves
  const canRate = currentUser?.id !== user.id;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ratings & Reviews</CardTitle>
          <CardDescription>
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
          </CardDescription>
        </CardHeader>
        {canRate && (
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Rate {user.name}</h3>
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
                onClick={handleRatingSubmit} 
                disabled={selectedRating === 0 || isSubmitting}
                className="mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
      
      {recentRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentRatings.map((review) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RatingSection;
