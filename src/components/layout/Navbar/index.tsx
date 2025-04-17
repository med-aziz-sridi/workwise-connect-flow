
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import Logo from './Logo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import UserSearch from '@/components/search/UserSearch';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <UserSearch />
            </div>
            {user ? (
              <DesktopNav />
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
            {/* Mobile search - show on smaller screens */}
            <div className="mr-2">
              <UserSearch />
            </div>
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
