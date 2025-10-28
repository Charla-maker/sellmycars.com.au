'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Filter,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string;
  author: {
    name: string;
  };
};

type PagesResponse = {
  success: boolean;
  data: {
    data: Page[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function PagesListPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/pages?${params}`);
      const result: PagesResponse = await response.json();

      if (result.success) {
        setPages(result.data.data);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [pagination.page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPages();
      } else {
        alert('Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('An error occurred while deleting the page');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PUBLISHED: 'bg-green-100 text-green-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      ARCHIVED: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.DRAFT
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your website pages
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create Page
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new page.
            </p>
            <div className="mt-6">
              <Link href="/admin/pages/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Page
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        <div className="text-sm text-gray-500">/{page.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.author.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {page.status === 'PUBLISHED' && (
                            <a
                              href={`/${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-900"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/pages/${page.id}/edit`}
                            className="text-primary hover:text-primary/80"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id, page.title)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{pages.length}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page - 1 })
                      }
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPagination({ ...pagination, page: pagination.page + 1 })
                      }
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
