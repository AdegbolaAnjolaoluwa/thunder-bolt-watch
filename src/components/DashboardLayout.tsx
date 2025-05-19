
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Shield, LogOut } from 'lucide-react';

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
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-security-700 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">Security Funds Manager</h1>
          </div>
          
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-right">
                  <p className="font-medium text-gray-700">{currentUser.name}</p>
                  <p className="text-gray-500 capitalize">{currentUser.role}</p>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.photoURL} alt={currentUser.name} />
                  <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
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
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
