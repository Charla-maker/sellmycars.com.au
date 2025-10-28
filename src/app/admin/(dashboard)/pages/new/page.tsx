'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewPagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImage: '',
    status: 'DRAFT',
    featuredImage: '',
    template: 'default',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const dataToSubmit = {
        ...formData,
        status: publishNow ? 'PUBLISHED' : formData.status,
        publishedAt: publishNow ? new Date().toISOString() : undefined,
      };

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          alert(result.error || 'Failed to create page');
        }
        setLoading(false);
        return;
      }

      router.push('/admin/pages');
      router.refresh();
    } catch (error) {
      console.error('Error creating page:', error);
      alert('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details to create a new page
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Page Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="About Us"
              required
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">sellmycars.com.au/</span>
              <Input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="about-us"
                required
                className={errors.slug ? 'border-red-500' : ''}
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug[0]}</p>
            )}
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description of the page..."
              rows={3}
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional short description used in previews
            </p>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>

          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <Input
              id="metaTitle"
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              placeholder="SEO title (max 60 characters)"
              maxLength={60}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              placeholder="SEO description (max 160 characters)"
              rows={3}
              maxLength={160}
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <Input
              id="metaKeywords"
              type="text"
              value={formData.metaKeywords}
              onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div>
            <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-2">
              Open Graph Image URL
            </label>
            <Input
              id="ogImage"
              type="url"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Page Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Page Settings</h2>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <Input
              id="featuredImage"
              type="url"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              id="template"
              value={formData.template}
              onChange={(e) => setFormData({ ...formData, template: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="default">Default</option>
              <option value="full-width">Full Width</option>
              <option value="landing">Landing Page</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 -mb-4 rounded-b-xl">
          <Link href="/admin/pages">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Publish Now
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
