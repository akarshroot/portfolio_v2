import React from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, blogCategories } from '../../data/blogs';
import BlogCard from '../../components/BlogCard';
import { Helmet } from 'react-helmet';
import { BlogPost, BlogCategory } from '../../types/blog';

const BlogListing: React.FC = () => {
  const allBlogs = getAllBlogs();

  return (
    <>
      <Helmet>
        <title>Technical Blog | Akarsh Tripathi - Backend Engineer & System Architect</title>
        <meta name="description" content="Read technical articles on backend development, system design, DevOps, machine learning, and software engineering career growth by Akarsh Tripathi." />
        <meta name="keywords" content="Backend Development, System Design, DevOps, Machine Learning, Software Engineering, Node.js, Python, Microservices, API Design" />
        <link rel="canonical" href="https://akarshtripathi.com/blogs" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Technical Blog | Akarsh Tripathi" />
        <meta property="og:description" content="Technical articles on backend development, system design, and software engineering" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://akarshtripathi.com/blogs" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Technical Blog | Akarsh Tripathi" />
        <meta name="twitter:description" content="Technical articles on backend development, system design, and software engineering" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Akarsh Tripathi's Technical Blog",
            "description": "Technical articles on backend development, system design, and software engineering",
            "url": "https://akarshtripathi.com/blogs",
            "author": {
              "@type": "Person",
              "name": "Akarsh Tripathi",
              "url": "https://akarshtripathi.com"
            },
            "blogPost": allBlogs.map(blog => ({
              "@type": "BlogPosting",
              "headline": blog.title,
              "description": blog.excerpt,
              "url": `https://akarshtripathi.com/blogs/${blog.category}/${blog.slug}`,
              "datePublished": blog.publishedAt,
              "author": {
                "@type": "Person",
                "name": "Akarsh Tripathi"
              }
            }))
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--night)', overflow: 'auto', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <header className="mb-12">
            <nav className="mb-6">
              <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--rose-quartz)' }}>
                <Link 
                  to="/" 
                  className="hover:underline"
                >
                  Home
                </Link>
                <span>⋮</span>
                <span style={{ color: 'var(--lavender-blush)' }}>
                  Blogs
                </span>
              </div>
            </nav>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--lavender-blush)' }}>
              Blog
            </h1>
            <p className="text-lg mb-6" style={{ color: 'var(--silver)' }}>
              Insights on backend development, system design, and software engineering
            </p>
          </header>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--lavender-blush)' }}>
              Categories
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogCategories.map((category: BlogCategory) => (
                <Link
                  key={category.id}
                  to={`/blogs/${category.slug}`}
                  className="p-6 border rounded-lg transition-all duration-300 block group hover:transform hover:scale-105"
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
                  <h3 className="font-bold mb-2 group-hover:underline" style={{ color: 'var(--lavender-blush)' }}>
                    {category.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--silver)' }}>
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Posts */}
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--lavender-blush)' }}>
              Recent Posts
            </h2>
            {allBlogs.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {allBlogs.map((blog: BlogPost) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl" style={{ color: 'var(--silver)' }}>
                  No blog posts yet. Stay tuned!
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default BlogListing;
