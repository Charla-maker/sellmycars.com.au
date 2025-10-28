'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Mail,
  Search,
  Download,
  Loader2,
  Phone,
  Car,
  MessageSquare,
  Eye,
  Ban,
  Archive,
  CheckCircle,
  Reply,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  make: string | null;
  model: string | null;
  year: string | null;
  condition: string | null;
  message: string | null;
  status: string;
  submittedAt: string;
  ipAddress: string | null;
  source: string | null;
};

type SubmissionsResponse = {
  success: boolean;
  data: {
    data: Submission[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/contact?${params}`);
      const result: SubmissionsResponse = await response.json();

      if (result.success) {
        setSubmissions(result.data.data);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [pagination.page, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Make', 'Model', 'Year', 'Condition', 'Message', 'Status'];
    const rows = submissions.map(sub => [
      format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm'),
      sub.name,
      sub.email,
      sub.phone || '',
      sub.make || '',
      sub.model || '',
      sub.year || '',
      sub.condition || '',
      sub.message || '',
      sub.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      NEW: 'bg-blue-100 text-blue-800',
      READ: 'bg-gray-100 text-gray-800',
      REPLIED: 'bg-green-100 text-green-800',
      SPAM: 'bg-red-100 text-red-800',
      ARCHIVED: 'bg-yellow-100 text-yellow-800',
    };

    const icons = {
      NEW: Mail,
      READ: Eye,
      REPLIED: CheckCircle,
      SPAM: Ban,
      ARCHIVED: Archive,
    };

    const Icon = icons[status as keyof typeof icons] || Mail;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
          styles[status as keyof typeof styles] || styles.NEW
        }`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const filteredSubmissions = searchTerm
    ? submissions.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.model?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : submissions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Form Submissions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage inquiries from potential car sellers
          </p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" disabled={submissions.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {['NEW', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED'].map((status) => {
          const count = submissions.filter((s) => s.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
              className={`bg-white rounded-lg border-2 p-4 text-left transition-all ${
                statusFilter === status
                  ? 'border-primary shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{count}</span>
                {getStatusBadge(status)}
              </div>
              <p className="mt-2 text-xs text-gray-600 capitalize">{status.toLowerCase()}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search by name, email, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter
                ? `No submissions with status "${statusFilter}"`
                : 'No form submissions yet. They will appear here when customers fill out the contact form.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        {submission.phone && (
                          <div className="text-xs text-gray-400 flex items-center mt-1">
                            <Phone className="w-3 h-3 mr-1" />
                            {submission.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.make || submission.model ? (
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Car className="w-4 h-4 mr-2 text-gray-400" />
                              <span>
                                {submission.make} {submission.model}
                                {submission.year && ` (${submission.year})`}
                              </span>
                            </div>
                            {submission.condition && (
                              <div className="text-xs text-gray-500 mt-1 capitalize">
                                {submission.condition}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(submission.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
                        <div className="text-xs text-gray-400">
                          {format(new Date(submission.submittedAt), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
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
                    Showing <span className="font-medium">{filteredSubmissions.length}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
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

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Name:</span>
                    <span className="text-gray-900">{selectedSubmission.name}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Email:</span>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedSubmission.email}
                    </a>
                  </div>
                  {selectedSubmission.phone && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 w-24">Phone:</span>
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              {(selectedSubmission.make || selectedSubmission.model) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Vehicle Details</h3>
                  <div className="space-y-2">
                    {selectedSubmission.make && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-24">Make:</span>
                        <span className="text-gray-900">{selectedSubmission.make}</span>
                      </div>
                    )}
                    {selectedSubmission.model && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-24">Model:</span>
                        <span className="text-gray-900">{selectedSubmission.model}</span>
                      </div>
                    )}
                    {selectedSubmission.year && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-24">Year:</span>
                        <span className="text-gray-900">{selectedSubmission.year}</span>
                      </div>
                    )}
                    {selectedSubmission.condition && (
                      <div className="flex items-center text-sm">
                        <span className="font-medium text-gray-700 w-24">Condition:</span>
                        <span className="text-gray-900 capitalize">
                          {selectedSubmission.condition}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              {selectedSubmission.message && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    {selectedSubmission.message}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Submission Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Status:</span>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-24">Submitted:</span>
                    <span className="text-gray-900">
                      {format(new Date(selectedSubmission.submittedAt), 'PPpp')}
                    </span>
                  </div>
                  {selectedSubmission.source && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 w-24">Source:</span>
                      <span className="text-gray-900 text-xs break-all">
                        {selectedSubmission.source}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Close
              </Button>
              <Button>
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
