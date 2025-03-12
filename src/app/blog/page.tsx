'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/context/AuthContext';
import { Search, PlusCircle, Edit, Trash2, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  featured_image_url: string;
  author: string;
  author_image_url: string;
  author_title: string;
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
}

export default function BlogPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const supabase = createClientComponentClient();

        // Check if user is admin by querying the 'admin' table
        if (user) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('id')
            .eq('id', user.id)
            .single();
          
          if (!adminError && adminData) {
            setIsAdmin(true);
          }
        }

        // Fetch all posts (including drafts for admins)
        const { data: postsData, error: postsError } = await supabase
          .from('blog_posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (postsError) throw postsError;

        // Filter for public view (non-admins only see published posts)
        const filteredPosts = isAdmin 
          ? postsData // Admins see all posts, including drafts
          : postsData.filter((post: any) => post.is_published); // Non-admins only see published posts

        // Set featured post
        const featured = filteredPosts.find((post: BlogPost) => post.is_featured);
        setFeaturedPost(featured || null);

        // Set all posts
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [user]);

  // Filter posts based on search query
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time
  const getReadingTime = (summary: string) => {
    const wordsPerMinute = 200;
    const wordCount = summary.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1;
  };

  // Admin functions
  const togglePostPublished = async (postId: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    
    try {
      const supabase = createClientComponentClient();
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, is_published: !currentStatus } : post
      ));
    } catch (error) {
      console.error('Error toggling post status:', error);
    }
  };

  const togglePostFeatured = async (postId: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    
    try {
      const supabase = createClientComponentClient();
      
      if (currentStatus === false) {
        // Unfeature all other posts
        await supabase
          .from('blog_posts')
          .update({ is_featured: false })
          .eq('is_featured', true);
        
        // Update local state
        setPosts(posts.map(post => ({ ...post, is_featured: post.id === postId ? true : false })));
      }
      
      // Update the selected post
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured: !currentStatus })
        .eq('id', postId);
      
      if (error) throw error;
      
      // If unfeaturing, update local state
      if (currentStatus === true) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, is_featured: false } : post
        ));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!isAdmin) return;
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      const supabase = createClientComponentClient();
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Update local state
      setPosts(posts.filter(post => post.id !== postId));
      if (featuredPost && featuredPost.id === postId) {
        setFeaturedPost(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const createNewPost = () => {
    router.push('/blog/new');
  };

  const editPost = (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/edit/${postId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">Startup Spotlight</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover inspiring stories from innovative startups.
          </p>
          
          {/* Admin Controls */}
          {isAdmin && (
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300 transition-colors"
              >
                {showAdminPanel ? 'Hide Admin Panel' : 'Manage Posts'}
              </button>
              <button
                onClick={createNewPost}
                className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <PlusCircle size={16} />
                New Story
              </button>
            </div>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="mb-16">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 border-b border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-gray-900"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Admin Panel */}
        {isAdmin && showAdminPanel && (
          <div className="mb-16 bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Manage Posts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(post.published_at)}</div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePostPublished(post.id, post.is_published)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.is_published 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          } transition-colors`}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePostFeatured(post.id, post.is_featured)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.is_featured 
                              ? 'bg-black text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {post.is_featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => editPost(post.id, e)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="px-4">
            {/* Featured Post - Large format */}
            {featuredPost && (
              <div className="mb-20">
                <div className="max-w-4xl mx-auto">
                  <Link href={`/blog/${featuredPost.slug}`} className="group">
                    {featuredPost.featured_image_url && (
                      <div className="aspect-[16/9] w-full mb-6 overflow-hidden rounded-lg">
                        <img 
                          src={featuredPost.featured_image_url} 
                          alt={featuredPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                      {featuredPost.title}
                      {!featuredPost.is_published && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          Draft
                        </span>
                      )}
                    </h2>
                    
                    <p className="text-xl text-gray-600 mb-6">
                      {featuredPost.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {featuredPost.author_image_url ? (
                            <img 
                              src={featuredPost.author_image_url} 
                              alt={featuredPost.author} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="text-gray-500" size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{featuredPost.author}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{formatDate(featuredPost.published_at)}</span>
                            <span className="mx-1">·</span>
                            <span>{getReadingTime(featuredPost.summary)} min read</span>
                          </div>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <button
                          onClick={(e) => editPost(featuredPost.id, e)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Latest Posts - Medium-like Grid */}
            {filteredPosts.length > 0 ? (
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-10 border-b pb-4">
                  Latest Stories
                </h2>
                
                <div className="grid gap-12">
                  {filteredPosts.map((post) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.slug}`} 
                      className="grid md:grid-cols-3 gap-8 group hover:bg-gray-50 p-4 -mx-4 rounded-lg transition-colors"
                    >
                      <div className="md:col-span-2 flex flex-col">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                          {post.title}
                          {!post.is_published && (
                            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                              Draft
                            </span>
                          )}
                        </h3>
                        
                        <p className="text-gray-600 text-base mb-4 line-clamp-3 flex-grow">
                          {post.summary}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {post.author_image_url ? (
                                <img 
                                  src={post.author_image_url} 
                                  alt={post.author} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="text-gray-500" size={16} />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{post.author}</div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span>{formatDate(post.published_at)}</span>
                                <span className="mx-1">·</span>
                                <span>{getReadingTime(post.summary)} min read</span>
                              </div>
                            </div>
                          </div>
                          
                          {isAdmin && (
                            <button
                              onClick={(e) => editPost(post.id, e)}
                              className="text-gray-500 hover:text-gray-900"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {post.featured_image_url && (
                        <div className="h-48 md:h-auto bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={post.featured_image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600">No stories found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}