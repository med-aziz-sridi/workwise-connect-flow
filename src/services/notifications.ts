
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType, User, Profile } from '@/types';

export function useNotificationsService(user: User | null, profile: Profile | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedNotifications: Notification[] = data.map(notification => ({
        id: notification.id,
        userId: notification.user_id,
        message: notification.message,
        read: notification.read,
        createdAt: notification.created_at,
        type: notification.type as NotificationType,
        relatedId: notification.related_id,
      }));
      
      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const resetNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    isLoading,
    fetchNotifications,
    markNotificationAsRead,
    resetNotifications
  };
}
