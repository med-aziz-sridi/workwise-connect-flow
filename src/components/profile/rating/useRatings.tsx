
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface Rating {
  id: string;
  rater: string;
  rating: number;
  date: string;
}

export function useRatings(user: User, onRatingSubmitted?: () => void) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentRatings, setRecentRatings] = useState<Rating[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  // Don't show rating option if user is rating themselves
  const canRate = currentUser?.id !== user.id;
  
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

  return {
    selectedRating,
    setSelectedRating,
    hoveredRating, 
    setHoveredRating,
    isSubmitting,
    recentRatings,
    canRate,
    handleRatingSubmit
  };
}
