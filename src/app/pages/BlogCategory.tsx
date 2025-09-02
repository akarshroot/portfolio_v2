import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogsByCategory, getCategoryBySlug, blogCategories } from '../../data/blogs';
import BlogCard from '../../components/BlogCard';
import { Helmet } from 'react-helmet';
import { BlogPost, BlogCategory as BlogCategoryType } from '../../types/blog';

const BlogCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  if (!category) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--night)', color: 'var(--lavender-blush)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/blogs" className="text-blue-400 hover:underline">← Back to all blogs</Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryBySlug(category);
  const blogs = getBlogsByCategory(category);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--night)', color: 'var(--lavender-blush)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/blogs" className="text-blue-400 hover:underline">← Back to all blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{categoryInfo.name} Articles | Akarsh Tripathi - Technical Blog</title>
        <meta name="description" content={`${categoryInfo.description} - Read ${blogs.length} articles by Akarsh Tripathi.`} />
        <meta name="keywords" content={`${categoryInfo.name}, ${blogs.flatMap(blog => blog.tags).join(', ')}, Akarsh Tripathi`} />
        <link rel="canonical" href={`https://akarshtripathi.com/blogs/${category}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${categoryInfo.name} | Akarsh Tripathi`} />
        <meta property="og:description" content={categoryInfo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://akarshtripathi.com/blogs/${category}`} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${categoryInfo.name} Articles`,
            "description": categoryInfo.description,
            "url": `https://akarshtripathi.com/blogs/${category}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": blogs.length,
              "itemListElement": blogs.map((blog, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "BlogPosting",
                  "headline": blog.title,
                  "description": blog.excerpt,
                  "url": `https://akarshtripathi.com/blogs/${blog.category}/${blog.slug}`,
                  "datePublished": blog.publishedAt,
                  "author": {
                    "@type": "Person",
                    "name": "Akarsh Tripathi"
                  }
                }
              }))
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--night)', overflow: 'auto', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--rose-quartz)' }}>
              <Link 
                to="/" 
                className="hover:underline"
              >
                Home
              </Link>
              <span>⋮</span>
              <Link 
                to="/blogs" 
                className="hover:underline"
              >
                Blogs
              </Link>
              {categoryInfo && (
                <>
                  <span>⋮</span>
                  <span style={{ color: 'var(--lavender-blush)' }}>
                    {categoryInfo.name}
                  </span>
                </>
              )}
            </div>
          </nav>

          {/* Category Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--lavender-blush)' }}>
              {categoryInfo.name}
            </h1>
            <p className="text-lg mb-6" style={{ color: 'var(--silver)' }}>
              {categoryInfo.description}
            </p>
            <p style={{ color: 'var(--rose-quartz)' }}>
              {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} in this category
            </p>
          </header>

          {/* Blog Posts */}
          {blogs.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: BlogPost) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl mb-4" style={{ color: 'var(--silver)' }}>
                No posts in this category yet.
              </p>
              <Link 
                to="/blogs"
                className="hover:underline"
                style={{ color: 'var(--rose-quartz)' }}
              >
                Browse all blogs →
              </Link>
            </div>
          )}

          {/* Other Categories */}
          {blogs.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-100/20">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--lavender-blush)' }}>
                Other Categories
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {blogCategories
                  .filter((cat: BlogCategoryType) => cat.slug !== category)
                  .map((cat: BlogCategoryType) => (
                    <Link
                      key={cat.id}
                      to={`/blogs/${cat.slug}`}
                      className="p-4 border rounded-lg transition-all duration-300 block hover:transform hover:scale-105"
                      style={{ 
                        backgroundColor: 'var(--night)',
                        borderColor: 'var(--mountbatten-pink)',
                        borderWidth: '1px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--rose-quartz)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(162, 136, 166, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--mountbatten-pink)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                      }}
                    >
                      <h3 className="font-bold mb-2" style={{ color: 'var(--lavender-blush)' }}>
                        {cat.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--silver)' }}>
                        {cat.description}
                      </p>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogCategory;
