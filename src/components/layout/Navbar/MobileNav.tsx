
import React from 'react';
import { Link } from 'react-router-dom';
import { X, User, Briefcase, Bell, LogOut, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useData } from '@/context/DataContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, profile, logout } = useAuth();
  const { notifications } = useData();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right">
        <div className="flex flex-col h-full py-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col space-y-4">
            {user && profile ? (
              <>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.profile_picture || undefined} alt={profile.name} />
                    <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                  </div>
                </div>
                
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/profile" className="justify-start">
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/jobs" className="justify-start">
                    Find Jobs
                  </Link>
                </Button>
                
                {profile.role === 'freelancer' && (
                  <Button variant="ghost" asChild onClick={onClose}>
                    <Link to="/applications" className="justify-start">
                      <Briefcase className="mr-2 h-5 w-5" />
                      My Applications
                    </Link>
                  </Button>
                )}
                
                {profile.role === 'provider' && (
                  <Button variant="ghost" asChild onClick={onClose}>
                    <Link to="/my-jobs" className="justify-start">
                      <Briefcase className="mr-2 h-5 w-5" />
                      My Jobs
                    </Link>
                  </Button>
                )}
                
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/messages" className="justify-start">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Messages
                  </Link>
                </Button>
                
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/notifications" className="justify-start relative">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications
                    {unreadNotifications > 0 && (
                      <span className="absolute left-6 top-1 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="justify-start mt-auto"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/jobs" className="justify-start">
                    Browse Jobs
                  </Link>
                </Button>
                <Button variant="ghost" asChild onClick={onClose}>
                  <Link to="/login" className="justify-start">
                    Log in
                  </Link>
                </Button>
                <Button variant="ghost" className="btn-gradient" asChild onClick={onClose}>
                  <Link to="/register" className="justify-start">
                    Join Freeness
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
