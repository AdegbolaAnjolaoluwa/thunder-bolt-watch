import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/d96fb1a5-2827-4ebe-ba2e-b636930c2119.png" 
              alt="Thunder Icon" 
              className="h-8 w-8 mr-3" 
            />
            <img 
              src="/lovable-uploads/1c258998-4e1a-4eb6-bb02-8aa16e8f73f1.png" 
              alt="Logo" 
              className="h-8 w-auto mr-3" 
            />
            <h1 className="text-xl font-bold tracking-wide">
              <span className="text-yellow-500">Thunder</span> Bolt <span className="text-red-600">Watch</span>
            </h1>
          </div>
          
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-300">{currentUser.name}</p>
                  <p className="text-red-400 capitalize">{currentUser.role}</p>
                </div>
                <Avatar className="h-8 w-8 border border-yellow-500/50">
                  <AvatarImage src={currentUser.photoURL} alt={currentUser.name} />
                  <AvatarFallback className="bg-red-900 text-white">{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-300 hover:text-white hover:bg-red-900/20">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-red-900">{title}</h2>
          </div>
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
      
      <footer className="bg-black/5 border-t border-gold-100 py-4 mt-12">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
