
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import UserMenu from './UserMenu';

const DesktopNav: React.FC = () => {
  const { profile } = useAuth();
  const { notifications } = useData();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <>
      <Button variant="ghost" asChild>
        <Link to="/jobs">Find Jobs</Link>
      </Button>
      
      {profile?.role === 'freelancer' && (
        <Button variant="ghost" asChild>
          <Link to="/applications">My Applications</Link>
        </Button>
      )}
      
      {profile?.role === 'provider' && (
        <Button variant="ghost" asChild>
          <Link to="/my-jobs">My Jobs</Link>
        </Button>
      )}
      
      <Link to="/messages" className="relative">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Button>
      </Link>
      
      <UserMenu />
    </>
  );
};

export default DesktopNav;
