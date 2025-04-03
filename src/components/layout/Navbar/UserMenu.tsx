
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Briefcase, LogOut, MessageSquare, User, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { AvailabilityBadge } from '@/components/ui/availability-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { notifications } = useData();

  if (!user || !profile) return null;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string" || name.trim().length === 0) return "U";
    return name
      .trim()
      .split(' ')
      .map(part => part[0] || '')
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.profile_picture} alt={profile.name} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 flex space-x-1 bg-white rounded-full p-0.5">
            {profile.verified && <VerificationBadge size="sm" />}
            {profile.role === 'freelancer' && <AvailabilityBadge size="sm" />}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span>My Account</span>
          {profile.verified && <VerificationBadge size="sm" />}
          {profile.role === 'freelancer' && <AvailabilityBadge size="sm" />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link 
            to={profile.role === 'freelancer' ? '/applications' : '/my-jobs'} 
            className="cursor-pointer w-full flex items-center"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            <span>{profile.role === 'freelancer' ? 'My Applications' : 'My Jobs'}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/messages" className="cursor-pointer w-full flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="cursor-pointer w-full flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
            {unreadNotifications > 0 && (
              <span className="ml-2 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Link>
        </DropdownMenuItem>
        {profile.role === 'freelancer' && (
          <DropdownMenuItem>
            <Clock className="mr-2 h-4 w-4" />
            <AvailabilityBadge showButton={true} />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
