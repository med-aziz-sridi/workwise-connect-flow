
import React, { useState } from 'react';
import { ArrowLeft, Mail, Briefcase, User, Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Notification } from '@/types';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AuthRequiredPage from '@/components/auth/AuthRequiredPage';

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!user) {
    return <AuthRequiredPage message="Please log in to view your notifications" />;
  }

  const userNotifications = notifications
    .filter(notification => notification.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadNotifications = userNotifications.filter(notification => !notification.read);
  const displayedNotifications = activeTab === 'all' ? userNotifications : unreadNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Mail className="h-5 w-5" />;
      case 'application':
        return <Briefcase className="h-5 w-5" />;
      case 'job':
        return <User className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'message':
        return `/messages/${notification.relatedId}`;
      case 'application':
        return user.role === 'freelancer' 
          ? `/applications` 
          : `/jobs/${notification.relatedId}/applicants`;
      case 'job':
        return `/jobs/${notification.relatedId}`;
      default:
        return '#';
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        {unreadNotifications.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => unreadNotifications.forEach(n => markNotificationAsRead(n.id))}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'unread')} className="w-full">
        <TabsList className="grid w-full max-w-xs grid-cols-2 mb-6">
          <TabsTrigger value="all">
            All
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderNotifications(displayedNotifications)}
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
          {renderNotifications(displayedNotifications)}
        </TabsContent>
      </Tabs>

      {displayedNotifications.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
          <Bell className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === 'unread' 
              ? "You don't have any unread notifications." 
              : "You don't have any notifications yet."}
          </p>
        </div>
      )}
    </div>
  );

  function renderNotifications(notifications: Notification[]) {
    return (
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`overflow-hidden transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
          >
            <CardContent className="p-0">
              <div 
                className="flex items-start p-4 cursor-pointer"
                onClick={() => {
                  if (!notification.read) {
                    handleMarkAsRead(notification.id);
                  }
                  navigate(getNotificationLink(notification));
                }}
              >
                <div className={`p-2 rounded-full mr-4 ${
                  notification.type === 'message' ? 'bg-purple-100 text-purple-600' : 
                  notification.type === 'application' ? 'bg-green-100 text-green-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 ml-2">
                    New
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default Notifications;
