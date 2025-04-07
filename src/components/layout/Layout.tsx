import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col mx-[55px]">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>;
};
export default Layout;