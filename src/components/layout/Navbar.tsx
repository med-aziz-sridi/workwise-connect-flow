
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, X, User, Briefcase, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useData } from '@/context/DataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const unreadNotifications = notifications.filter(
    n => n.userId === user?.id && !n.read
  ).length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Freeness
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/jobs">Find Jobs</Link>
                </Button>
                
                {user.role === 'freelancer' && (
                  <Button variant="ghost" asChild>
                    <Link to="/applications">My Applications</Link>
                  </Button>
                )}
                
                {user.role === 'provider' && (
                  <Button variant="ghost" asChild>
                    <Link to="/my-jobs">My Jobs</Link>
                  </Button>
                )}
                
                <Link to="/notifications" className="relative">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to={user.role === 'freelancer' ? '/applications' : '/my-jobs'} 
                        className="cursor-pointer w-full flex items-center"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>{user.role === 'freelancer' ? 'My Applications' : 'My Jobs'}</span>
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/jobs">Browse Jobs</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Join Freeness</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold">Menu</span>
                    <Button variant="ghost" size="icon" onClick={closeMenu}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {user ? (
                      <>
                        <div className="flex items-center space-x-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePicture} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                          </div>
                        </div>
                        
                        <Button variant="ghost" asChild onClick={closeMenu}>
                          <Link to="/profile" className="justify-start">
                            <User className="mr-2 h-5 w-5" />
                            Profile
                          </Link>
                        </Button>
                        
                        <Button variant="ghost" asChild onClick={closeMenu}>
                          <Link to="/jobs" className="justify-start">
                            Find Jobs
                          </Link>
                        </Button>
                        
                        {user.role === 'freelancer' && (
                          <>
                            <Button variant="ghost" asChild onClick={closeMenu}>
                              <Link to="/applications" className="justify-start">
                                <Briefcase className="mr-2 h-5 w-5" />
                                My Applications
                              </Link>
                            </Button>
                          </>
                        )}
                        
                        {user.role === 'provider' && (
                          <Button variant="ghost" asChild onClick={closeMenu}>
                            <Link to="/my-jobs" className="justify-start">
                              <Briefcase className="mr-2 h-5 w-5" />
                              My Jobs
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="ghost" asChild onClick={closeMenu}>
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
                          onClick={() => { logout(); closeMenu(); }}
                          className="justify-start mt-auto"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Log out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" asChild onClick={closeMenu}>
                          <Link to="/jobs" className="justify-start">
                            Browse Jobs
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild onClick={closeMenu}>
                          <Link to="/login" className="justify-start">
                            Log in
                          </Link>
                        </Button>
                        <Button variant="ghost" className="btn-gradient" asChild onClick={closeMenu}>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
