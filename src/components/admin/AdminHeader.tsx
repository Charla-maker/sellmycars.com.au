'use client';

import { signOut } from 'next-auth/react';
import { Bell, LogOut, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Middle - Breadcrumb or title (can be added later) */}
        <div className="flex-1"></div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User info */}
          <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
            </div>
          </div>

          {/* Sign out */}
          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
