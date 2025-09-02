import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';

interface BlogCardProps {
  blog: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="border rounded-lg p-6 transition-all duration-300 hover:transform hover:scale-105"
      style={{ 
        backgroundColor: 'var(--night)', 
        borderColor: 'var(--mountbatten-pink)',
        borderWidth: '1px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--rose-quartz)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(162, 136, 166, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--mountbatten-pink)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--lavender-blush)' }}>
            <Link 
              to={`/blogs/${blog.category}/${blog.slug}`}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
              style={{ 
                '--tw-ring-color': 'var(--rose-quartz)',
                '--tw-ring-offset-color': 'var(--night)'
              } as React.CSSProperties}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--rose-quartz)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {blog.title}
            </Link>
          </h2>
          
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--silver)' }}>
            {blog.excerpt}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: 'var(--mountbatten-pink)', 
                color: 'var(--night)' 
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm" style={{ color: 'var(--rose-quartz)' }}>
          <time dateTime={blog.publishedAt}>
            {formatDate(blog.publishedAt)}
          </time>
          <span>{blog.readTime} min read</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
