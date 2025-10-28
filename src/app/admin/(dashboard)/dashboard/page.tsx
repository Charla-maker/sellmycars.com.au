import { prisma } from '@/lib/prisma';
import {
  FileText,
  Newspaper,
  Mail,
  Users,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';

async function getDashboardStats() {
  try {
    const [
      totalPages,
      totalPosts,
      totalSubmissions,
      totalUsers,
      recentSubmissions,
      publishedPages,
      publishedPosts,
      newSubmissions,
    ] = await Promise.all([
      prisma.page.count(),
      prisma.post.count(),
      prisma.formSubmission.count(),
      prisma.user.count(),
      prisma.formSubmission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
      }),
      prisma.page.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.formSubmission.count({ where: { status: 'NEW' } }),
    ]);

    return {
      totalPages,
      totalPosts,
      totalSubmissions,
      totalUsers,
      recentSubmissions,
      publishedPages,
      publishedPosts,
      newSubmissions,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPages: 0,
      totalPosts: 0,
      totalSubmissions: 0,
      totalUsers: 0,
      recentSubmissions: [],
      publishedPages: 0,
      publishedPosts: 0,
      newSubmissions: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      name: 'Total Pages',
      value: stats.totalPages,
      subtext: `${stats.publishedPages} published`,
      icon: FileText,
      color: 'bg-blue-500',
      href: '/admin/pages',
    },
    {
      name: 'Blog Posts',
      value: stats.totalPosts,
      subtext: `${stats.publishedPosts} published`,
      icon: Newspaper,
      color: 'bg-purple-500',
      href: '/admin/posts',
    },
    {
      name: 'Form Submissions',
      value: stats.totalSubmissions,
      subtext: `${stats.newSubmissions} new`,
      icon: Mail,
      color: 'bg-green-500',
      href: '/admin/submissions',
    },
    {
      name: 'Users',
      value: stats.totalUsers,
      subtext: 'Active users',
      icon: Users,
      color: 'bg-orange-500',
      href: '/admin/users',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.subtext}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Form Submissions</h2>
            <a href="/admin/submissions" className="text-sm text-primary hover:text-primary/80">
              View all
            </a>
          </div>

          <div className="space-y-4">
            {stats.recentSubmissions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No submissions yet</p>
            ) : (
              stats.recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {submission.name}
                    </p>
                    <p className="text-xs text-gray-500">{submission.email}</p>
                    {submission.make && submission.model && (
                      <p className="text-xs text-gray-600 mt-1">
                        {submission.make} {submission.model}
                        {submission.year && ` (${submission.year})`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(submission.submittedAt), 'MMM d')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <a
              href="/admin/pages/new"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Create New Page</p>
                <p className="text-xs text-gray-500">Add a new page to your website</p>
              </div>
            </a>

            <a
              href="/admin/posts/new"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                <Newspaper className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Write Blog Post</p>
                <p className="text-xs text-gray-500">Create a new blog post</p>
              </div>
            </a>

            <a
              href="/admin/media"
              className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Upload Media</p>
                <p className="text-xs text-gray-500">Add images or documents</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
