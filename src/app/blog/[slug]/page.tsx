'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Calendar, User, Share2, Edit, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image_url: string;
  author: string;
  author_image_url: string;
  author_title: string;
  published_at: string;
  is_published: boolean;
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
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
        
        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (postError) throw postError;
        
        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        // If user is not admin and post is not published, don't show it
        if (!isAdmin && !postData.is_published) {
          setError('This post is not available');
          setLoading(false);
          return;
        }
        
        setPost(postData);
        
        // Fetch related posts (excluding the current post)
        const { data: relatedData, error: relatedError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .neq('id', postData.id)
          .order('published_at', { ascending: false })
          .limit(3);
          
        if (relatedError) throw relatedError;
        
        setRelatedPosts(relatedData || []);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load blog post. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostDetail();
  }, [slug, user]);

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
  const getReadingTime = () => {
    if (!post) return 1;
    
    const wordsPerMinute = 200;
    const text = post.summary + ' ' + post.content;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1;
  };
  
  // Share functionality
  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.summary || 'Check out this article!',
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Error copying to clipboard:', error));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center border border-gray-200">
          <div className="text-red-500 mb-4 text-5xl">😕</div>
          <h2 className="text-2xl font-medium text-gray-800 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the article you're looking for."}</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> All stories
        </Link>
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="float-right">
            <Link
              href={`/blog/edit/${post.id}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <Edit size={16} className="mr-2" /> Edit Story
            </Link>
          </div>
        )}
      </div>
      
      <article className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Article Header */}
        <header className="mb-10">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          {/* Subtitle/Summary */}
          <h2 className="text-xl sm:text-2xl text-gray-600 mb-8 font-serif">
            {post.summary}
          </h2>
          
          {/* Author and Meta Info */}
          <div className="flex items-center justify-between pb-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {post.author_image_url ? (
                  <img 
                    src={post.author_image_url} 
                    alt={post.author} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-500" size={24} />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.author}</div>
                <div className="text-gray-600 text-sm">
                  {post.author_title || "Contributor"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{getReadingTime()} min read</span>
              </div>
              <button 
                onClick={sharePost}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share this article"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Featured Image */}
        {post.featured_image_url && (
          <figure className="my-10">
            <img 
              src={post.featured_image_url} 
              alt={post.title} 
              className="w-full h-auto rounded-lg"
            />
          </figure>
        )}
        
        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none font-serif prose-headings:font-sans prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Author Bio */}
        <div className="border-t border-b border-gray-200 py-10 my-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {post.author_image_url ? (
                <img 
                  src={post.author_image_url} 
                  alt={post.author} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-gray-500" size={32} />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Written by {post.author}</h3>
              <p className="text-gray-600 mb-2">{post.author_title || "Contributor"}</p>
              
              <button
                onClick={sharePost}
                className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <Share2 size={14} className="mr-1" /> Share this story
              </button>
            </div>
          </div>
        </div>
      </article>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 border-t border-gray-100">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">More Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link 
                key={relatedPost.id} 
                href={`/blog/${relatedPost.slug}`} 
                className="group"
              >
                {relatedPost.featured_image_url && (
                  <div className="aspect-[3/2] mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={relatedPost.featured_image_url} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {relatedPost.summary}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                    {relatedPost.author_image_url ? (
                      <img 
                        src={relatedPost.author_image_url} 
                        alt={relatedPost.author} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-500" size={12} />
                    )}
                  </div>
                  <span>{relatedPost.author}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="flex justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
          >
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all stories</span>
          </Link>
          
          {relatedPosts.length > 0 && (
            <Link
              href={`/blog/${relatedPosts[0].slug}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
            >
              <span>Next story</span>
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}