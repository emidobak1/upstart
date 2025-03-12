'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Link as LinkIcon, Image, AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { uploadBlogImage } from '@/utils/supabaseStorage';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image_url: string;
  author: string;
  author_image_url: string;
  author_title: string;
  is_published: boolean;
  is_featured: boolean;
}

export default function EditBlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // File upload state
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image_url: '',
    author: '',
    author_image_url: '',
    author_title: '',
    is_published: false,
    is_featured: false
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user?.id) {
        router.push('/login');
        return;
      }
  
      try {
        const supabase = createClientComponentClient();
  
        // Check if the user is in the 'admin' table
        const { data: adminData, error: adminError } = await supabase
          .from('admin')
          .select('id')
          .eq('id', user.id)
          .single();
  
        if (!adminError && adminData) {
          setIsAdmin(true);
          fetchPostData(); // Fetch post data if the user is an admin
        } else {
          // Redirect non-admin users
          router.push('/blog');
          return;
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/blog');
      }
    };
  
    checkAdminAccess();
  }, [user, router]);

  const fetchPostData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const supabase = createClientComponentClient();
      
      // Fetch post data
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (postError) throw postError;
      
      setFormData({
        ...postData
      });
    } catch (error) {
      console.error('Error fetching post data:', error);
      setError('Failed to load post data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof BlogPost] }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleTitleBlur = () => {
    if (formData.title && !formData.slug) {
      generateSlug();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    
    setUploading(true);
    try {
      // Use the uploadBlogImage utility to upload to the blog_picture bucket
      const imageUrl = await uploadBlogImage(imageFile);
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        featured_image_url: imageUrl
      }));
      
      // Reset file input
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image');
      // If your error state variable is named differently, adjust this line
    } finally {
      setUploading(false);
    }
  };
  

  const updatePost = async () => {
    if (!id) return;
    
    setSaving(true);
    setError(null);
    
    try {
      // Validation
      if (!formData.title) throw new Error('Title is required');
      if (!formData.slug) throw new Error('Slug is required');
      if (!formData.content) throw new Error('Content is required');
      if (!formData.author) throw new Error('Author is required');
      
      const supabase = createClientComponentClient();
      
      // Update existing post
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          slug: formData.slug,
          summary: formData.summary,
          content: formData.content,
          featured_image_url: formData.featured_image_url,
          author: formData.author,
          author_image_url: formData.author_image_url,
          author_title: formData.author_title,
          is_published: formData.is_published,
          is_featured: formData.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Redirect to blog
      router.push('/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      const supabase = createClientComponentClient();
      
      // Delete post
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      router.push('/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to access this page.</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-medium text-gray-900">Edit Post</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={updatePost}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleTitleBlur}
                placeholder="Enter post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            {/* Slug */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Generate from title
                </button>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">/blog/</span>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="post-url-slug"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Brief summary of the post (appears in previews)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            {/* Content */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="mb-2 flex gap-2">
                <button
                  type="button"
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                  title="Insert heading"
                >
                  <AlignJustify size={16} />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                  title="Insert link"
                >
                  <LinkIcon size={16} />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
                  title="Insert image"
                >
                  <Image size={16} />
                </button>
              </div>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your post content here (HTML supported)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                rows={15}
                required
              />
            </div>
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Publishing</h2>
              
              <div className="space-y-4">
                {/* Status toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Status</h3>
                    <p className="text-xs text-gray-500">Publish or save as draft</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('is_published')}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.is_published 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    } transition-colors`}
                  >
                    {formData.is_published ? 'Published' : 'Draft'}
                  </button>
                </div>
                
                {/* Featured toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Featured</h3>
                    <p className="text-xs text-gray-500">Highlight on blog homepage</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleChange('is_featured')}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.is_featured 
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {formData.is_featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h2>
              
              {formData.featured_image_url ? (
                <div className="mb-4">
                  <div className="w-full h-40 rounded overflow-hidden bg-gray-100 mb-2">
                    <img 
                      src={formData.featured_image_url} 
                      alt="Featured" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {imageFile ? (
                    <p className="text-sm text-gray-600">{imageFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No image selected</p>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Select Image
                </button>
                {imageFile && (
                  <button
                    type="button"
                    onClick={uploadImage}
                    disabled={uploading}
                    className="flex-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Author Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Author Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="author_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Title
                  </label>
                  <input
                    type="text"
                    id="author_title"
                    name="author_title"
                    value={formData.author_title}
                    onChange={handleInputChange}
                    placeholder="CEO & Founder"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="author_image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Image URL
                  </label>
                  <input
                    type="url"
                    id="author_image_url"
                    name="author_image_url"
                    value={formData.author_image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/author.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl shadow-md p-6 border border-red-200">
              <h2 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h2>
              
              {showDeleteConfirm ? (
                <div>
                  <p className="text-sm text-red-600 mb-4">Are you sure? This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={deletePost}
                      disabled={saving}
                      className="flex-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                      {saving ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-3 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}