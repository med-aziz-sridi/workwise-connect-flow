
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, MessageSquare, Home, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { AvailabilityBadge } from '@/components/ui/availability-badge';
import UserMenu from './UserMenu';
import { cn } from '@/lib/utils';

const DesktopNav: React.FC = () => {
  const { profile } = useAuth();
  const { notifications } = useData();
  const location = useLocation();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  // Function to check if a path is active
  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <>
      <Button 
        variant="ghost" 
        asChild
        className={cn(isActivePath('/') && !isActivePath('/profile') && 
                     !isActivePath('/jobs') && !isActivePath('/applications') && 
                     !isActivePath('/my-jobs') && !isActivePath('/messages') && 
                     !isActivePath('/notifications') ? "bg-accent" : "")}
      >
        <Link to="/">
          <Home className="h-5 w-5 mr-2" />
          Home
        </Link>
      </Button>
      
      <Button 
        variant="ghost" 
        asChild
        className={cn(isActivePath('/jobs') ? "bg-accent" : "")}
      >
        <Link to="/jobs">Find Jobs</Link>
      </Button>
      
      {profile?.role === 'freelancer' && (
        <Button 
          variant="ghost" 
          asChild
          className={cn(isActivePath('/applications') ? "bg-accent" : "")}
        >
          <Link to="/applications">My Applications</Link>
        </Button>
      )}
      
      {profile?.role === 'provider' && (
        <Button 
          variant="ghost" 
          asChild
          className={cn(isActivePath('/my-jobs') ? "bg-accent" : "")}
        >
          <Link to="/my-jobs">My Jobs</Link>
        </Button>
      )}
      
      <Link to="/messages" className="relative">
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(isActivePath('/messages') ? "bg-accent" : "")}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </Link>
      
      <Link to="/notifications" className="relative">
        <Button 
          variant="ghost" 
          size="icon"
          className={cn(isActivePath('/notifications') ? "bg-accent" : "")}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </Link>
      
      {profile?.verified && (
        <div className="px-2 flex items-center">
          <VerificationBadge size="sm" />
        </div>
      )}
      
      {profile?.role === 'freelancer' && (
        <div className="px-2 flex items-center">
          <AvailabilityBadge size="sm" />
        </div>
      )}
      
      <UserMenu />
    </>
  );
};

export default DesktopNav;
