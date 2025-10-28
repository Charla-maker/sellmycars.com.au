'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Image as ImageIcon,
  Mail,
  Settings,
  Users,
  BarChart3,
  FolderOpen,
  Tags,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Pages', href: '/admin/pages', icon: FileText },
  { name: 'Blog Posts', href: '/admin/posts', icon: Newspaper },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Form Submissions', href: '/admin/submissions', icon: Mail },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 hidden" id="sidebar-backdrop"></div>

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-secondary transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 bg-secondary border-b border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">SellMyCars</h1>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Online
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
