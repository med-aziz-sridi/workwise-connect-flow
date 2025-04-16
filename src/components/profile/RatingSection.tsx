
import React, { useState } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface RatingSectionProps {
  user: User;
  onRatingSubmitted?: () => void;
}

const RatingSection: React.FC<RatingSectionProps> = ({ user, onRatingSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
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
      // Instead of trying to insert into a non-existent user_ratings table,
      // we'll just update the profile directly as a temporary solution
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
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
  if (currentUser?.id === user.id) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Rate This {user.role === 'freelancer' ? 'Freelancer' : 'Provider'}</CardTitle>
        <CardDescription>
          Share your experience working with {user.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
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
    </Card>
  );
};

export default RatingSection;
